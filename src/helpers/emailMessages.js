const mailMessags = {
    pinMessage: {
        title: 'Din verifierings-PIN-kod',
        body:
            'Du har begärt en PIN-kod för att återställa ditt lösenord.\nHär är din unika PIN-kod:\nPIN-kod: {0}\n\nVänligen dela inte denna kod med någon annan. Det är en personlig och konfidentiell kod som endast är avsedd för dig. Om du inte har begärt denna PIN-kod kan du ignorera detta meddelande.',
    },
    shippingOrder: {
        title: 'My Dear : {0}',
        body: 'Your Order Is Shipping',
    },
};

module.exports = mailMessags;
