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
  `phone` varchar(20) NOT NULL,
  `registered` tinyint(1) NOT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (119,'osama','faroun','osamafaroun7@gmail.com','','aaaa','234234',0),(120,'Ahmad','Faroun','ahmad996cyc@gmail.com','$2a$10$0TerN8ZfIHi9CItIpym7rupJW6a0iUmD8t6zMh0DHJ1uN1NrTfuf2','','',0);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
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
  `image` varchar(350) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `quantity` smallint(6) NOT NULL,
  `available` tinyint(1) NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `products_ibfk_1` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=501 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,5,'[\"p-20.jpg\",\"p-29.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',120.00,33.00,19,0),(2,4,'[\"p-21.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',275.00,88.00,22,0),(3,4,'[\"p-21.jpg\",\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',264.00,62.00,23,1),(4,3,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',108.00,53.00,24,0),(5,1,'[\"p-30.jpg\",\"p-12.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',204.00,40.00,48,0),(6,2,'[\"p-05.jpg\",\"p-02.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',175.00,34.00,36,1),(7,2,'[\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',101.00,74.00,43,1),(8,4,'[\"p-06.jpg\",\"p-08.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',101.00,87.00,47,1),(9,5,'[\"p-24.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',68.00,50.00,20,1),(10,3,'[\"p-24.jpg\",\"p-09.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',75.00,25.00,42,1),(11,2,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',155.00,74.00,37,1),(12,4,'[\"p-26.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',247.00,80.00,27,0),(13,3,'[\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',270.00,72.00,37,1),(14,5,'[\"p-22.jpg\",\"p-10.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',263.00,73.00,21,1),(15,1,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',241.00,73.00,29,1),(16,3,'[\"p-27.jpg\",\"p-29.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',293.00,23.00,25,1),(17,3,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',284.00,52.00,37,0),(18,1,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',255.00,68.00,37,0),(19,5,'[\"p-04.jpg\",\"p-26.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',249.00,33.00,48,1),(20,3,'[\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',242.00,47.00,33,1),(21,3,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',207.00,59.00,48,0),(22,5,'[\"p-04.jpg\",\"p-15.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',104.00,21.00,29,1),(23,1,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',186.00,73.00,14,1),(24,5,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',133.00,63.00,26,0),(25,1,'[\"p-16.jpg\",\"p-27.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',96.00,19.00,19,1),(26,3,'[\"p-23.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',78.00,59.00,37,1),(27,5,'[\"p-19.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',228.00,84.00,15,1),(28,1,'[\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',246.00,32.00,11,0),(29,4,'[\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',87.00,25.00,26,0),(30,4,'[\"p-11.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',107.00,63.00,18,1),(31,3,'[\"p-14.jpg\",\"p-04.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',76.00,55.00,41,0),(32,5,'[\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',139.00,58.00,40,0),(33,2,'[\"p-19.jpg\",\"p-11.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',196.00,23.00,30,0),(34,5,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',116.00,70.00,44,0),(35,3,'[\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',235.00,75.00,22,0),(36,1,'[\"p-19.jpg\",\"p-10.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',80.00,62.00,40,1),(37,1,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',142.00,36.00,25,1),(38,1,'[\"p-10.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',122.00,70.00,16,1),(39,2,'[\"p-10.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',211.00,29.00,40,0),(40,5,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',150.00,66.00,13,1),(41,4,'[\"p-09.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',188.00,45.00,18,1),(42,1,'[\"p-30.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',185.00,58.00,30,0),(43,2,'[\"p-20.jpg\",\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',277.00,70.00,50,1),(44,5,'[\"p-09.jpg\",\"p-25.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',218.00,10.00,18,0),(45,3,'[\"p-10.jpg\",\"p-13.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',213.00,46.00,40,1),(46,3,'[\"p-04.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',212.00,11.00,47,1),(47,2,'[\"p-03.jpg\",\"p-20.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',261.00,43.00,24,1),(48,4,'[\"p-03.jpg\",\"p-23.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',78.00,88.00,10,0),(49,3,'[\"p-26.jpg\",\"p-03.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',66.00,37.00,12,0),(50,4,'[\"p-22.jpg\",\"p-30.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',249.00,90.00,39,0),(51,2,'[\"p-04.jpg\",\"p-02.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',153.00,41.00,46,0),(52,2,'[\"p-14.jpg\",\"p-15.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',60.00,55.00,41,0),(53,1,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',299.00,71.00,33,1),(54,1,'[\"p-10.jpg\",\"p-18.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',246.00,55.00,20,1),(55,1,'[\"p-20.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',179.00,29.00,16,0),(56,4,'[\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',280.00,27.00,22,1),(57,5,'[\"p-07.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',250.00,73.00,32,1),(58,4,'[\"p-04.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',188.00,29.00,42,1),(59,2,'[\"p-24.jpg\",\"p-10.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',240.00,58.00,16,1),(60,3,'[\"p-03.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',152.00,83.00,22,1),(61,2,'[\"p-11.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',108.00,13.00,49,0),(62,4,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',268.00,55.00,15,0),(63,2,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',239.00,28.00,27,1),(64,1,'[\"p-22.jpg\",\"p-04.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',152.00,64.00,21,0),(65,2,'[\"p-29.jpg\",\"p-21.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',216.00,90.00,47,0),(66,4,'[\"p-23.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',261.00,83.00,13,0),(67,2,'[\"p-28.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',88.00,82.00,49,0),(68,1,'[\"p-11.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',78.00,83.00,22,1),(69,5,'[\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',138.00,84.00,31,0),(70,3,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',237.00,63.00,49,0),(71,5,'[\"p-03.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',72.00,66.00,15,0),(72,5,'[\"p-08.jpg\",\"p-20.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',209.00,34.00,14,1),(73,2,'[\"p-10.jpg\",\"p-02.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',52.00,14.00,28,0),(74,1,'[\"p-06.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',282.00,80.00,17,1),(75,5,'[\"p-21.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',147.00,63.00,46,0),(76,3,'[\"p-09.jpg\",\"p-30.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',228.00,60.00,37,1),(77,3,'[\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',208.00,16.00,14,0),(78,5,'[\"p-29.jpg\",\"p-10.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',77.00,38.00,32,1),(79,4,'[\"p-26.jpg\",\"p-28.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',111.00,31.00,35,0),(80,5,'[\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',136.00,40.00,31,0),(81,2,'[\"p-25.jpg\",\"p-08.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',200.00,68.00,35,1),(82,4,'[\"p-09.jpg\",\"p-17.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',234.00,51.00,43,0),(83,1,'[\"p-23.jpg\",\"p-25.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',266.00,28.00,21,1),(84,2,'[\"p-22.jpg\",\"p-19.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',184.00,57.00,11,1),(85,3,'[\"p-20.jpg\",\"p-03.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',76.00,72.00,33,1),(86,5,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',77.00,55.00,35,0),(87,3,'[\"p-12.jpg\",\"p-25.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',167.00,58.00,44,1),(88,3,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',137.00,65.00,48,1),(89,3,'[\"p-09.jpg\",\"p-11.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',215.00,59.00,12,1),(90,5,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',99.00,11.00,31,0),(91,1,'[\"p-29.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',295.00,67.00,29,1),(92,1,'[\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',100.00,33.00,10,0),(93,5,'[\"p-10.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',269.00,80.00,33,0),(94,4,'[\"p-08.jpg\",\"p-10.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',59.00,26.00,50,0),(95,2,'[\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',207.00,45.00,36,0),(96,1,'[\"p-11.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',118.00,60.00,45,1),(97,2,'[\"p-19.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',251.00,71.00,48,1),(98,5,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',218.00,73.00,29,1),(99,3,'[\"p-09.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',223.00,33.00,23,1),(100,5,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',253.00,58.00,37,0),(101,4,'[\"p-22.jpg\",\"p-16.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',152.00,37.00,27,1),(102,4,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',153.00,30.00,36,0),(103,3,'[\"p-07.jpg\",\"p-12.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',176.00,51.00,34,0),(104,5,'[\"p-11.jpg\",\"p-18.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',78.00,59.00,19,0),(105,2,'[\"p-22.jpg\",\"p-18.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',216.00,50.00,15,1),(106,5,'[\"p-24.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',297.00,43.00,12,1),(107,5,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',141.00,54.00,45,1),(108,4,'[\"p-17.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',213.00,51.00,40,1),(109,1,'[\"p-05.jpg\",\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',90.00,32.00,14,0),(110,1,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',239.00,86.00,48,1),(111,5,'[\"p-23.jpg\",\"p-13.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',297.00,62.00,20,1),(112,2,'[\"p-17.jpg\",\"p-11.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',231.00,47.00,23,1),(113,2,'[\"p-12.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',171.00,24.00,23,1),(114,1,'[\"p-14.jpg\",\"p-09.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',212.00,74.00,27,1),(115,4,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',130.00,73.00,43,1),(116,3,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',184.00,55.00,25,0),(117,4,'[\"p-16.jpg\",\"p-01.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',132.00,13.00,22,0),(118,2,'[\"p-12.jpg\",\"p-09.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,17.00,47,1),(119,3,'[\"p-19.jpg\",\"p-12.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',124.00,66.00,21,0),(120,3,'[\"p-17.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',126.00,45.00,27,1),(121,2,'[\"p-02.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',57.00,67.00,31,1),(122,3,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',249.00,55.00,46,0),(123,1,'[\"p-18.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',140.00,79.00,50,0),(124,3,'[\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',240.00,37.00,16,1),(125,4,'[\"p-30.jpg\",\"p-12.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',113.00,29.00,29,1),(126,4,'[\"p-15.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',214.00,14.00,20,1),(127,3,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,50.00,49,0),(128,1,'[\"p-02.jpg\",\"p-08.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',102.00,72.00,29,1),(129,4,'[\"p-13.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',266.00,85.00,50,1),(130,3,'[\"p-13.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',69.00,65.00,22,1),(131,3,'[\"p-24.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',195.00,69.00,34,0),(132,5,'[\"p-04.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',115.00,18.00,37,1),(133,4,'[\"p-11.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',298.00,28.00,30,0),(134,3,'[\"p-26.jpg\",\"p-21.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',96.00,67.00,27,1),(135,4,'[\"p-15.jpg\",\"p-15.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',89.00,16.00,48,1),(136,1,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',212.00,81.00,35,1),(137,5,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',55.00,14.00,42,1),(138,5,'[\"p-14.jpg\",\"p-17.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,85.00,46,1),(139,5,'[\"p-20.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',141.00,62.00,50,1),(140,4,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',179.00,49.00,36,1),(141,4,'[\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',184.00,48.00,41,1),(142,2,'[\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',247.00,86.00,37,0),(143,2,'[\"p-24.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',139.00,14.00,10,0),(144,2,'[\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',131.00,39.00,43,0),(145,4,'[\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',70.00,67.00,31,0),(146,5,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',144.00,20.00,49,0),(147,2,'[\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',148.00,36.00,17,1),(148,4,'[\"p-26.jpg\",\"p-16.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',269.00,19.00,39,1),(149,5,'[\"p-22.jpg\",\"p-25.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',149.00,85.00,39,1),(150,3,'[\"p-27.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',193.00,90.00,26,0),(151,2,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',169.00,53.00,28,1),(152,1,'[\"p-04.jpg\",\"p-29.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',224.00,72.00,24,1),(153,4,'[\"p-04.jpg\",\"p-03.jpg\",\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',199.00,47.00,48,1),(154,2,'[\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',124.00,27.00,41,0),(155,3,'[\"p-15.jpg\",\"p-26.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',197.00,48.00,36,0),(156,3,'[\"p-28.jpg\",\"p-10.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',62.00,23.00,11,1),(157,5,'[\"p-28.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,77.00,15,1),(158,3,'[\"p-20.jpg\",\"p-09.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',235.00,67.00,48,1),(159,3,'[\"p-12.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',226.00,55.00,39,0),(160,4,'[\"p-26.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',212.00,53.00,40,1),(161,3,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',79.00,69.00,40,0),(162,4,'[\"p-12.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',179.00,87.00,28,1),(163,2,'[\"p-07.jpg\",\"p-12.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',187.00,31.00,15,1),(164,5,'[\"p-04.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',235.00,12.00,10,0),(165,5,'[\"p-13.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',256.00,42.00,39,0),(166,4,'[\"p-07.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',126.00,89.00,49,0),(167,2,'[\"p-05.jpg\",\"p-12.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',221.00,77.00,20,0),(168,2,'[\"p-13.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',256.00,18.00,13,0),(169,2,'[\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',75.00,68.00,43,0),(170,1,'[\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',81.00,23.00,23,1),(171,1,'[\"p-01.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',155.00,74.00,17,0),(172,3,'[\"p-03.jpg\",\"p-16.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',295.00,52.00,22,1),(173,2,'[\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',187.00,84.00,49,0),(174,1,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',126.00,58.00,20,0),(175,1,'[\"p-30.jpg\",\"p-05.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',279.00,59.00,18,1),(176,5,'[\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',66.00,22.00,40,0),(177,5,'[\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',100.00,11.00,13,1),(178,3,'[\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',86.00,22.00,18,1),(179,2,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',245.00,68.00,14,1),(180,3,'[\"p-27.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',200.00,71.00,23,1),(181,1,'[\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',286.00,27.00,20,1),(182,5,'[\"p-24.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',75.00,50.00,40,1),(183,5,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',274.00,88.00,49,1),(184,4,'[\"p-09.jpg\",\"p-11.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',250.00,10.00,36,1),(185,2,'[\"p-23.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',125.00,25.00,48,1),(186,4,'[\"p-11.jpg\",\"p-13.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',179.00,74.00,30,1),(187,5,'[\"p-27.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',189.00,75.00,25,0),(188,3,'[\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',284.00,61.00,30,1),(189,5,'[\"p-04.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',270.00,79.00,21,1),(190,5,'[\"p-07.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,25.00,44,0),(191,3,'[\"p-10.jpg\",\"p-10.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',155.00,28.00,32,0),(192,2,'[\"p-16.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',252.00,42.00,47,0),(193,4,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',223.00,68.00,19,1),(194,4,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',55.00,53.00,45,1),(195,2,'[\"p-13.jpg\",\"p-22.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',225.00,60.00,18,0),(196,4,'[\"p-13.jpg\",\"p-05.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',146.00,73.00,20,1),(197,4,'[\"p-12.jpg\",\"p-29.jpg\",\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',228.00,12.00,45,1),(198,3,'[\"p-11.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',272.00,48.00,16,1),(199,4,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',225.00,77.00,28,0),(200,4,'[\"p-16.jpg\",\"p-28.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',150.00,60.00,27,0),(201,2,'[\"p-10.jpg\",\"p-16.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',200.00,59.00,13,0),(202,2,'[\"p-22.jpg\",\"p-08.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',71.00,20.00,21,1),(203,3,'[\"p-19.jpg\",\"p-10.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',233.00,70.00,23,1),(204,2,'[\"p-20.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',257.00,71.00,12,0),(205,4,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',156.00,29.00,19,1),(206,4,'[\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',186.00,68.00,24,1),(207,3,'[\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',294.00,36.00,13,1),(208,2,'[\"p-05.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',82.00,89.00,31,1),(209,3,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',293.00,84.00,32,1),(210,5,'[\"p-05.jpg\",\"p-06.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',201.00,74.00,36,1),(211,5,'[\"p-30.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',258.00,73.00,39,0),(212,3,'[\"p-21.jpg\",\"p-23.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',219.00,77.00,49,1),(213,3,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',237.00,43.00,40,1),(214,4,'[\"p-05.jpg\",\"p-22.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',258.00,60.00,27,1),(215,3,'[\"p-22.jpg\",\"p-03.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',146.00,90.00,22,0),(216,1,'[\"p-19.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',241.00,48.00,26,0),(217,2,'[\"p-20.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',118.00,20.00,19,1),(218,3,'[\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',157.00,25.00,42,1),(219,1,'[\"p-12.jpg\",\"p-21.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',130.00,36.00,22,0),(220,5,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',52.00,83.00,11,1),(221,5,'[\"p-28.jpg\",\"p-18.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,20.00,42,1),(222,3,'[\"p-22.jpg\",\"p-11.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',140.00,70.00,25,1),(223,2,'[\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',240.00,78.00,10,1),(224,5,'[\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',129.00,35.00,18,1),(225,3,'[\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',127.00,51.00,13,0),(226,4,'[\"p-12.jpg\",\"p-03.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',249.00,30.00,42,1),(227,5,'[\"p-23.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',154.00,87.00,33,1),(228,1,'[\"p-14.jpg\",\"p-09.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',57.00,71.00,32,0),(229,2,'[\"p-13.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',66.00,80.00,27,0),(230,4,'[\"p-15.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',140.00,27.00,17,0),(231,3,'[\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,23.00,22,1),(232,5,'[\"p-24.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',195.00,44.00,22,1),(233,1,'[\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',156.00,74.00,15,0),(234,5,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',237.00,30.00,23,0),(235,3,'[\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',199.00,81.00,37,1),(236,4,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',111.00,66.00,23,0),(237,4,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',220.00,57.00,13,0),(238,4,'[\"p-23.jpg\",\"p-24.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',285.00,80.00,42,0),(239,3,'[\"p-08.jpg\",\"p-05.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',93.00,27.00,33,0),(240,2,'[\"p-25.jpg\",\"p-04.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',204.00,52.00,43,0),(241,4,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',221.00,69.00,14,1),(242,4,'[\"p-15.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,87.00,35,1),(243,5,'[\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',76.00,67.00,20,1),(244,1,'[\"p-15.jpg\",\"p-15.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',197.00,17.00,18,0),(245,2,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',193.00,51.00,30,1),(246,3,'[\"p-13.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',284.00,47.00,36,1),(247,2,'[\"p-04.jpg\",\"p-16.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',154.00,27.00,13,1),(248,5,'[\"p-25.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',246.00,48.00,17,1),(249,5,'[\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',248.00,77.00,16,0),(250,5,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',67.00,41.00,45,1),(251,3,'[\"p-29.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',58.00,72.00,49,0),(252,3,'[\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',157.00,52.00,34,0),(253,5,'[\"p-18.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',270.00,57.00,27,0),(254,3,'[\"p-07.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',218.00,46.00,19,1),(255,1,'[\"p-18.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',177.00,57.00,21,1),(256,5,'[\"p-12.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',195.00,48.00,39,1),(257,5,'[\"p-27.jpg\",\"p-01.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',152.00,15.00,32,1),(258,4,'[\"p-24.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',85.00,55.00,49,1),(259,3,'[\"p-19.jpg\",\"p-16.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',143.00,76.00,23,0),(260,1,'[\"p-26.jpg\",\"p-12.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',133.00,61.00,49,1),(261,3,'[\"p-19.jpg\",\"p-10.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',252.00,76.00,30,1),(262,4,'[\"p-04.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',122.00,63.00,32,0),(263,2,'[\"p-23.jpg\",\"p-06.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',167.00,46.00,39,0),(264,5,'[\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',125.00,18.00,23,0),(265,2,'[\"p-28.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',158.00,65.00,35,1),(266,2,'[\"p-04.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',208.00,47.00,41,0),(267,5,'[\"p-09.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',236.00,88.00,46,0),(268,3,'[\"p-26.jpg\",\"p-11.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',193.00,43.00,10,1),(269,1,'[\"p-01.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',93.00,58.00,23,1),(270,2,'[\"p-16.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',288.00,53.00,49,1),(271,3,'[\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',155.00,11.00,18,0),(272,1,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',276.00,38.00,15,0),(273,4,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',121.00,31.00,37,0),(274,1,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',180.00,62.00,14,0),(275,1,'[\"p-17.jpg\",\"p-14.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',260.00,50.00,50,0),(276,4,'[\"p-17.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',93.00,18.00,20,0),(277,5,'[\"p-18.jpg\",\"p-15.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',138.00,20.00,29,0),(278,5,'[\"p-30.jpg\",\"p-11.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',132.00,88.00,11,0),(279,2,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',154.00,48.00,30,0),(280,2,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',157.00,82.00,38,1),(281,3,'[\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',81.00,32.00,12,0),(282,5,'[\"p-14.jpg\",\"p-11.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',181.00,24.00,13,0),(283,5,'[\"p-05.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',293.00,81.00,29,0),(284,2,'[\"p-18.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',157.00,21.00,21,1),(285,3,'[\"p-10.jpg\",\"p-18.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',241.00,64.00,12,1),(286,3,'[\"p-10.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',195.00,49.00,18,1),(287,5,'[\"p-25.jpg\",\"p-23.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',186.00,82.00,37,1),(288,5,'[\"p-06.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',272.00,42.00,44,0),(289,3,'[\"p-13.jpg\",\"p-26.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',51.00,16.00,31,0),(290,1,'[\"p-24.jpg\",\"p-12.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',289.00,72.00,13,0),(291,1,'[\"p-07.jpg\",\"p-22.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',225.00,37.00,43,1),(292,3,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',236.00,78.00,40,1),(293,5,'[\"p-20.jpg\",\"p-14.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',122.00,20.00,20,0),(294,4,'[\"p-10.jpg\",\"p-23.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',108.00,60.00,25,1),(295,2,'[\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',126.00,58.00,17,1),(296,2,'[\"p-19.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',215.00,44.00,14,0),(297,2,'[\"p-06.jpg\",\"p-08.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',185.00,76.00,44,1),(298,2,'[\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',91.00,22.00,30,0),(299,2,'[\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',295.00,66.00,20,0),(300,3,'[\"p-21.jpg\",\"p-02.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',154.00,88.00,46,0),(301,5,'[\"p-11.jpg\",\"p-11.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',109.00,31.00,15,0),(302,4,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',66.00,29.00,41,0),(303,5,'[\"p-29.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',113.00,69.00,22,0),(304,3,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',183.00,86.00,16,0),(305,2,'[\"p-28.jpg\",\"p-09.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',88.00,52.00,49,1),(306,4,'[\"p-15.jpg\",\"p-03.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',299.00,72.00,23,0),(307,1,'[\"p-17.jpg\",\"p-28.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',86.00,25.00,40,1),(308,4,'[\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',125.00,35.00,50,1),(309,3,'[\"p-10.jpg\",\"p-10.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',299.00,60.00,22,1),(310,2,'[\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',128.00,54.00,33,0),(311,1,'[\"p-02.jpg\",\"p-20.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',277.00,58.00,37,1),(312,5,'[\"p-21.jpg\",\"p-10.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',139.00,80.00,19,1),(313,2,'[\"p-28.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',61.00,17.00,19,1),(314,3,'[\"p-19.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',214.00,64.00,39,1),(315,2,'[\"p-04.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',283.00,19.00,13,1),(316,4,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',274.00,29.00,43,0),(317,2,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',107.00,51.00,44,0),(318,1,'[\"p-13.jpg\",\"p-04.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',140.00,45.00,24,0),(319,1,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',127.00,27.00,21,1),(320,2,'[\"p-23.jpg\",\"p-11.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',269.00,83.00,27,1),(321,5,'[\"p-28.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',86.00,65.00,26,0),(322,3,'[\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',183.00,57.00,20,1),(323,3,'[\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',175.00,20.00,18,0),(324,2,'[\"p-03.jpg\",\"p-13.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',271.00,73.00,25,0),(325,4,'[\"p-26.jpg\",\"p-04.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',134.00,43.00,11,0),(326,1,'[\"p-30.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',60.00,80.00,14,0),(327,2,'[\"p-24.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',298.00,30.00,12,1),(328,5,'[\"p-06.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',57.00,18.00,20,1),(329,4,'[\"p-14.jpg\",\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',284.00,86.00,43,0),(330,3,'[\"p-15.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',160.00,26.00,26,0),(331,1,'[\"p-12.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',207.00,57.00,10,0),(332,1,'[\"p-13.jpg\",\"p-15.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',63.00,59.00,43,0),(333,3,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',256.00,72.00,36,1),(334,5,'[\"p-15.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,69.00,45,0),(335,5,'[\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',259.00,46.00,20,1),(336,2,'[\"p-30.jpg\",\"p-10.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',138.00,64.00,29,0),(337,4,'[\"p-14.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',116.00,84.00,29,1),(338,3,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',264.00,25.00,38,0),(339,5,'[\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',180.00,85.00,27,1),(340,1,'[\"p-15.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',58.00,47.00,24,1),(341,1,'[\"p-16.jpg\",\"p-28.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',145.00,35.00,49,0),(342,4,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',297.00,25.00,49,1),(343,2,'[\"p-11.jpg\",\"p-12.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',107.00,61.00,37,0),(344,1,'[\"p-26.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',269.00,77.00,49,0),(345,3,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',284.00,76.00,37,0),(346,3,'[\"p-17.jpg\",\"p-10.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,69.00,40,0),(347,2,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',197.00,64.00,12,0),(348,4,'[\"p-01.jpg\",\"p-06.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',64.00,61.00,46,0),(349,1,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',256.00,38.00,31,0),(350,2,'[\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',71.00,61.00,18,1),(351,3,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',111.00,12.00,49,1),(352,2,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',291.00,88.00,36,1),(353,2,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',275.00,32.00,31,0),(354,5,'[\"p-18.jpg\",\"p-10.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',65.00,10.00,26,1),(355,5,'[\"p-13.jpg\",\"p-21.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',118.00,74.00,11,0),(356,3,'[\"p-14.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',127.00,38.00,27,1),(357,4,'[\"p-12.jpg\",\"p-27.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',221.00,35.00,23,1),(358,4,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,73.00,40,1),(359,3,'[\"p-25.jpg\",\"p-07.jpg\",\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,83.00,16,1),(360,2,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',194.00,30.00,31,1),(361,3,'[\"p-19.jpg\",\"p-10.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,90.00,30,1),(362,1,'[\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',113.00,64.00,19,1),(363,3,'[\"p-19.jpg\",\"p-25.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',116.00,23.00,49,0),(364,2,'[\"p-27.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',226.00,49.00,19,0),(365,2,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',285.00,41.00,31,0),(366,5,'[\"p-22.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',181.00,18.00,31,0),(367,5,'[\"p-10.jpg\",\"p-15.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',173.00,38.00,29,0),(368,5,'[\"p-16.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',149.00,61.00,19,0),(369,5,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',288.00,46.00,17,0),(370,5,'[\"p-16.jpg\",\"p-24.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',58.00,43.00,22,1),(371,4,'[\"p-09.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',279.00,32.00,20,0),(372,2,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',229.00,44.00,20,1),(373,5,'[\"p-11.jpg\",\"p-24.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,42.00,26,1),(374,1,'[\"p-04.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',283.00,62.00,31,0),(375,5,'[\"p-24.jpg\",\"p-12.jpg\",\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',234.00,15.00,44,0),(376,5,'[\"p-29.jpg\",\"p-10.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',136.00,82.00,35,0),(377,2,'[\"p-30.jpg\",\"p-07.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',118.00,51.00,24,0),(378,3,'[\"p-14.jpg\",\"p-13.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',256.00,25.00,21,1),(379,3,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',58.00,42.00,14,0),(380,2,'[\"p-12.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',159.00,20.00,39,0),(381,3,'[\"p-10.jpg\",\"p-19.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',240.00,49.00,21,1),(382,4,'[\"p-24.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',160.00,42.00,17,1),(383,1,'[\"p-10.jpg\",\"p-08.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',137.00,82.00,28,1),(384,1,'[\"p-10.jpg\",\"p-17.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',144.00,56.00,34,0),(385,5,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,51.00,20,0),(386,4,'[\"p-05.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',125.00,84.00,47,0),(387,1,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',119.00,56.00,10,0),(388,5,'[\"p-04.jpg\",\"p-06.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,41.00,38,1),(389,5,'[\"p-10.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',70.00,44.00,33,1),(390,3,'[\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,50.00,41,0),(391,5,'[\"p-13.jpg\",\"p-13.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',291.00,57.00,24,0),(392,5,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',133.00,52.00,34,1),(393,5,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',265.00,20.00,47,0),(394,1,'[\"p-12.jpg\",\"p-12.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',115.00,44.00,43,0),(395,2,'[\"p-02.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,56.00,12,1),(396,5,'[\"p-02.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',271.00,56.00,37,0),(397,1,'[\"p-10.jpg\",\"p-10.jpg\",\"p-23.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',223.00,70.00,45,1),(398,5,'[\"p-12.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',155.00,21.00,46,1),(399,4,'[\"p-02.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',109.00,64.00,27,1),(400,2,'[\"p-16.jpg\",\"p-09.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',131.00,62.00,21,0),(401,2,'[\"p-21.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',107.00,52.00,28,0),(402,1,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',214.00,79.00,42,1),(403,2,'[\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',215.00,54.00,49,0),(404,4,'[\"p-20.jpg\",\"p-02.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',293.00,45.00,43,1),(405,5,'[\"p-07.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',100.00,19.00,43,0),(406,5,'[\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',66.00,26.00,12,0),(407,3,'[\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',229.00,67.00,28,1),(408,4,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',266.00,47.00,12,1),(409,4,'[\"p-16.jpg\",\"p-16.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',89.00,60.00,32,0),(410,3,'[\"p-08.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',123.00,67.00,46,1),(411,3,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',233.00,75.00,15,1),(412,5,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',171.00,57.00,11,1),(413,5,'[\"p-22.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',121.00,70.00,11,1),(414,1,'[\"p-19.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',280.00,18.00,25,1),(415,1,'[\"p-10.jpg\",\"p-13.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',278.00,24.00,25,0),(416,1,'[\"p-20.jpg\",\"p-08.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',214.00,78.00,42,0),(417,2,'[\"p-19.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',127.00,40.00,37,0),(418,5,'[\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',161.00,29.00,37,1),(419,2,'[\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',223.00,26.00,15,1),(420,5,'[\"p-18.jpg\",\"p-14.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',64.00,90.00,49,1),(421,5,'[\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',210.00,89.00,28,1),(422,5,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',286.00,52.00,23,1),(423,5,'[\"p-11.jpg\",\"p-21.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',208.00,52.00,20,0),(424,1,'[\"p-30.jpg\",\"p-03.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',132.00,18.00,17,0),(425,4,'[\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,48.00,24,1),(426,2,'[\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',64.00,80.00,27,0),(427,4,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',259.00,31.00,31,0),(428,4,'[\"p-06.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',250.00,45.00,25,0),(429,3,'[\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',227.00,34.00,20,0),(430,4,'[\"p-25.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',164.00,19.00,14,1),(431,4,'[\"p-08.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',209.00,32.00,29,1),(432,5,'[\"p-15.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',179.00,73.00,50,0),(433,2,'[\"p-18.jpg\",\"p-10.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',69.00,11.00,32,1),(434,4,'[\"p-12.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',109.00,78.00,38,0),(435,5,'[\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',127.00,20.00,41,0),(436,2,'[\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',271.00,63.00,43,0),(437,4,'[\"p-29.jpg\",\"p-27.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',120.00,73.00,28,0),(438,4,'[\"p-03.jpg\",\"p-10.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',263.00,83.00,25,0),(439,5,'[\"p-29.jpg\",\"p-22.jpg\",\"p-24.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',88.00,39.00,37,1),(440,1,'[\"p-10.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',170.00,31.00,17,1),(441,4,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',154.00,64.00,48,1),(442,1,'[\"p-12.jpg\",\"p-02.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',132.00,77.00,10,0),(443,2,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',244.00,18.00,17,1),(444,1,'[\"p-11.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',75.00,65.00,34,1),(445,4,'[\"p-17.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',55.00,78.00,11,0),(446,5,'[\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,65.00,24,1),(447,5,'[\"p-11.jpg\",\"p-04.jpg\",\"p-28.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',264.00,64.00,21,0),(448,1,'[\"p-03.jpg\",\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',82.00,38.00,40,1),(449,3,'[\"p-09.jpg\",\"p-16.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',119.00,64.00,48,0),(450,5,'[\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',105.00,66.00,28,1),(451,3,'[\"p-11.jpg\",\"p-06.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',86.00,57.00,37,0),(452,1,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',149.00,29.00,11,1),(453,5,'[\"p-08.jpg\",\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',75.00,57.00,19,0),(454,1,'[\"p-27.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',68.00,26.00,43,1),(455,5,'[\"p-29.jpg\",\"p-14.jpg\",\"p-30.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',226.00,40.00,43,0),(456,2,'[\"p-27.jpg\",\"p-10.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',145.00,23.00,42,0),(457,4,'[\"p-05.jpg\",\"p-15.jpg\",\"p-27.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',135.00,53.00,26,0),(458,2,'[\"p-12.jpg\",\"p-01.jpg\",\"p-14.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',142.00,17.00,33,1),(459,4,'[\"p-15.jpg\",\"p-19.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',275.00,83.00,10,1),(460,4,'[\"p-11.jpg\",\"p-26.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',57.00,28.00,34,1),(461,3,'[\"p-02.jpg\",\"p-10.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',156.00,88.00,20,0),(462,3,'[\"p-06.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',180.00,14.00,24,0),(463,3,'[\"p-01.jpg\",\"p-28.jpg\",\"p-25.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',260.00,35.00,16,1),(464,3,'[\"p-13.jpg\",\"p-27.jpg\",\"p-22.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',300.00,73.00,25,1),(465,2,'[\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',212.00,32.00,30,1),(466,1,'[\"p-19.jpg\",\"p-02.jpg\",\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',173.00,28.00,14,0),(467,1,'[\"p-12.jpg\",\"p-16.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',65.00,32.00,11,0),(468,4,'[\"p-22.jpg\",\"p-18.jpg\",\"p-18.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',223.00,41.00,45,1),(469,2,'[\"p-05.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',295.00,71.00,24,0),(470,4,'[\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,59.00,44,1),(471,5,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',213.00,50.00,28,1),(472,1,'[\"p-05.jpg\",\"p-15.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',261.00,69.00,28,0),(473,2,'[\"p-06.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',141.00,79.00,37,0),(474,4,'[\"p-11.jpg\",\"p-20.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',271.00,22.00,43,1),(475,3,'[\"p-06.jpg\",\"p-02.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',282.00,77.00,16,0),(476,1,'[\"p-14.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',194.00,67.00,16,0),(477,2,'[\"p-11.jpg\",\"p-26.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',184.00,12.00,40,1),(478,3,'[\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',172.00,90.00,18,1),(479,4,'[\"p-14.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',55.00,66.00,17,1),(480,2,'[\"p-27.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',254.00,66.00,19,1),(481,5,'[\"p-04.jpg\",\"p-19.jpg\",\"p-13.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',121.00,51.00,11,1),(482,1,'[\"p-22.jpg\",\"p-10.jpg\",\"p-07.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',226.00,32.00,25,1),(483,1,'[\"p-09.jpg\",\"p-03.jpg\",\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',121.00,18.00,27,0),(484,4,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',114.00,75.00,12,1),(485,2,'[\"p-12.jpg\",\"p-30.jpg\",\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',294.00,26.00,47,0),(486,5,'[\"p-30.jpg\",\"p-30.jpg\",\"p-01.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',185.00,31.00,45,0),(487,1,'[\"p-05.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',71.00,16.00,10,1),(488,2,'[\"p-25.jpg\",\"p-04.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',286.00,37.00,37,0),(489,5,'[\"p-30.jpg\",\"p-05.jpg\",\"p-19.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',206.00,87.00,16,1),(490,4,'[\"p-21.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',149.00,89.00,47,1),(491,2,'[\"p-13.jpg\",\"p-06.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',52.00,32.00,13,0),(492,1,'[\"p-13.jpg\",\"p-14.jpg\",\"p-09.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',167.00,69.00,42,0),(493,1,'[\"p-17.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',88.00,77.00,15,1),(494,1,'[\"p-20.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',287.00,87.00,18,0),(495,1,'[\"p-12.jpg\",\"p-18.jpg\",\"p-08.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',270.00,34.00,27,0),(496,2,'[\"p-03.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',175.00,52.00,25,0),(497,3,'[\"p-03.jpg\",\"p-11.jpg\",\"p-12.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',268.00,78.00,14,0),(498,1,'[\"p-08.jpg\",\"p-29.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',253.00,18.00,39,0),(499,1,'[\"p-28.jpg\",\"p-11.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',59.00,39.00,18,0),(500,4,'[\"p-17.jpg\",\"p-21.jpg\"]','National Fresh Fruit','All products are carefully selected to ensure food safety.',54.00,55.00,30,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
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
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
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
  `phone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `adress` varchar(50) NOT NULL,
  `secondaryPhone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_info`
--

LOCK TABLES `store_info` WRITE;
/*!40000 ALTER TABLE `store_info` DISABLE KEYS */;
INSERT INTO `store_info` VALUES (2,'09:00:00','22:00:00','10:00:00','16:00:00',25.00,' 123456660','ahmad996cyc@gmail.com','7563 St. Vicent Place, Glasgow, Greater Newyork','0987654321');
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-17 20:56:46
