-- MariaDB dump 10.19  Distrib 10.4.24-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: ecommerce
-- ------------------------------------------------------
-- Server version	10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'vegetables'),(2,'snacks'),(3,'Bread'),(4,'Fruti'),(5,'demo');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(25) NOT NULL,
  `lname` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `address` varchar(50) NOT NULL,
  `zip` varchar(10) NOT NULL,
  `city` varchar(30) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `registered` tinyint(1) NOT NULL,
  `isCompany` tinyint(1) NOT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (119,'osama','faroun','osamafaroun7@gmail.com','$2a$10$VM2iUmA/9GTDxLcrgAlvu.c4Pm2eqtot8W6zwyqUOZYib74Uaq64e','aaaa','','','234234',0,0),(120,'Ahmad','Faroun','ahmad996cyc@gmail.com','$2a$10$0TerN8ZfIHi9CItIpym7rupJW6a0iUmD8t6zMh0DHJ1uN1NrTfuf2','','','','',0,0);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discounts` (
  `discount_id` int(11) NOT NULL AUTO_INCREMENT,
  `discount_value` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`discount_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `order_items_ibfk_1` (`product_id`),
  KEY `order_items_ibfk_2` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=399 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_type`
--

DROP TABLE IF EXISTS `order_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_type`
--

LOCK TABLES `order_type` WRITE;
/*!40000 ALTER TABLE `order_type` DISABLE KEYS */;
INSERT INTO `order_type` VALUES (2,'delivered'),(3,'completed');
/*!40000 ALTER TABLE `order_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `shipping_id` int(11) NOT NULL,
  `order_date` datetime NOT NULL,
  `sub_total` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL,
  `items_discount` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `orders_ibfk_1` (`customer_id`),
  KEY `type_id` (`type_id`),
  KEY `shipping_id` (`shipping_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `order_type` (`type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipping_id`) REFERENCES `shipping` (`shipping_id`)
) ENGINE=InnoDB AUTO_INCREMENT=226 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_review`
--

DROP TABLE IF EXISTS `product_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_review` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`review_id`),
  KEY `customer_id` (`customer_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_review_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_review_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_review`
--

LOCK TABLES `product_review` WRITE;
/*!40000 ALTER TABLE `product_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tag`
--

DROP TABLE IF EXISTS `product_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_tag` (
  `product_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  KEY `tag_id` (`tag_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_tag_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_tag_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tag`
--

LOCK TABLES `product_tag` WRITE;
/*!40000 ALTER TABLE `product_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `discount_id` int(11) DEFAULT NULL,
  `unit_id` int(11) NOT NULL,
  `articelNumber` int(11) NOT NULL,
  `image` varchar(350) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `available` tinyint(1) NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `products_ibfk_1` (`category_id`),
  KEY `discount_id` (`discount_id`),
  KEY `unit_id` (`unit_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`discount_id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_3` FOREIGN KEY (`unit_id`) REFERENCES `units` (`unit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=501 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,5,NULL,1,0,'[\"p-20.jpg\",\"p-29.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',120.00,0.00,0),(2,4,NULL,1,0,'[\"p-21.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',275.00,0.00,0),(3,4,NULL,1,0,'[\"p-21.jpg\",\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',264.00,0.00,0),(4,3,NULL,1,0,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',108.00,20.00,1),(5,1,NULL,1,0,'[\"p-30.jpg\",\"p-12.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',204.00,20.00,1),(6,2,NULL,1,0,'[\"p-05.jpg\",\"p-02.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',175.00,20.00,1),(7,2,NULL,1,0,'[\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',101.00,20.00,1),(8,4,NULL,1,0,'[\"p-06.jpg\",\"p-08.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',101.00,20.00,1),(9,5,NULL,1,0,'[\"p-24.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',68.00,20.00,1),(10,3,NULL,1,0,'[\"p-24.jpg\",\"p-09.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',75.00,20.00,1),(11,2,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',155.00,20.00,1),(12,4,NULL,1,0,'[\"p-26.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',247.00,20.00,1),(13,3,NULL,1,0,'[\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',270.00,20.00,1),(14,5,NULL,1,0,'[\"p-22.jpg\",\"p-10.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',263.00,20.00,1),(15,1,NULL,1,0,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',241.00,20.00,1),(16,3,NULL,1,0,'[\"p-27.jpg\",\"p-29.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',293.00,20.00,1),(17,3,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',284.00,20.00,1),(18,1,NULL,1,0,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',255.00,20.00,1),(19,5,NULL,1,0,'[\"p-04.jpg\",\"p-26.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',249.00,20.00,1),(20,3,NULL,1,0,'[\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',242.00,20.00,1),(21,3,NULL,1,0,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',207.00,20.00,1),(22,5,NULL,1,0,'[\"p-04.jpg\",\"p-15.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',104.00,20.00,1),(23,1,NULL,1,0,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',186.00,20.00,1),(24,5,NULL,1,0,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',133.00,20.00,1),(25,1,NULL,1,0,'[\"p-16.jpg\",\"p-27.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',96.00,20.00,1),(26,3,NULL,1,0,'[\"p-23.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',78.00,20.00,1),(27,5,NULL,1,0,'[\"p-19.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',228.00,20.00,1),(28,1,NULL,1,0,'[\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',246.00,20.00,1),(29,4,NULL,1,0,'[\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',87.00,20.00,1),(30,4,NULL,1,0,'[\"p-11.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',107.00,20.00,1),(31,3,NULL,1,0,'[\"p-14.jpg\",\"p-04.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',76.00,20.00,1),(32,5,NULL,1,0,'[\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',139.00,20.00,1),(33,2,NULL,1,0,'[\"p-19.jpg\",\"p-11.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',196.00,20.00,1),(34,5,NULL,1,0,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',116.00,20.00,1),(35,3,NULL,1,0,'[\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',235.00,20.00,1),(36,1,NULL,1,0,'[\"p-19.jpg\",\"p-10.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',80.00,20.00,1),(37,1,NULL,1,0,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',142.00,20.00,1),(38,1,NULL,1,0,'[\"p-10.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',122.00,20.00,1),(39,2,NULL,1,0,'[\"p-10.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',211.00,20.00,1),(40,5,NULL,1,0,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',150.00,20.00,1),(41,4,NULL,1,0,'[\"p-09.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',188.00,20.00,1),(42,1,NULL,1,0,'[\"p-30.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',185.00,20.00,1),(43,2,NULL,1,0,'[\"p-20.jpg\",\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',277.00,20.00,1),(44,5,NULL,1,0,'[\"p-09.jpg\",\"p-25.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',218.00,20.00,1),(45,3,NULL,1,0,'[\"p-10.jpg\",\"p-13.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',213.00,20.00,1),(46,3,NULL,1,0,'[\"p-04.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',212.00,20.00,1),(47,2,NULL,1,0,'[\"p-03.jpg\",\"p-20.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',261.00,20.00,1),(48,4,NULL,1,0,'[\"p-03.jpg\",\"p-23.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',78.00,20.00,1),(49,3,NULL,1,0,'[\"p-26.jpg\",\"p-03.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',66.00,20.00,1),(50,4,NULL,1,0,'[\"p-22.jpg\",\"p-30.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',249.00,20.00,1),(51,2,NULL,1,0,'[\"p-04.jpg\",\"p-02.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',153.00,20.00,1),(52,2,NULL,1,0,'[\"p-14.jpg\",\"p-15.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',60.00,20.00,1),(53,1,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',299.00,20.00,1),(54,1,NULL,1,0,'[\"p-10.jpg\",\"p-18.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',246.00,20.00,1),(55,1,NULL,1,0,'[\"p-20.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',179.00,20.00,1),(56,4,NULL,1,0,'[\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',280.00,20.00,1),(57,5,NULL,1,0,'[\"p-07.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',250.00,20.00,1),(58,4,NULL,1,0,'[\"p-04.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',188.00,20.00,1),(59,2,NULL,1,0,'[\"p-24.jpg\",\"p-10.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',240.00,20.00,1),(60,3,NULL,1,0,'[\"p-03.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',152.00,20.00,1),(61,2,NULL,1,0,'[\"p-11.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',108.00,20.00,1),(62,4,NULL,1,0,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',268.00,20.00,1),(63,2,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',239.00,20.00,1),(64,1,NULL,1,0,'[\"p-22.jpg\",\"p-04.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',152.00,20.00,1),(65,2,NULL,1,0,'[\"p-29.jpg\",\"p-21.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',216.00,20.00,1),(66,4,NULL,1,0,'[\"p-23.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',261.00,20.00,1),(67,2,NULL,1,0,'[\"p-28.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',88.00,20.00,1),(68,1,NULL,1,0,'[\"p-11.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',78.00,20.00,1),(69,5,NULL,1,0,'[\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',138.00,20.00,1),(70,3,NULL,1,0,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',237.00,20.00,1),(71,5,NULL,1,0,'[\"p-03.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',72.00,20.00,1),(72,5,NULL,1,0,'[\"p-08.jpg\",\"p-20.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',209.00,20.00,1),(73,2,NULL,1,0,'[\"p-10.jpg\",\"p-02.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',52.00,20.00,1),(74,1,NULL,1,0,'[\"p-06.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',282.00,20.00,1),(75,5,NULL,1,0,'[\"p-21.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',147.00,20.00,1),(76,3,NULL,1,0,'[\"p-09.jpg\",\"p-30.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',228.00,20.00,1),(77,3,NULL,1,0,'[\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',208.00,20.00,1),(78,5,NULL,1,0,'[\"p-29.jpg\",\"p-10.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',77.00,20.00,1),(79,4,NULL,1,0,'[\"p-26.jpg\",\"p-28.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',111.00,20.00,1),(80,5,NULL,1,0,'[\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',136.00,20.00,1),(81,2,NULL,1,0,'[\"p-25.jpg\",\"p-08.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',200.00,20.00,1),(82,4,NULL,1,0,'[\"p-09.jpg\",\"p-17.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',234.00,20.00,1),(83,1,NULL,1,0,'[\"p-23.jpg\",\"p-25.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',266.00,20.00,1),(84,2,NULL,1,0,'[\"p-22.jpg\",\"p-19.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',184.00,20.00,1),(85,3,NULL,1,0,'[\"p-20.jpg\",\"p-03.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',76.00,20.00,1),(86,5,NULL,1,0,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',77.00,20.00,1),(87,3,NULL,1,0,'[\"p-12.jpg\",\"p-25.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',167.00,20.00,1),(88,3,NULL,1,0,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',137.00,20.00,1),(89,3,NULL,1,0,'[\"p-09.jpg\",\"p-11.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',215.00,20.00,1),(90,5,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',99.00,20.00,1),(91,1,NULL,1,0,'[\"p-29.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',295.00,20.00,1),(92,1,NULL,1,0,'[\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',100.00,20.00,1),(93,5,NULL,1,0,'[\"p-10.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',269.00,20.00,1),(94,4,NULL,1,0,'[\"p-08.jpg\",\"p-10.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',59.00,20.00,1),(95,2,NULL,1,0,'[\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',207.00,20.00,1),(96,1,NULL,1,0,'[\"p-11.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',118.00,20.00,1),(97,2,NULL,1,0,'[\"p-19.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',251.00,20.00,1),(98,5,NULL,1,0,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',218.00,20.00,1),(99,3,NULL,1,0,'[\"p-09.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',223.00,20.00,1),(100,5,NULL,1,0,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',253.00,20.00,1),(101,4,NULL,1,0,'[\"p-22.jpg\",\"p-16.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',152.00,20.00,1),(102,4,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',153.00,20.00,1),(103,3,NULL,1,0,'[\"p-07.jpg\",\"p-12.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',176.00,20.00,1),(104,5,NULL,1,0,'[\"p-11.jpg\",\"p-18.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',78.00,20.00,1),(105,2,NULL,1,0,'[\"p-22.jpg\",\"p-18.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',216.00,20.00,1),(106,5,NULL,1,0,'[\"p-24.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',297.00,20.00,1),(107,5,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',141.00,20.00,1),(108,4,NULL,1,0,'[\"p-17.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',213.00,20.00,1),(109,1,NULL,1,0,'[\"p-05.jpg\",\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',90.00,20.00,1),(110,1,NULL,1,0,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',239.00,20.00,1),(111,5,NULL,1,0,'[\"p-23.jpg\",\"p-13.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',297.00,20.00,1),(112,2,NULL,1,0,'[\"p-17.jpg\",\"p-11.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',231.00,20.00,1),(113,2,NULL,1,0,'[\"p-12.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',171.00,20.00,1),(114,1,NULL,1,0,'[\"p-14.jpg\",\"p-09.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',212.00,20.00,1),(115,4,NULL,1,0,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',130.00,20.00,1),(116,3,NULL,1,0,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',184.00,20.00,1),(117,4,NULL,1,0,'[\"p-16.jpg\",\"p-01.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',132.00,20.00,1),(118,2,NULL,1,0,'[\"p-12.jpg\",\"p-09.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,20.00,1),(119,3,NULL,1,0,'[\"p-19.jpg\",\"p-12.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',124.00,20.00,1),(120,3,NULL,1,0,'[\"p-17.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',126.00,20.00,1),(121,2,NULL,1,0,'[\"p-02.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',57.00,20.00,1),(122,3,NULL,1,0,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',249.00,20.00,1),(123,1,NULL,1,0,'[\"p-18.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',140.00,20.00,1),(124,3,NULL,1,0,'[\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',240.00,20.00,1),(125,4,NULL,1,0,'[\"p-30.jpg\",\"p-12.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',113.00,20.00,1),(126,4,NULL,1,0,'[\"p-15.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',214.00,20.00,1),(127,3,NULL,1,0,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,20.00,1),(128,1,NULL,1,0,'[\"p-02.jpg\",\"p-08.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',102.00,20.00,1),(129,4,NULL,1,0,'[\"p-13.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',266.00,20.00,1),(130,3,NULL,1,0,'[\"p-13.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',69.00,20.00,1),(131,3,NULL,1,0,'[\"p-24.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',195.00,20.00,1),(132,5,NULL,1,0,'[\"p-04.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',115.00,20.00,1),(133,4,NULL,1,0,'[\"p-11.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',298.00,20.00,1),(134,3,NULL,1,0,'[\"p-26.jpg\",\"p-21.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',96.00,20.00,1),(135,4,NULL,1,0,'[\"p-15.jpg\",\"p-15.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',89.00,20.00,1),(136,1,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',212.00,20.00,1),(137,5,NULL,1,0,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',55.00,20.00,1),(138,5,NULL,1,0,'[\"p-14.jpg\",\"p-17.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,20.00,1),(139,5,NULL,1,0,'[\"p-20.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',141.00,20.00,1),(140,4,NULL,1,0,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',179.00,20.00,1),(141,4,NULL,1,0,'[\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',184.00,20.00,1),(142,2,NULL,1,0,'[\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',247.00,20.00,1),(143,2,NULL,1,0,'[\"p-24.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',139.00,20.00,1),(144,2,NULL,1,0,'[\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',131.00,20.00,1),(145,4,NULL,1,0,'[\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',70.00,20.00,1),(146,5,NULL,1,0,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',144.00,20.00,1),(147,2,NULL,1,0,'[\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',148.00,20.00,1),(148,4,NULL,1,0,'[\"p-26.jpg\",\"p-16.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',269.00,20.00,1),(149,5,NULL,1,0,'[\"p-22.jpg\",\"p-25.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',149.00,20.00,1),(150,3,NULL,1,0,'[\"p-27.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',193.00,20.00,1),(151,2,NULL,1,0,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',169.00,20.00,1),(152,1,NULL,1,0,'[\"p-04.jpg\",\"p-29.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',224.00,20.00,1),(153,4,NULL,1,0,'[\"p-04.jpg\",\"p-03.jpg\",\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',199.00,20.00,1),(154,2,NULL,1,0,'[\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',124.00,20.00,1),(155,3,NULL,1,0,'[\"p-15.jpg\",\"p-26.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',197.00,20.00,1),(156,3,NULL,1,0,'[\"p-28.jpg\",\"p-10.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',62.00,20.00,1),(157,5,NULL,1,0,'[\"p-28.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,20.00,1),(158,3,NULL,1,0,'[\"p-20.jpg\",\"p-09.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',235.00,20.00,1),(159,3,NULL,1,0,'[\"p-12.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',226.00,20.00,1),(160,4,NULL,1,0,'[\"p-26.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',212.00,20.00,1),(161,3,NULL,1,0,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',79.00,20.00,1),(162,4,NULL,1,0,'[\"p-12.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',179.00,20.00,1),(163,2,NULL,1,0,'[\"p-07.jpg\",\"p-12.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',187.00,20.00,1),(164,5,NULL,1,0,'[\"p-04.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',235.00,20.00,1),(165,5,NULL,1,0,'[\"p-13.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',256.00,20.00,1),(166,4,NULL,1,0,'[\"p-07.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',126.00,20.00,1),(167,2,NULL,1,0,'[\"p-05.jpg\",\"p-12.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',221.00,20.00,1),(168,2,NULL,1,0,'[\"p-13.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',256.00,20.00,1),(169,2,NULL,1,0,'[\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',75.00,20.00,1),(170,1,NULL,1,0,'[\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',81.00,20.00,1),(171,1,NULL,1,0,'[\"p-01.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',155.00,20.00,1),(172,3,NULL,1,0,'[\"p-03.jpg\",\"p-16.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',295.00,20.00,1),(173,2,NULL,1,0,'[\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',187.00,20.00,1),(174,1,NULL,1,0,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',126.00,20.00,1),(175,1,NULL,1,0,'[\"p-30.jpg\",\"p-05.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',279.00,20.00,1),(176,5,NULL,1,0,'[\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',66.00,20.00,1),(177,5,NULL,1,0,'[\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',100.00,20.00,1),(178,3,NULL,1,0,'[\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',86.00,20.00,1),(179,2,NULL,1,0,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',245.00,20.00,1),(180,3,NULL,1,0,'[\"p-27.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',200.00,20.00,1),(181,1,NULL,1,0,'[\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',286.00,20.00,1),(182,5,NULL,1,0,'[\"p-24.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',75.00,20.00,1),(183,5,NULL,1,0,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',274.00,20.00,1),(184,4,NULL,1,0,'[\"p-09.jpg\",\"p-11.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',250.00,20.00,1),(185,2,NULL,1,0,'[\"p-23.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',125.00,20.00,1),(186,4,NULL,1,0,'[\"p-11.jpg\",\"p-13.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',179.00,20.00,1),(187,5,NULL,1,0,'[\"p-27.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',189.00,20.00,1),(188,3,NULL,1,0,'[\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',284.00,20.00,1),(189,5,NULL,1,0,'[\"p-04.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',270.00,20.00,1),(190,5,NULL,1,0,'[\"p-07.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,20.00,1),(191,3,NULL,1,0,'[\"p-10.jpg\",\"p-10.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',155.00,20.00,1),(192,2,NULL,1,0,'[\"p-16.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',252.00,20.00,1),(193,4,NULL,1,0,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',223.00,20.00,1),(194,4,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',55.00,20.00,1),(195,2,NULL,1,0,'[\"p-13.jpg\",\"p-22.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',225.00,20.00,1),(196,4,NULL,1,0,'[\"p-13.jpg\",\"p-05.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',146.00,20.00,1),(197,4,NULL,1,0,'[\"p-12.jpg\",\"p-29.jpg\",\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',228.00,20.00,1),(198,3,NULL,1,0,'[\"p-11.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',272.00,20.00,1),(199,4,NULL,1,0,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',225.00,20.00,1),(200,4,NULL,1,0,'[\"p-16.jpg\",\"p-28.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',150.00,20.00,1),(201,2,NULL,1,0,'[\"p-10.jpg\",\"p-16.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',200.00,20.00,1),(202,2,NULL,1,0,'[\"p-22.jpg\",\"p-08.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',71.00,20.00,1),(203,3,NULL,1,0,'[\"p-19.jpg\",\"p-10.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',233.00,20.00,1),(204,2,NULL,1,0,'[\"p-20.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',257.00,20.00,1),(205,4,NULL,1,0,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',156.00,20.00,1),(206,4,NULL,1,0,'[\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',186.00,20.00,1),(207,3,NULL,1,0,'[\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',294.00,20.00,1),(208,2,NULL,1,0,'[\"p-05.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',82.00,20.00,1),(209,3,NULL,1,0,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',293.00,20.00,1),(210,5,NULL,1,0,'[\"p-05.jpg\",\"p-06.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',201.00,20.00,1),(211,5,NULL,1,0,'[\"p-30.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',258.00,20.00,1),(212,3,NULL,1,0,'[\"p-21.jpg\",\"p-23.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',219.00,20.00,1),(213,3,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',237.00,20.00,1),(214,4,NULL,1,0,'[\"p-05.jpg\",\"p-22.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',258.00,20.00,1),(215,3,NULL,1,0,'[\"p-22.jpg\",\"p-03.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',146.00,20.00,1),(216,1,NULL,1,0,'[\"p-19.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',241.00,20.00,1),(217,2,NULL,1,0,'[\"p-20.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',118.00,20.00,1),(218,3,NULL,1,0,'[\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',157.00,20.00,1),(219,1,NULL,1,0,'[\"p-12.jpg\",\"p-21.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',130.00,20.00,1),(220,5,NULL,1,0,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',52.00,20.00,1),(221,5,NULL,1,0,'[\"p-28.jpg\",\"p-18.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,20.00,1),(222,3,NULL,1,0,'[\"p-22.jpg\",\"p-11.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',140.00,20.00,1),(223,2,NULL,1,0,'[\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',240.00,20.00,1),(224,5,NULL,1,0,'[\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',129.00,20.00,1),(225,3,NULL,1,0,'[\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',127.00,20.00,1),(226,4,NULL,1,0,'[\"p-12.jpg\",\"p-03.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',249.00,20.00,1),(227,5,NULL,1,0,'[\"p-23.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',154.00,20.00,1),(228,1,NULL,1,0,'[\"p-14.jpg\",\"p-09.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',57.00,20.00,1),(229,2,NULL,1,0,'[\"p-13.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',66.00,20.00,1),(230,4,NULL,1,0,'[\"p-15.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',140.00,20.00,1),(231,3,NULL,1,0,'[\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,20.00,1),(232,5,NULL,1,0,'[\"p-24.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',195.00,20.00,1),(233,1,NULL,1,0,'[\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',156.00,20.00,1),(234,5,NULL,1,0,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',237.00,20.00,1),(235,3,NULL,1,0,'[\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',199.00,20.00,1),(236,4,NULL,1,0,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',111.00,20.00,1),(237,4,NULL,1,0,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',220.00,20.00,1),(238,4,NULL,1,0,'[\"p-23.jpg\",\"p-24.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',285.00,20.00,1),(239,3,NULL,1,0,'[\"p-08.jpg\",\"p-05.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',93.00,20.00,1),(240,2,NULL,1,0,'[\"p-25.jpg\",\"p-04.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',204.00,20.00,1),(241,4,NULL,1,0,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',221.00,20.00,1),(242,4,NULL,1,0,'[\"p-15.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,20.00,1),(243,5,NULL,1,0,'[\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',76.00,20.00,1),(244,1,NULL,1,0,'[\"p-15.jpg\",\"p-15.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',197.00,20.00,1),(245,2,NULL,1,0,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',193.00,20.00,1),(246,3,NULL,1,0,'[\"p-13.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',284.00,20.00,1),(247,2,NULL,1,0,'[\"p-04.jpg\",\"p-16.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',154.00,20.00,1),(248,5,NULL,1,0,'[\"p-25.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',246.00,20.00,1),(249,5,NULL,1,0,'[\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',248.00,20.00,1),(250,5,NULL,1,0,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',67.00,20.00,1),(251,3,NULL,1,0,'[\"p-29.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',58.00,20.00,1),(252,3,NULL,1,0,'[\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',157.00,20.00,1),(253,5,NULL,1,0,'[\"p-18.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',270.00,20.00,1),(254,3,NULL,1,0,'[\"p-07.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',218.00,20.00,1),(255,1,NULL,1,0,'[\"p-18.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',177.00,20.00,1),(256,5,NULL,1,0,'[\"p-12.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',195.00,20.00,1),(257,5,NULL,1,0,'[\"p-27.jpg\",\"p-01.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',152.00,20.00,1),(258,4,NULL,1,0,'[\"p-24.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',85.00,20.00,1),(259,3,NULL,1,0,'[\"p-19.jpg\",\"p-16.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',143.00,20.00,1),(260,1,NULL,1,0,'[\"p-26.jpg\",\"p-12.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',133.00,20.00,1),(261,3,NULL,1,0,'[\"p-19.jpg\",\"p-10.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',252.00,20.00,1),(262,4,NULL,1,0,'[\"p-04.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',122.00,20.00,1),(263,2,NULL,1,0,'[\"p-23.jpg\",\"p-06.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',167.00,20.00,1),(264,5,NULL,1,0,'[\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',125.00,20.00,1),(265,2,NULL,1,0,'[\"p-28.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',158.00,20.00,1),(266,2,NULL,1,0,'[\"p-04.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',208.00,20.00,1),(267,5,NULL,1,0,'[\"p-09.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',236.00,20.00,1),(268,3,NULL,1,0,'[\"p-26.jpg\",\"p-11.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',193.00,20.00,1),(269,1,NULL,1,0,'[\"p-01.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',93.00,20.00,1),(270,2,NULL,1,0,'[\"p-16.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',288.00,20.00,1),(271,3,NULL,1,0,'[\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',155.00,20.00,1),(272,1,NULL,1,0,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',276.00,20.00,1),(273,4,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',121.00,20.00,1),(274,1,NULL,1,0,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',180.00,20.00,1),(275,1,NULL,1,0,'[\"p-17.jpg\",\"p-14.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',260.00,20.00,1),(276,4,NULL,1,0,'[\"p-17.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',93.00,20.00,1),(277,5,NULL,1,0,'[\"p-18.jpg\",\"p-15.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',138.00,20.00,1),(278,5,NULL,1,0,'[\"p-30.jpg\",\"p-11.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',132.00,20.00,1),(279,2,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',154.00,20.00,1),(280,2,NULL,1,0,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',157.00,20.00,1),(281,3,NULL,1,0,'[\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',81.00,20.00,1),(282,5,NULL,1,0,'[\"p-14.jpg\",\"p-11.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',181.00,20.00,1),(283,5,NULL,1,0,'[\"p-05.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',293.00,20.00,1),(284,2,NULL,1,0,'[\"p-18.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',157.00,20.00,1),(285,3,NULL,1,0,'[\"p-10.jpg\",\"p-18.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',241.00,20.00,1),(286,3,NULL,1,0,'[\"p-10.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',195.00,20.00,1),(287,5,NULL,1,0,'[\"p-25.jpg\",\"p-23.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',186.00,20.00,1),(288,5,NULL,1,0,'[\"p-06.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',272.00,20.00,1),(289,3,NULL,1,0,'[\"p-13.jpg\",\"p-26.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',51.00,20.00,1),(290,1,NULL,1,0,'[\"p-24.jpg\",\"p-12.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',289.00,20.00,1),(291,1,NULL,1,0,'[\"p-07.jpg\",\"p-22.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',225.00,20.00,1),(292,3,NULL,1,0,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',236.00,20.00,1),(293,5,NULL,1,0,'[\"p-20.jpg\",\"p-14.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',122.00,20.00,1),(294,4,NULL,1,0,'[\"p-10.jpg\",\"p-23.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',108.00,20.00,1),(295,2,NULL,1,0,'[\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',126.00,20.00,1),(296,2,NULL,1,0,'[\"p-19.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',215.00,20.00,1),(297,2,NULL,1,0,'[\"p-06.jpg\",\"p-08.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',185.00,20.00,1),(298,2,NULL,1,0,'[\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',91.00,20.00,1),(299,2,NULL,1,0,'[\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',295.00,20.00,1),(300,3,NULL,1,0,'[\"p-21.jpg\",\"p-02.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',154.00,20.00,1),(301,5,NULL,1,0,'[\"p-11.jpg\",\"p-11.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',109.00,20.00,1),(302,4,NULL,1,0,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',66.00,20.00,1),(303,5,NULL,1,0,'[\"p-29.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',113.00,20.00,1),(304,3,NULL,1,0,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',183.00,20.00,1),(305,2,NULL,1,0,'[\"p-28.jpg\",\"p-09.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',88.00,20.00,1),(306,4,NULL,1,0,'[\"p-15.jpg\",\"p-03.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',299.00,20.00,1),(307,1,NULL,1,0,'[\"p-17.jpg\",\"p-28.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',86.00,20.00,1),(308,4,NULL,1,0,'[\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',125.00,20.00,1),(309,3,NULL,1,0,'[\"p-10.jpg\",\"p-10.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',299.00,20.00,1),(310,2,NULL,1,0,'[\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',128.00,20.00,1),(311,1,NULL,1,0,'[\"p-02.jpg\",\"p-20.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',277.00,20.00,1),(312,5,NULL,1,0,'[\"p-21.jpg\",\"p-10.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',139.00,20.00,1),(313,2,NULL,1,0,'[\"p-28.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',61.00,20.00,1),(314,3,NULL,1,0,'[\"p-19.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',214.00,20.00,1),(315,2,NULL,1,0,'[\"p-04.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',283.00,20.00,1),(316,4,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',274.00,20.00,1),(317,2,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',107.00,20.00,1),(318,1,NULL,1,0,'[\"p-13.jpg\",\"p-04.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',140.00,20.00,1),(319,1,NULL,1,0,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',127.00,20.00,1),(320,2,NULL,1,0,'[\"p-23.jpg\",\"p-11.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',269.00,20.00,1),(321,5,NULL,1,0,'[\"p-28.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',86.00,20.00,1),(322,3,NULL,1,0,'[\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',183.00,20.00,1),(323,3,NULL,1,0,'[\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',175.00,20.00,1),(324,2,NULL,1,0,'[\"p-03.jpg\",\"p-13.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',271.00,20.00,1),(325,4,NULL,1,0,'[\"p-26.jpg\",\"p-04.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',134.00,20.00,1),(326,1,NULL,1,0,'[\"p-30.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',60.00,20.00,1),(327,2,NULL,1,0,'[\"p-24.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',298.00,20.00,1),(328,5,NULL,1,0,'[\"p-06.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',57.00,20.00,1),(329,4,NULL,1,0,'[\"p-14.jpg\",\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',284.00,20.00,1),(330,3,NULL,1,0,'[\"p-15.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',160.00,20.00,1),(331,1,NULL,1,0,'[\"p-12.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',207.00,20.00,1),(332,1,NULL,1,0,'[\"p-13.jpg\",\"p-15.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',63.00,20.00,1),(333,3,NULL,1,0,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',256.00,20.00,1),(334,5,NULL,1,0,'[\"p-15.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,20.00,1),(335,5,NULL,1,0,'[\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',259.00,20.00,1),(336,2,NULL,1,0,'[\"p-30.jpg\",\"p-10.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',138.00,20.00,1),(337,4,NULL,1,0,'[\"p-14.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',116.00,20.00,1),(338,3,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',264.00,20.00,1),(339,5,NULL,1,0,'[\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',180.00,20.00,1),(340,1,NULL,1,0,'[\"p-15.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',58.00,20.00,1),(341,1,NULL,1,0,'[\"p-16.jpg\",\"p-28.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',145.00,20.00,1),(342,4,NULL,1,0,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',297.00,20.00,1),(343,2,NULL,1,0,'[\"p-11.jpg\",\"p-12.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',107.00,20.00,1),(344,1,NULL,1,0,'[\"p-26.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',269.00,20.00,1),(345,3,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',284.00,20.00,1),(346,3,NULL,1,0,'[\"p-17.jpg\",\"p-10.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,20.00,1),(347,2,NULL,1,0,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',197.00,20.00,1),(348,4,NULL,1,0,'[\"p-01.jpg\",\"p-06.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',64.00,20.00,1),(349,1,NULL,1,0,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',256.00,20.00,1),(350,2,NULL,1,0,'[\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',71.00,20.00,1),(351,3,NULL,1,0,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',111.00,20.00,1),(352,2,NULL,1,0,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',291.00,20.00,1),(353,2,NULL,1,0,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',275.00,20.00,1),(354,5,NULL,1,0,'[\"p-18.jpg\",\"p-10.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',65.00,20.00,1),(355,5,NULL,1,0,'[\"p-13.jpg\",\"p-21.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',118.00,20.00,1),(356,3,NULL,1,0,'[\"p-14.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',127.00,20.00,1),(357,4,NULL,1,0,'[\"p-12.jpg\",\"p-27.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',221.00,20.00,1),(358,4,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,20.00,1),(359,3,NULL,1,0,'[\"p-25.jpg\",\"p-07.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,20.00,1),(360,2,NULL,1,0,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',194.00,20.00,1),(361,3,NULL,1,0,'[\"p-19.jpg\",\"p-10.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,20.00,1),(362,1,NULL,1,0,'[\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',113.00,20.00,1),(363,3,NULL,1,0,'[\"p-19.jpg\",\"p-25.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',116.00,20.00,1),(364,2,NULL,1,0,'[\"p-27.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',226.00,20.00,1),(365,2,NULL,1,0,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',285.00,20.00,1),(366,5,NULL,1,0,'[\"p-22.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',181.00,20.00,1),(367,5,NULL,1,0,'[\"p-10.jpg\",\"p-15.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',173.00,20.00,1),(368,5,NULL,1,0,'[\"p-16.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',149.00,20.00,1),(369,5,NULL,1,0,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',288.00,20.00,1),(370,5,NULL,1,0,'[\"p-16.jpg\",\"p-24.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',58.00,20.00,1),(371,4,NULL,1,0,'[\"p-09.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',279.00,20.00,1),(372,2,NULL,1,0,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',229.00,20.00,1),(373,5,NULL,1,0,'[\"p-11.jpg\",\"p-24.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,20.00,1),(374,1,NULL,1,0,'[\"p-04.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',283.00,20.00,1),(375,5,NULL,1,0,'[\"p-24.jpg\",\"p-12.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',234.00,20.00,1),(376,5,NULL,1,0,'[\"p-29.jpg\",\"p-10.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',136.00,20.00,1),(377,2,NULL,1,0,'[\"p-30.jpg\",\"p-07.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',118.00,20.00,1),(378,3,NULL,1,0,'[\"p-14.jpg\",\"p-13.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',256.00,20.00,1),(379,3,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',58.00,20.00,1),(380,2,NULL,1,0,'[\"p-12.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',159.00,20.00,1),(381,3,NULL,1,0,'[\"p-10.jpg\",\"p-19.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',240.00,20.00,1),(382,4,NULL,1,0,'[\"p-24.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',160.00,20.00,1),(383,1,NULL,1,0,'[\"p-10.jpg\",\"p-08.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',137.00,20.00,1),(384,1,NULL,1,0,'[\"p-10.jpg\",\"p-17.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',144.00,20.00,1),(385,5,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,20.00,1),(386,4,NULL,1,0,'[\"p-05.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',125.00,20.00,1),(387,1,NULL,1,0,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',119.00,20.00,1),(388,5,NULL,1,0,'[\"p-04.jpg\",\"p-06.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,20.00,1),(389,5,NULL,1,0,'[\"p-10.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',70.00,20.00,1),(390,3,NULL,1,0,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,20.00,1),(391,5,NULL,1,0,'[\"p-13.jpg\",\"p-13.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',291.00,20.00,1),(392,5,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',133.00,20.00,1),(393,5,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',265.00,20.00,1),(394,1,NULL,1,0,'[\"p-12.jpg\",\"p-12.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',115.00,20.00,1),(395,2,NULL,1,0,'[\"p-02.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,20.00,1),(396,5,NULL,1,0,'[\"p-02.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',271.00,20.00,1),(397,1,NULL,1,0,'[\"p-10.jpg\",\"p-10.jpg\",\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',223.00,20.00,1),(398,5,NULL,1,0,'[\"p-12.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',155.00,20.00,1),(399,4,NULL,1,0,'[\"p-02.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',109.00,20.00,1),(400,2,NULL,1,0,'[\"p-16.jpg\",\"p-09.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',131.00,20.00,1),(401,2,NULL,1,0,'[\"p-21.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',107.00,20.00,1),(402,1,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',214.00,20.00,1),(403,2,NULL,1,0,'[\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',215.00,20.00,1),(404,4,NULL,1,0,'[\"p-20.jpg\",\"p-02.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',293.00,20.00,1),(405,5,NULL,1,0,'[\"p-07.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',100.00,20.00,1),(406,5,NULL,1,0,'[\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',66.00,20.00,1),(407,3,NULL,1,0,'[\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',229.00,20.00,1),(408,4,NULL,1,0,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',266.00,20.00,1),(409,4,NULL,1,0,'[\"p-16.jpg\",\"p-16.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',89.00,20.00,1),(410,3,NULL,1,0,'[\"p-08.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',123.00,20.00,1),(411,3,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',233.00,20.00,1),(412,5,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',171.00,20.00,1),(413,5,NULL,1,0,'[\"p-22.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',121.00,20.00,1),(414,1,NULL,1,0,'[\"p-19.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',280.00,20.00,1),(415,1,NULL,1,0,'[\"p-10.jpg\",\"p-13.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',278.00,20.00,1),(416,1,NULL,1,0,'[\"p-20.jpg\",\"p-08.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',214.00,20.00,1),(417,2,NULL,1,0,'[\"p-19.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',127.00,20.00,1),(418,5,NULL,1,0,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,20.00,1),(419,2,NULL,1,0,'[\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',223.00,20.00,1),(420,5,NULL,1,0,'[\"p-18.jpg\",\"p-14.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',64.00,20.00,1),(421,5,NULL,1,0,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',210.00,20.00,1),(422,5,NULL,1,0,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',286.00,20.00,1),(423,5,NULL,1,0,'[\"p-11.jpg\",\"p-21.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',208.00,20.00,1),(424,1,NULL,1,0,'[\"p-30.jpg\",\"p-03.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',132.00,20.00,1),(425,4,NULL,1,0,'[\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,20.00,1),(426,2,NULL,1,0,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',64.00,20.00,1),(427,4,NULL,1,0,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',259.00,20.00,1),(428,4,NULL,1,0,'[\"p-06.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',250.00,20.00,1),(429,3,NULL,1,0,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',227.00,20.00,1),(430,4,NULL,1,0,'[\"p-25.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',164.00,20.00,1),(431,4,NULL,1,0,'[\"p-08.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',209.00,20.00,1),(432,5,NULL,1,0,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',179.00,20.00,1),(433,2,NULL,1,0,'[\"p-18.jpg\",\"p-10.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',69.00,20.00,1),(434,4,NULL,1,0,'[\"p-12.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',109.00,20.00,1),(435,5,NULL,1,0,'[\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',127.00,20.00,1),(436,2,NULL,1,0,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',271.00,20.00,1),(437,4,NULL,1,0,'[\"p-29.jpg\",\"p-27.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',120.00,20.00,1),(438,4,NULL,1,0,'[\"p-03.jpg\",\"p-10.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',263.00,20.00,1),(439,5,NULL,1,0,'[\"p-29.jpg\",\"p-22.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',88.00,20.00,1),(440,1,NULL,1,0,'[\"p-10.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',170.00,20.00,1),(441,4,NULL,1,0,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',154.00,20.00,1),(442,1,NULL,1,0,'[\"p-12.jpg\",\"p-02.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',132.00,20.00,1),(443,2,NULL,1,0,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',244.00,20.00,1),(444,1,NULL,1,0,'[\"p-11.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',75.00,20.00,1),(445,4,NULL,1,0,'[\"p-17.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',55.00,20.00,1),(446,5,NULL,1,0,'[\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,20.00,1),(447,5,NULL,1,0,'[\"p-11.jpg\",\"p-04.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',264.00,20.00,1),(448,1,NULL,1,0,'[\"p-03.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',82.00,20.00,1),(449,3,NULL,1,0,'[\"p-09.jpg\",\"p-16.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',119.00,20.00,1),(450,5,NULL,1,0,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',105.00,20.00,1),(451,3,NULL,1,0,'[\"p-11.jpg\",\"p-06.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',86.00,20.00,1),(452,1,NULL,1,0,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',149.00,20.00,1),(453,5,NULL,1,0,'[\"p-08.jpg\",\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',75.00,20.00,1),(454,1,NULL,1,0,'[\"p-27.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',68.00,20.00,1),(455,5,NULL,1,0,'[\"p-29.jpg\",\"p-14.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',226.00,20.00,1),(456,2,NULL,1,0,'[\"p-27.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',145.00,20.00,1),(457,4,NULL,1,0,'[\"p-05.jpg\",\"p-15.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',135.00,20.00,1),(458,2,NULL,1,0,'[\"p-12.jpg\",\"p-01.jpg\",\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',142.00,20.00,1),(459,4,NULL,1,0,'[\"p-15.jpg\",\"p-19.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',275.00,20.00,1),(460,4,NULL,1,0,'[\"p-11.jpg\",\"p-26.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',57.00,20.00,1),(461,3,NULL,1,0,'[\"p-02.jpg\",\"p-10.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',156.00,20.00,1),(462,3,NULL,1,0,'[\"p-06.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',180.00,20.00,1),(463,3,NULL,1,0,'[\"p-01.jpg\",\"p-28.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',260.00,20.00,1),(464,3,NULL,1,0,'[\"p-13.jpg\",\"p-27.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',300.00,20.00,1),(465,2,NULL,1,0,'[\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',212.00,20.00,1),(466,1,NULL,1,0,'[\"p-19.jpg\",\"p-02.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',173.00,20.00,1),(467,1,NULL,1,0,'[\"p-12.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',65.00,20.00,1),(468,4,NULL,1,0,'[\"p-22.jpg\",\"p-18.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',223.00,20.00,1),(469,2,NULL,1,0,'[\"p-05.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',295.00,20.00,1),(470,4,NULL,1,0,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,20.00,1),(471,5,NULL,1,0,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',213.00,20.00,1),(472,1,NULL,1,0,'[\"p-05.jpg\",\"p-15.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',261.00,20.00,1),(473,2,NULL,1,0,'[\"p-06.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',141.00,20.00,1),(474,4,NULL,1,0,'[\"p-11.jpg\",\"p-20.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',271.00,20.00,1),(475,3,NULL,1,0,'[\"p-06.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',282.00,20.00,1),(476,1,NULL,1,0,'[\"p-14.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',194.00,20.00,1),(477,2,NULL,1,0,'[\"p-11.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',184.00,20.00,1),(478,3,NULL,1,0,'[\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,20.00,1),(479,4,NULL,1,0,'[\"p-14.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',55.00,20.00,1),(480,2,NULL,1,0,'[\"p-27.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',254.00,20.00,1),(481,5,NULL,1,0,'[\"p-04.jpg\",\"p-19.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',121.00,20.00,1),(482,1,NULL,1,0,'[\"p-22.jpg\",\"p-10.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',226.00,20.00,1),(483,1,NULL,1,0,'[\"p-09.jpg\",\"p-03.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',121.00,20.00,1),(484,4,NULL,1,0,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,20.00,1),(485,2,NULL,1,0,'[\"p-12.jpg\",\"p-30.jpg\",\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',294.00,20.00,1),(486,5,NULL,1,0,'[\"p-30.jpg\",\"p-30.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',185.00,20.00,1),(487,1,NULL,1,0,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',71.00,20.00,1),(488,2,NULL,1,0,'[\"p-25.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',286.00,20.00,1),(489,5,NULL,1,0,'[\"p-30.jpg\",\"p-05.jpg\",\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,20.00,1),(490,4,NULL,1,0,'[\"p-21.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',149.00,20.00,1),(491,2,NULL,1,0,'[\"p-13.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',52.00,20.00,1),(492,1,NULL,1,0,'[\"p-13.jpg\",\"p-14.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',167.00,20.00,1),(493,1,NULL,1,0,'[\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',88.00,20.00,1),(494,1,NULL,1,0,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',287.00,20.00,1),(495,1,NULL,1,0,'[\"p-12.jpg\",\"p-18.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',270.00,20.00,1),(496,2,NULL,1,0,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',175.00,20.00,1),(497,3,NULL,1,0,'[\"p-03.jpg\",\"p-11.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',268.00,20.00,1),(498,1,NULL,1,0,'[\"p-08.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',253.00,20.00,1),(499,1,NULL,1,0,'[\"p-28.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',59.00,20.00,1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reset_password`
--

DROP TABLE IF EXISTS `reset_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reset_password` (
  `reset_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `pinCode` int(11) NOT NULL,
  `expiresAt` datetime NOT NULL,
  PRIMARY KEY (`reset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_password`
--

LOCK TABLES `reset_password` WRITE;
/*!40000 ALTER TABLE `reset_password` DISABLE KEYS */;
/*!40000 ALTER TABLE `reset_password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping`
--

DROP TABLE IF EXISTS `shipping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipping` (
  `shipping_id` int(11) NOT NULL AUTO_INCREMENT,
  `shipping_name` varchar(50) NOT NULL,
  `shipping_price` decimal(10,2) NOT NULL,
  `shipping_time` int(11) NOT NULL,
  PRIMARY KEY (`shipping_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping`
--

LOCK TABLES `shipping` WRITE;
/*!40000 ALTER TABLE `shipping` DISABLE KEYS */;
INSERT INTO `shipping` VALUES (15,'DHL',30.00,2),(16,'qwe',123.00,345);
/*!40000 ALTER TABLE `shipping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `fname` varchar(25) NOT NULL,
  `lname` varchar(25) NOT NULL,
  `phone` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` smallint(6) NOT NULL,
  `password` varchar(100) NOT NULL,
  `image` varchar(50) NOT NULL,
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (3,'undefined','undefined','undefined',0,'undefined',0,'$2a$10$0a2KOYWk02tIrVWOzdA1MObV3S5HHhb06TdFAU.XmDEp9OLa6qmJy','');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_info`
--

DROP TABLE IF EXISTS `store_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `store_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `opening_day` time NOT NULL,
  `closing_day` time NOT NULL,
  `opening_weekend` time NOT NULL,
  `closing_weekend` time NOT NULL,
  `tax_percentage` decimal(5,2) NOT NULL,
  `free_shipping` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `street` varchar(50) NOT NULL,
  `city` varchar(20) NOT NULL,
  `zip` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_info`
--

LOCK TABLES `store_info` WRITE;
/*!40000 ALTER TABLE `store_info` DISABLE KEYS */;
INSERT INTO `store_info` VALUES (2,'09:00:00','22:00:00','10:00:00','16:00:00',25.00,700,' 123456660','ahmad996cyc@gmail.com','Norrbytvärgata 32','Borås','312 40');
/*!40000 ALTER TABLE `store_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `top_products`
--

DROP TABLE IF EXISTS `top_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `top_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `top_products_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `top_products`
--

LOCK TABLES `top_products` WRITE;
/*!40000 ALTER TABLE `top_products` DISABLE KEYS */;
INSERT INTO `top_products` VALUES (3,1),(4,2),(5,3),(1,47),(2,47);
/*!40000 ALTER TABLE `top_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaction` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `mode` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `customer_id` (`customer_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `units` (
  `unit_id` int(11) NOT NULL AUTO_INCREMENT,
  `unit_name` varchar(50) NOT NULL,
  PRIMARY KEY (`unit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'kg'),(2,'g');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-01 23:42:00
