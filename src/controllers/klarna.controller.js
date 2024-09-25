/* eslint-disable no-unreachable */
const klarnaModel = require('../models/klarna.model.js');
const { unmigrateKlarnaStruct } = require('../helpers/orderUtils.js');
const { createOrderFromKlarnaStruct } = require('./order.controller.js');
const Payments = require('../models/payments.model');
const OrderModel = require('../models/order.model.js');
const OrderItemsModel = require('../models/orderItems.model');
const { sendResponse } = require('../helpers/apiResponse');
const StoreInfo = require('../models/storeInfo.model');
const Shipping = require('../models/shipping.model');
const { calculateVatAmount } = require('../helpers/utils.js');
const PaymentRefundModel = require('../models/paymentRefund.model');

// Read here for more information
// https://docs.klarna.com/klarna-checkout/additional-resources/confirm-purchase/

const ORDER_STATUS = {
    AUTHORIZED: 'AUTHORIZED',
    PAID: 'PAID',
    CAPTURED: 'CAPTURED',
    CANCELLED: 'CANCELLED',
};

const updateOrderAfterCancelation = async (order_id) => {
    // update the order status and the product qty
    const products = await OrderItemsModel.getItemsByOrderId(order_id);
    const updatedProducts = products?.reduce((acc, product) => {
        if (!product.returned) {
            acc.push({ ...product, quantity: -product.quantity });
        }
        return acc;
    }, []);
    await OrderModel.updateProductQuantities(updatedProducts);
    return products;
};

const klarna_paymentrequests = async (orderData) => {
    try {
        const session = await klarnaModel.createKlarnaSession(orderData);
        return {
            success: true,
            session_id: session.order_id,
            html_snippet: session.html_snippet,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to create Klarna payment request',
            error: error.message,
        };
    }
};

// Get order status from Klarna order management
const getOrder = async (req, res) => {
    const { klarna_order_id } = req.query;

    if (!klarna_order_id) {
        return res.status(400).json({
            success: false,
            message: 'Missing Klarna order ID',
        });
    }

    try {
        const order = await klarnaModel.getOrder(klarna_order_id);
        return res.status(200).json({
            success: true,
            order: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve Klarna order status',
            error: error.message,
        });
    }
};

const getOrderStatus = async (req, res) => {
    const { klarna_order_id } = req.query;
    try {
        const order = await klarnaModel.getOrderStatus(klarna_order_id);
        return res.status(200).json({
            success: true,
            status: order.status,
            payment_status: order.payment_status,
            session_id: order.order_id,
            order: order, // TODO:_Remove
        });
    } catch (error) {
        return sendResponse(res, 400, 'Klarna order status is not authorized', 'NOT FOUND', null, null);
    }
};

const acknowledgeKlarnaCheckoutOrder = async (req, res) => {
    const { klarna_order_id } = req.body;
    try {
        const success = await klarnaModel.acknowledgeKlarnaOrder(klarna_order_id);
        if (success) {
            return res.status(200).json({
                success: true,
                message: 'Klarna order successfully acknowledged',
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to acknowledge Klarna order',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to acknowledge Klarna order',
            error: error.message,
        });
    }
};

const receivePush = async (req, res) => {
    const { klarna_order_id } = req.query;
    try {
        if (!klarna_order_id) {
            throw new Error('Missing Klarna order ID');
        }

        const existingPayment = await Payments.getPaymentsByPaymentId(klarna_order_id);

        if (existingPayment.length > 0) {
            return sendResponse(res, 200, 'Order already created', 'CREATED', null, null);
        }

        const response = await OrderModel.isOrderCommited(klarna_order_id);
        let order_id = response?.order_id;
        if (!response.ok) {
            // Klarna order not found - i should create it here
            const klarnaOrder = await klarnaModel.getOrder(klarna_order_id);
            const orderData = await unmigrateKlarnaStruct(klarnaOrder);
            order_id = await createOrderFromKlarnaStruct(orderData);
        }

        const result = await klarnaModel.completeOrderValidation(klarna_order_id, order_id);

        if (result.success) {
            return res.status(200).json(result);
        }

        return res.status(500).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to report Klarna order status',
            error: error.message,
        });
    }
};

const createOrder = async (req, res) => {
    const { klarna_order_id } = req.body;

    const existingPayment = await Payments.getPaymentsByPaymentId(klarna_order_id);

    if (existingPayment.length > 0) {
        return sendResponse(res, 200, 'Order already created', 'CREATED', null, null);
    }

    try {
        // Get the order status from the ordermanagment
        const klarnaOrder = await klarnaModel.getOrder(klarna_order_id);
        if (klarnaOrder.status !== ORDER_STATUS.AUTHORIZED) {
            return sendResponse(res, 400, 'Klarna order status is not authorized', null, null, null);
        }

        const orderData = await unmigrateKlarnaStruct(klarnaOrder);
        const order_id = await createOrderFromKlarnaStruct(orderData);

        if (!order_id) {
            throw new Error('Failed to create order');
        }

        // 1.There should be an attempt to acknowledge the order on the confirmation page.
        const error = await klarnaModel.validateOrderDetails(klarnaOrder, order_id);

        if (error) {
            throw new Error('Failed to validate order details - ' + error);
        }

        const accRes = klarnaModel.acknowledgeKlarnaOrder(klarna_order_id);
        if (!accRes) {
            throw new Error('Failed to acknowledge Klarna order');
        }

        // 2. If the order is acknowledged, the order status should be updated to CONFIRMED.

        return sendResponse(res, 200, 'Order created successfully', null, null, null);
    } catch (error) {
        return sendResponse(res, 500, 'Failed to create order from Klarna structure', null, error.message, null);
    }
};

const captureOrder = async (req, res) => {
    const { klarna_order_id } = req.body;

    try {
        const klarnaOrder = await klarnaModel.getOrder(klarna_order_id);
        if (klarnaOrder.status !== ORDER_STATUS.AUTHORIZED) {
            return sendResponse(res, 400, 'Klarna order status is not authorized for capture', null, null, null);
        }

        // Prepare capture details
        const captureDetails = {
            captured_amount: klarnaOrder.order_amount,
            order_lines: klarnaOrder.order_lines,
            description: 'Capturing payment for order ' + klarna_order_id,
        };

        // Capture the order
        const captureResult = await klarnaModel.captureKlarnaOrder(klarna_order_id, captureDetails);

        if (!captureResult.success) {
            throw new Error('Order is canceled. Capture not possible');
        }

        // Update payment status to CAPTURED
        await Payments.updatePaymentStatus(klarna_order_id, 5);

        return sendResponse(res, 200, 'Order captured successfully', null, captureResult.data, null);
    } catch (error) {
        return sendResponse(res, 500, 'Failed to capture order', null, error.message, null);
    }
};

const getOrderCaptures = async (req, res) => {
    const { orderId } = req.params;

    try {
        // Fetch captures for the given order ID
        const result = await klarnaModel.fetchOrderCaptures(orderId);

        if (result.success) {
            return res.status(200).json({
                message: 'Order captures fetched successfully',
                data: result.data,
            });
        } else {
            return res.status(500).json({
                message: 'Failed to fetch order captures',
                error: result.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while fetching order captures',
            error: error.message,
        });
    }
};

const cancelKlarnaOrder = async (req, res) => {
    const { klarna_order_id, shipping_name } = req.body;

    try {
        const [existingPayment] = await Payments.getPaymentsByPaymentId(klarna_order_id);
        if (!existingPayment) {
            return sendResponse(res, 404, 'Error', 'Payment not found.', 'ec_order_cancel_klarna_error', null);
        }

        // Get the order status from the ordermanagment
        const klarnaOrder = await klarnaModel.getOrder(klarna_order_id);

        if (klarnaOrder.status === ORDER_STATUS.CANCELLED) {
            return sendResponse(
                res,
                400,
                'Error',
                'Klarna order is already cancelled',
                'ec_order_cancel_klarna_cancel_alreadyCanceld',
                null,
            );
        }

        // Not captured yet - just cancel it
        if (klarnaOrder.status === ORDER_STATUS.AUTHORIZED) {
            const success = await klarnaModel.cancelKlarnaOrder(klarna_order_id);
            if (success) {
                await Payments.updatePaymentsStatusAndPaymentId({
                    id: existingPayment.id,
                    payment_id: existingPayment.payment_id,
                    status: 7, // CANCELLED
                });

                await updateOrderAfterCancelation(existingPayment.order_id);

                let merchantData = {};
                try {
                    if (klarnaOrder.merchant_data) {
                        merchantData = JSON.parse(klarnaOrder.merchant_data);
                    }
                } catch (error) {
                    merchantData = {};
                }

                let storeTax = merchantData.tax;
                if (!storeTax) {
                    let [tax] = await StoreInfo.getTax();
                    storeTax = tax.tax_percentage;
                }

                const orginalAmount = klarnaOrder.original_order_amount / 100;
                const shippingAmount = (klarnaOrder.selected_shipping_option?.price || 0) / 100;
                const subTotalAmount = orginalAmount - shippingAmount;
                const newTax = calculateVatAmount(orginalAmount, storeTax);

                await OrderModel.updateOrderAfterCancelleation({
                    order_id: existingPayment.order_id,
                    shipping_price: shippingAmount,
                    sub_total: subTotalAmount,
                    tax: newTax,
                    total: orginalAmount,
                    type_id: 3, // Cancelled
                });

                return sendResponse(
                    res,
                    200,
                    'ec_order_cancel_klarna_cancel_success',
                    'Klarna order successfully canceled. Order and product quantities updated.',
                    null,
                    {
                        payment_id: existingPayment.payment_id,
                        status: 7,
                        type_id: 3,
                        sub_total: subTotalAmount,
                        total: orginalAmount,
                        tax: newTax,
                        shipping_price: shippingAmount,
                        type_name: 'ec_orderType_canceled',
                    }, // 7 - payment CANCELLED, 3 - order cancelled
                );
            } else {
                return sendResponse(
                    res,
                    403,
                    'Error',
                    'Cancel not allowed (e.g. order has captures or is closed)',
                    'ec_order_cancel_klarna_alreayCaptured',
                    null,
                );
            }
        } else if (klarnaOrder.status === ORDER_STATUS.CAPTURED) {
            // We need to make a refund here
            req.body.shipping_name = shipping_name;
            return refundOrder(req, res, klarnaOrder, existingPayment);
        } else {
            return sendResponse(
                res,
                500,
                'Error',
                'Failed to cancel Klarna order',
                'ec_order_cancel_klarna_error',
                null,
            );
        }
    } catch (error) {
        return sendResponse(
            res,
            500,
            error.message,
            'Failed to cancel Klarna order',
            'ec_order_cancel_klarna_error',
            null,
        );
    }
};

const updateKlarnaOrderLines = async (klarnaOrder, deletedItems, updatedItems, updatedOrder) => {
    let orderLines = klarnaOrder.order_lines;

    const newShippingPrice = +updatedOrder.shipping_price;
    const newAmount = updatedOrder.total;
    let merchantData = {};
    try {
        if (klarnaOrder.merchant_data) {
            merchantData = JSON.parse(klarnaOrder.merchant_data);
        }
    } catch (error) {
        merchantData = {};
    }
    const newAmountInOre = Math.round(newAmount * 100);

    klarnaOrder.order_amount = newAmountInOre;

    let storeTax = merchantData.tax;
    if (!storeTax) {
        let [tax] = await StoreInfo.getTax();
        storeTax = tax.tax_percentage;
    }

    let refundedOrderLines = [];
    orderLines = orderLines.reduce((acc, item) => {
        // Update it when the new order has got a shipping fee
        if (item.type === 'shipping_fee') {
            const shippingFee = { ...item };
            if (newShippingPrice) {
                shippingFee.unit_price = newShippingPrice * 100;
                shippingFee.total_amount = newShippingPrice * 100;
                shippingFee.tax_rate = Math.round(storeTax * 100);
                shippingFee.tax_amount = calculateVatAmount(newShippingPrice * 100, storeTax);
                shippingFee.total_tax_amount = calculateVatAmount(newShippingPrice * 100, storeTax);
            }
            acc.push(shippingFee);
            return acc;
        }

        if (deletedItems?.length) {
            const isDeleted = deletedItems.find(deletedItem => +deletedItem.product_id === +item.reference);

            if (isDeleted) {
                // TODO: Handle when the qty is 'g'
                let refundedQuantity = isDeleted.refundedQuantity;
                let discountInOres = isDeleted.discount * 100;

                if (item.quantity_unit === 'g') {
                    refundedQuantity = refundedQuantity * 1000;
                    discountInOres = discountInOres / 1000;
                }

                item.quantity = item.quantity - refundedQuantity;
                item.total_amount = item.quantity * item.unit_price;
                item.total_discount_amount = discountInOres;
                item.total_tax_amount = calculateVatAmount(item.total_amount, storeTax);
                refundedOrderLines.push(item);
                return acc; // Skip this item but return the accumulator
            }
        }

        if (updatedItems?.length) {
            const isUpdated = updatedItems.find(updatedItem => +updatedItem.product_id === +item.reference);

            if (isUpdated) {
                let discountInOres = (isUpdated.discount || 0) * 100;
                let unitPriceInOres = isUpdated.price * 100;
                let quantity = isUpdated.quantity;
                let removedQty = isUpdated.oldQuantity
                    ? isUpdated.oldQuantity - isUpdated.quantity
                    : isUpdated.quantity;
                let unit_name = isUpdated.unit_name;

                // If the product is measured in grams rather than kilograms
                if (item.quantity_unit === 'g' || !Number.isInteger(quantity)) {
                    unitPriceInOres = unitPriceInOres / 1000;
                    discountInOres = discountInOres / 1000;
                    quantity = quantity * 1000;
                    removedQty = removedQty * 1000;
                    unit_name = 'g';
                }

                // When authorized
                const totalAmountAfterDiscount = Math.round((unitPriceInOres - discountInOres) * quantity);
                const totalTaxAmount = calculateVatAmount(totalAmountAfterDiscount, storeTax);
                const newItem = {
                    ...item,
                    unit_price: unitPriceInOres,
                    quantity_unit: unit_name,

                    total_discount_amount: Math.round(discountInOres * quantity),
                    total_tax_amount: Math.round(totalTaxAmount),
                    quantity: quantity,
                    total_amount: totalAmountAfterDiscount,
                };

                // When Captured
                const totalAmountAfterDiscount2 = Math.round((unitPriceInOres - discountInOres) * removedQty);
                const totalTaxAmount2 = calculateVatAmount(totalAmountAfterDiscount2, storeTax);
                refundedOrderLines.push({
                    ...newItem,
                    total_discount_amount: Math.round(discountInOres * removedQty),
                    total_tax_amount: Math.round(totalTaxAmount2),
                    quantity: Math.round(removedQty),
                    total_amount: totalAmountAfterDiscount2,
                });

                acc.push(newItem);
                return acc;
            }
        }
        acc.push(item);
        return acc;
    }, []);

    klarnaOrder.order_lines = orderLines;

    return { updatedKlarnaOrder: klarnaOrder, refundedOrderLines };
};

const updateKlarnaOrder = async (klarna_order_id, oldOrder, updatedOrder, deletedItems, updatedItems) => {
    const refundAmount = Math.round(Number(oldOrder.total) - Number(updatedOrder.total));

    if (!klarna_order_id || !refundAmount || (!deletedItems?.length && !updatedItems?.length)) {
        return {
            success: false,
            statusMessage: 'Invalid request parameter',
            error: 'ec_order_cancel_klarna_error',
        };
    }

    try {
        const [existingPayment] = await Payments.getPaymentsByPaymentId(klarna_order_id);
        if (!existingPayment) {
            return {
                success: false,
                statusMessage: 'Payment not found.',
                error: 'ec_order_cancel_klarna_error',
            };
        }

        // Get the order status from the ordermanagment
        const klarnaOrder = await klarnaModel.getOrder(klarna_order_id);

        if (klarnaOrder.status === ORDER_STATUS.CANCELLED) {
            return {
                success: false,
                statusMessage: 'Klarna order is already cancelled',
                error: 'ec_order_cancel_klarna_cancel_alreadyCanceld',
            };
        }

        // Update the orderLines and the order amount etc.
        const { updatedKlarnaOrder, refundedOrderLines } = await updateKlarnaOrderLines(
            klarnaOrder,
            deletedItems,
            updatedItems,
            updatedOrder,
        );

        // When the order is not paid yet (Not CAPTURED), just udpate it
        if (klarnaOrder.status === ORDER_STATUS.AUTHORIZED) {
            const updateResult = await klarnaModel.updateKlarnaAuthorization(klarna_order_id, updatedKlarnaOrder);

            if (updateResult.success) {
                return {
                    success: true,
                    statusMessage: 'Klarna order has been updated',
                };
            }
            return {
                success: false,
                statusMessage: 'Faild to update the klarna order',
            };
        }

        // When the order is captured, a refund should be made in this case
        if (klarnaOrder.status === ORDER_STATUS.CAPTURED) {
            const refundDetails = {
                refunded_amount: Math.round(refundAmount * 100),
                order_lines: refundedOrderLines,
                description: 'Refund for returned/updated items for order ' + klarna_order_id,
            };

            // Add the shipping
            if (!+oldOrder.shipping_price && +updatedOrder.shipping_price) {
                const returnFee = {
                    name: 'Return Fee',
                    type: 'return_fee',
                    quantity: 1,
                    unit_price: -(updatedOrder.shipping_price * 100),
                    total_amount: -(updatedOrder.shipping_price * 100),
                };
                refundDetails.order_lines = [...refundedOrderLines, returnFee];
            }

            const result = await klarnaModel.refundKlarnaOrder(klarna_order_id, refundDetails);
            if (result.success) {
                return {
                    refundAmount: refundAmount,
                    success: true,
                    statusMessage: 'Klarna order has been updated',
                };
            }
        }

        return {
            success: false,
            statusMessage: 'Faild to udpate the klarna order',
            error: 'The order status is unknow',
        };
    } catch (error) {
        return {
            success: false,
            statusMessage: 'Faild to udpate the klarna order',
            error: 'ec_order_cancel_klarna_error',
        };
    }
};

// This will do a full refund, it calls when the order is cancelled
const refundOrder = async (req, res, klarnaOrder, existingPayment) => {
    const { klarna_order_id, shipping_name } = req.body;

    // Already refunded
    if (existingPayment.status === 6) {
        return sendResponse(res, 400, 'The refund is already done', null, 'ec_order_cancel_klarna_alreadydone', null);
    }

    try {
        const [storeInfo] = await StoreInfo.getAll();
        const tax = storeInfo.tax_percentage;
        const freeShippingLimit = storeInfo.free_shipping;

        // Prepare capture details, Filter out the shipping_fee
        const filtredOrderLines = klarnaOrder.order_lines.filter((item) => item.type !== 'shipping_fee');
        let refundDetails = {
            refunded_amount: klarnaOrder.captured_amount,
            order_lines: filtredOrderLines,
            description: 'Refund for returned items for order ' + klarna_order_id,
        };

        if (klarnaOrder.refunded_amount) {
            const remaningAmount = klarnaOrder.captured_amount - klarnaOrder.refunded_amount;
            refundDetails.refunded_amount = remaningAmount;

            const orderItems = await OrderItemsModel.getNotReturnedItemsByOrderId(existingPayment.order_id);
            if (orderItems?.length) {
                const remaningItemsToRefund = klarnaOrder.order_lines.reduce((acc, item) => {
                    const found = orderItems.find(orderItems => +orderItems.product_id === +item.reference);

                    if (found) {
                        let foundQuantity = found.quantity;
                        let foundDiscount = (found.discount || 0) * 100;
                        if (item.quantity_unit === 'g') {
                            foundQuantity = foundQuantity * 1000;
                            foundDiscount = foundDiscount / 100;
                        }
                        item.quantity = foundQuantity;
                        item.total_amount = item.quantity * item.unit_price;
                        item.total_discount_amount = item.quantity * foundDiscount;
                        item.total_tax_amount = Math.round(calculateVatAmount(item.total_amount, tax));
                        acc.push(item);
                    }
                    return acc;
                }, []);
                refundDetails.order_lines = remaningItemsToRefund;
            }
        }

        let shippingPrice = 0;
        const orderShippingPrice = klarnaOrder.selected_shipping_option?.price || 0
        if (orderShippingPrice > 0) {
            const refundAmount = refundDetails.refunded_amount;
            refundDetails.refunded_amount = refundAmount - orderShippingPrice;
        } else if (shipping_name) {
            const [shipping] = await Shipping.getShippingByname(shipping_name);
            if (!shipping) {
                return sendResponse(
                    res,
                    400,
                    'Error',
                    'Shipping method not found in the database.',
                    'ec_order_cancel_klarna_error',
                    null,
                );
            }

            // The Store shipping price
            shippingPrice = shipping.shipping_price;

            // Shipping fee.
            const returnFee = {
                name: 'Return Fee',
                type: 'return_fee',
                quantity: 1,
                unit_price: -(shipping.shipping_price * 100),
                total_amount: -(shipping.shipping_price * 100),
            };

            // Refund the amount minus the shipping when the order is returned eg. type_id is 2 meaning shipped
            const refundAmount = refundDetails.refunded_amount;
            refundDetails.refunded_amount = refundAmount - (shipping.shipping_price * 100);

            // If the refund amount is more than free shipping limit, add the return fee.
            const shouldTakeReturnFee = (refundAmount / 100) > freeShippingLimit;

            if (!klarnaOrder.refunded_amount || shouldTakeReturnFee) {
                refundDetails.order_lines = [...refundDetails.order_lines, returnFee];
            }
        }

        if (klarnaOrder.refunded_amount === refundDetails.captured_amount) {
            return sendResponse(
                res,
                400,
                'Refund amount is more than the captured amount.',
                null,
                'ec_order_cancel_klarna_alreadyDoneWithThisAmount',
                null,
            );
        }

        // Process the refund for the given order ID
        const result = await klarnaModel.refundKlarnaOrder(klarna_order_id, refundDetails);

        if (result.success) {
            await Payments.updatePaymentsStatusAndPaymentId({
                id: existingPayment.id,
                payment_id: existingPayment.payment_id,
                status: 6, // REFUNDED
            });

            const remaningAmount = (klarnaOrder.captured_amount / 100) - (refundDetails.refunded_amount / 100);
            const newTax = calculateVatAmount(remaningAmount, tax);

            await OrderModel.updateOrderAfterCancelleation({
                order_id: existingPayment.order_id,
                sub_total: (klarnaOrder.captured_amount / 100) - shippingPrice,
                shipping_price: shippingPrice,
                tax: newTax,
                total: (klarnaOrder.captured_amount / 100),
                type_id: 3, // Cancelled
            });

            await (new PaymentRefundModel({
                status: 2, // PAID
                order_id: existingPayment.order_id,
                refund_id: existingPayment.payment_id,
                amount: refundDetails.refunded_amount / 100,
            })).save();

            // Update the products qty in the product table
            const orderItems = await updateOrderAfterCancelation(existingPayment.order_id);

            // Update the orderitems to be returned
            await OrderItemsModel.deleteMulti(orderItems);

            return sendResponse(
                res,
                200,
                'ec_order_cancel_klarna_refund_success',
                'Order refunded successfully',
                null,
                {
                    payment_id: existingPayment.payment_id,
                    status: 6,
                    type_id: 3,
                    sub_total: (klarnaOrder.captured_amount / 100) - shippingPrice,
                    total: (klarnaOrder.captured_amount / 100),
                    tax: newTax,
                    shipping_price: shippingPrice,
                    type_name: 'ec_orderType_canceled',
                }, // 6 - payment REFUNDED, 3 - order cancelled
            );
        } else {
            return sendResponse(
                res,
                500,
                'Failed to refund Klarna order',
                result.message,
                'ec_order_cancel_klarna_error',
                null,
            );
        }
    } catch (error) {
        return sendResponse(
            res,
            500,
            'An error occurred while refunding the order',
            error.message,
            'ec_order_cancel_klarna_error',
            null,
        );
    }
};

const updateKlarnaAuthorization = async (req, res) => {
    const { orderId } = req.params;
    const authorizationDetails = req.body; // Assuming the details are sent in the request body

    try {
        // Update authorization for the given order ID
        const result = await klarnaModel.updateKlarnaAuthorization(orderId, authorizationDetails);

        if (result.success) {
            return res.status(200).json({
                message: 'Authorization updated successfully',
                data: result.data,
            });
        } else {
            return res.status(500).json({
                message: 'Failed to update authorization',
                error: result.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while updating authorization',
            error: error.message,
        });
    }
};

module.exports = {
    updateKlarnaOrder,
    createOrder,
    updateKlarnaAuthorization,
    klarna_paymentrequests,
    cancelKlarnaOrder,
    getOrder,
    getOrderStatus,
    receivePush,
    acknowledgeKlarnaCheckoutOrder,
    captureOrder,
    getOrderCaptures,
};
