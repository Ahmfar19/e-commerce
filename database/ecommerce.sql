-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 03 jul 2024 kl 19:12
-- Serverversion: 10.4.28-MariaDB
-- PHP-version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `ecommerce`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'vegetables'),
(2, 'fruits'),
(3, 'snack'),
(4, 'demo1'),
(5, 'demo2');

-- --------------------------------------------------------

--
-- Tabellstruktur `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `fname` varchar(25) NOT NULL,
  `lname` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `address` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `registered` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `shipping_id` int(11) NOT NULL,
  `order_date` datetime NOT NULL,
  `sub_total` float NOT NULL,
  `tax` float NOT NULL,
  `items_discount` float NOT NULL,
  `total` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `order_items`
--

CREATE TABLE `order_items` (
  `item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `order_type`
--

CREATE TABLE `order_type` (
  `type_id` int(11) NOT NULL,
  `type_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `order_type`
--

INSERT INTO `order_type` (`type_id`, `type_name`) VALUES
(2, 'delivered'),
(3, 'completed');

-- --------------------------------------------------------

--
-- Tabellstruktur `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `image` varchar(350) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `price` float NOT NULL,
  `discount` float NOT NULL,
  `quantity` smallint(6) NOT NULL,
  `available` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `image`, `name`, `description`, `price`, `discount`, `quantity`, `available`) VALUES
(827, 2, '', 'National Fresh Fruittt', 'All products are carefully selected to ensure food safety....', 110, 30, 8, 1),
(879, 4, '[\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 262, 56, 50, 0),
(880, 2, '[\"p-08.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 134, 83, 22, 1),
(881, 3, '[\"p-05.jpg\",\"p-19.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 244, 84, 45, 1),
(882, 2, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 176, 22, 24, 0),
(883, 5, '[\"p-21.jpg\",\"p-11.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 166, 50, 49, 0),
(884, 1, '[\"p-30.jpg\",\"p-04.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 262, 70, 10, 1),
(885, 1, '[\"p-12.jpg\",\"p-14.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 219, 72, 48, 0),
(886, 1, '[\"p-18.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 241, 80, 42, 1),
(887, 1, '[\"p-05.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 283, 13, 38, 1),
(888, 5, '[\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 242, 21, 39, 0),
(889, 3, '[\"p-06.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 198, 28, 46, 0),
(890, 2, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 91, 74, 14, 1),
(891, 5, '[\"p-13.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 220, 81, 45, 0),
(892, 5, '[\"p-22.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 126, 19, 31, 1),
(893, 4, '[\"p-10.jpg\",\"p-18.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 253, 23, 19, 0),
(894, 4, '[\"p-19.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 71, 27, 45, 1),
(895, 1, '[\"p-16.jpg\",\"p-11.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 268, 47, 16, 0),
(896, 4, '[\"p-29.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 173, 83, 27, 0),
(897, 2, '[\"p-02.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 260, 15, 29, 0),
(898, 3, '[\"p-10.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 280, 89, 31, 1),
(899, 3, '[\"p-15.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 70, 28, 28, 0),
(900, 4, '[\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 168, 37, 36, 0),
(901, 2, '[\"p-25.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 52, 20, 37, 1),
(902, 5, '[\"p-22.jpg\",\"p-11.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 264, 50, 45, 1),
(903, 1, '[\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 245, 25, 24, 1),
(904, 5, '[\"p-13.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 167, 13, 40, 1),
(905, 4, '[\"p-11.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 94, 65, 31, 0),
(906, 2, '[\"p-04.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 294, 64, 19, 0),
(907, 4, '[\"p-12.jpg\",\"p-19.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 63, 49, 33, 1),
(908, 5, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 156, 74, 25, 0),
(909, 3, '[\"p-14.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 153, 15, 26, 0),
(910, 1, '[\"p-26.jpg\",\"p-08.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 261, 65, 11, 1),
(911, 5, '[\"p-14.jpg\",\"p-27.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 247, 58, 35, 1),
(912, 4, '[\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 240, 15, 25, 0),
(913, 4, '[\"p-28.jpg\",\"p-09.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 166, 16, 27, 0),
(914, 4, '[\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 241, 34, 11, 0),
(915, 4, '[\"p-17.jpg\",\"p-08.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 148, 79, 11, 0),
(916, 2, '[\"p-19.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 283, 61, 40, 0),
(917, 2, '[\"p-28.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 249, 49, 47, 0),
(918, 2, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 227, 87, 46, 0),
(919, 2, '[\"p-04.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 269, 23, 38, 0),
(920, 5, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 50, 12, 34, 0),
(921, 5, '[\"p-25.jpg\",\"p-29.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 196, 86, 44, 0),
(922, 3, '[\"p-19.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 208, 33, 27, 1),
(923, 2, '[\"p-07.jpg\",\"p-28.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 89, 71, 23, 0),
(924, 4, '[\"p-12.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 182, 72, 28, 1),
(925, 4, '[\"p-25.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 113, 54, 21, 0),
(926, 4, '[\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 91, 80, 10, 0),
(927, 4, '[\"p-22.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 211, 23, 47, 0),
(928, 2, '[\"p-11.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 142, 41, 14, 0),
(929, 4, '[\"p-04.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 53, 43, 26, 1),
(930, 5, '[\"p-08.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 153, 53, 24, 1),
(931, 4, '[\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 139, 18, 22, 0),
(932, 5, '[\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 188, 26, 37, 1),
(933, 3, '[\"p-26.jpg\",\"p-11.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 251, 87, 38, 0),
(934, 1, '[\"p-11.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 72, 67, 30, 1),
(935, 3, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 159, 51, 38, 1),
(936, 1, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 205, 84, 17, 0),
(937, 4, '[\"p-29.jpg\",\"p-03.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 66, 14, 21, 1),
(938, 2, '[\"p-12.jpg\",\"p-28.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 165, 25, 16, 1),
(939, 3, '[\"p-13.jpg\",\"p-08.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 210, 58, 40, 0),
(940, 2, '[\"p-25.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 142, 75, 39, 1),
(941, 5, '[\"p-27.jpg\",\"p-06.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 90, 43, 26, 1),
(942, 1, '[\"p-23.jpg\",\"p-13.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 235, 28, 27, 0),
(943, 2, '[\"p-19.jpg\",\"p-03.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 91, 27, 37, 1),
(944, 3, '[\"p-16.jpg\",\"p-15.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 248, 52, 40, 0),
(945, 3, '[\"p-17.jpg\",\"p-29.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 91, 78, 39, 0),
(946, 1, '[\"p-28.jpg\",\"p-13.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 289, 22, 35, 1),
(947, 3, '[\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 199, 58, 33, 1),
(948, 3, '[\"p-30.jpg\",\"p-06.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 267, 73, 27, 0),
(949, 2, '[\"p-26.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 231, 88, 22, 0),
(950, 3, '[\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 155, 65, 30, 1),
(951, 4, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 64, 81, 20, 0),
(952, 4, '[\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 50, 15, 12, 1),
(953, 4, '[\"p-15.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 91, 80, 24, 0),
(954, 1, '[\"p-21.jpg\",\"p-10.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 255, 79, 30, 0),
(955, 2, '[\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 239, 61, 19, 0),
(956, 5, '[\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 177, 18, 19, 0),
(957, 2, '[\"p-06.jpg\",\"p-18.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 245, 60, 44, 0),
(958, 3, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 135, 87, 31, 0),
(959, 3, '[\"p-29.jpg\",\"p-17.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 290, 43, 50, 1),
(960, 2, '[\"p-12.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 194, 43, 41, 0),
(961, 1, '[\"p-18.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 182, 33, 30, 1),
(962, 3, '[\"p-26.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 285, 43, 18, 1),
(963, 1, '[\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 57, 69, 23, 1),
(964, 3, '[\"p-08.jpg\",\"p-07.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 286, 61, 36, 0),
(965, 2, '[\"p-12.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 267, 84, 18, 0),
(966, 1, '[\"p-29.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 104, 82, 26, 0),
(967, 5, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 161, 77, 24, 0),
(968, 4, '[\"p-09.jpg\",\"p-02.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 153, 53, 21, 1),
(969, 2, '[\"p-22.jpg\",\"p-05.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 299, 42, 20, 1),
(970, 5, '[\"p-11.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 196, 89, 25, 0),
(971, 4, '[\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 115, 86, 13, 0),
(972, 3, '[\"p-27.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 238, 58, 11, 0),
(973, 3, '[\"p-21.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 277, 66, 19, 0),
(974, 1, '[\"p-15.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 268, 80, 11, 0),
(975, 5, '[\"p-30.jpg\",\"p-18.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 153, 26, 23, 0),
(976, 3, '[\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 192, 80, 45, 1),
(977, 5, '[\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 169, 44, 29, 1),
(978, 2, '[\"p-02.jpg\",\"p-12.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 153, 52, 44, 0),
(979, 4, '[\"p-29.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 169, 73, 28, 0),
(980, 1, '[\"p-12.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 184, 89, 48, 0),
(981, 3, '[\"p-11.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 122, 12, 14, 1),
(982, 2, '[\"p-10.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 291, 50, 40, 0),
(983, 4, '[\"p-10.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 296, 39, 35, 1),
(984, 1, '[\"p-11.jpg\",\"p-12.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 258, 26, 43, 0),
(985, 5, '[\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 98, 41, 42, 1),
(986, 3, '[\"p-11.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 201, 40, 24, 1),
(987, 3, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 92, 62, 26, 0),
(988, 4, '[\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 269, 61, 21, 1),
(989, 3, '[\"p-17.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 247, 67, 27, 1),
(990, 4, '[\"p-03.jpg\",\"p-26.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 140, 87, 50, 1),
(991, 3, '[\"p-14.jpg\",\"p-03.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 160, 46, 36, 1),
(992, 5, '[\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 61, 76, 23, 0),
(993, 1, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 232, 28, 20, 1),
(994, 5, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 153, 20, 10, 1),
(995, 2, '[\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 246, 16, 36, 0),
(996, 2, '[\"p-10.jpg\",\"p-25.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 176, 71, 10, 1),
(997, 3, '[\"p-01.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 291, 64, 47, 0),
(998, 3, '[\"p-06.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 77, 89, 19, 1),
(999, 3, '[\"p-11.jpg\",\"p-12.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 160, 40, 34, 1),
(1000, 4, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 187, 26, 50, 1),
(1001, 5, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 76, 49, 30, 0),
(1002, 3, '[\"p-24.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 196, 59, 37, 0),
(1003, 2, '[\"p-11.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 158, 22, 15, 0),
(1004, 3, '[\"p-29.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 177, 38, 43, 1),
(1005, 3, '[\"p-22.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 202, 47, 43, 1),
(1006, 1, '[\"p-01.jpg\",\"p-02.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 201, 88, 48, 0),
(1007, 1, '[\"p-21.jpg\",\"p-07.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 283, 25, 26, 0),
(1008, 1, '[\"p-05.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 134, 61, 10, 0),
(1009, 3, '[\"p-17.jpg\",\"p-07.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 169, 40, 34, 1),
(1010, 5, '[\"p-21.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 285, 63, 25, 0),
(1011, 5, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 226, 50, 12, 0),
(1012, 3, '[\"p-06.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 171, 73, 36, 1),
(1013, 2, '[\"p-12.jpg\",\"p-28.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 126, 69, 40, 0),
(1014, 5, '[\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 286, 58, 39, 1),
(1015, 1, '[\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 75, 37, 32, 0),
(1016, 1, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 52, 79, 43, 0),
(1017, 4, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 61, 80, 14, 1),
(1018, 1, '[\"p-11.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 195, 27, 42, 1),
(1019, 3, '[\"p-16.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 198, 11, 38, 0),
(1020, 1, '[\"p-20.jpg\",\"p-22.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 208, 20, 46, 1),
(1021, 5, '[\"p-19.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 61, 87, 45, 0),
(1022, 3, '[\"p-22.jpg\",\"p-11.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 100, 88, 29, 0),
(1023, 3, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 180, 40, 10, 0),
(1024, 2, '[\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 246, 29, 49, 0),
(1025, 4, '[\"p-15.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 102, 74, 42, 0),
(1026, 5, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 193, 13, 50, 0),
(1027, 5, '[\"p-22.jpg\",\"p-12.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 229, 32, 29, 1),
(1028, 4, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 220, 13, 27, 0),
(1029, 2, '[\"p-13.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 291, 44, 46, 0),
(1030, 3, '[\"p-26.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 281, 14, 16, 0),
(1031, 5, '[\"p-06.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 134, 39, 50, 1),
(1032, 1, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 53, 68, 12, 0),
(1033, 2, '[\"p-09.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 179, 55, 30, 0),
(1034, 3, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 108, 15, 36, 1),
(1035, 1, '[\"p-20.jpg\",\"p-22.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 168, 74, 50, 1),
(1036, 4, '[\"p-03.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 87, 65, 16, 1),
(1037, 3, '[\"p-30.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 257, 45, 26, 0),
(1038, 5, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 279, 37, 26, 1),
(1039, 5, '[\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 88, 56, 34, 1),
(1040, 4, '[\"p-11.jpg\",\"p-23.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 219, 60, 12, 0),
(1041, 5, '[\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 178, 15, 38, 0),
(1042, 4, '[\"p-02.jpg\",\"p-24.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 187, 18, 28, 1),
(1043, 4, '[\"p-18.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 176, 64, 15, 0),
(1044, 1, '[\"p-24.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 172, 52, 22, 1),
(1045, 3, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 283, 27, 33, 0),
(1046, 2, '[\"p-21.jpg\",\"p-11.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 161, 17, 15, 1),
(1047, 4, '[\"p-11.jpg\",\"p-01.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 245, 24, 31, 0),
(1048, 4, '[\"p-10.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 199, 34, 30, 0),
(1049, 4, '[\"p-03.jpg\",\"p-18.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 161, 73, 37, 0),
(1050, 1, '[\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 120, 18, 46, 1),
(1051, 4, '[\"p-25.jpg\",\"p-24.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 230, 75, 26, 0),
(1052, 4, '[\"p-26.jpg\",\"p-18.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 290, 55, 29, 1),
(1053, 4, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 300, 32, 29, 0),
(1054, 2, '[\"p-19.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 243, 88, 41, 1),
(1055, 3, '[\"p-08.jpg\",\"p-10.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 92, 70, 36, 1),
(1056, 5, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 197, 90, 35, 1),
(1057, 3, '[\"p-13.jpg\",\"p-12.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 169, 27, 11, 1),
(1058, 3, '[\"p-21.jpg\",\"p-11.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 195, 34, 25, 0),
(1059, 3, '[\"p-26.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 60, 53, 31, 1),
(1060, 4, '[\"p-21.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 80, 67, 18, 0),
(1061, 4, '[\"p-10.jpg\",\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 103, 22, 42, 1),
(1062, 4, '[\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 127, 85, 33, 1),
(1063, 3, '[\"p-10.jpg\",\"p-04.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 258, 16, 49, 0),
(1064, 1, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 95, 59, 28, 1),
(1065, 5, '[\"p-27.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 151, 39, 16, 0),
(1066, 2, '[\"p-03.jpg\",\"p-02.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 259, 19, 28, 1),
(1067, 2, '[\"p-09.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 186, 86, 36, 1),
(1068, 5, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 279, 59, 16, 0),
(1069, 4, '[\"p-16.jpg\",\"p-27.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 159, 50, 19, 1),
(1070, 3, '[\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 187, 31, 45, 0),
(1071, 3, '[\"p-14.jpg\",\"p-14.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 205, 56, 37, 1),
(1072, 4, '[\"p-13.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 210, 14, 15, 1),
(1073, 2, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 178, 21, 40, 1),
(1074, 5, '[\"p-10.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 261, 70, 35, 1),
(1075, 1, '[\"p-09.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 107, 52, 19, 1),
(1076, 1, '[\"p-14.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 293, 52, 49, 1),
(1077, 4, '[\"p-09.jpg\",\"p-23.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 150, 78, 14, 1),
(1078, 3, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 286, 16, 29, 0),
(1079, 2, '[\"p-25.jpg\",\"p-15.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 180, 39, 20, 1),
(1080, 2, '[\"p-07.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 172, 33, 23, 0),
(1081, 1, '[\"p-13.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 250, 47, 35, 0),
(1082, 3, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 122, 45, 30, 1),
(1083, 3, '[\"p-17.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 258, 73, 34, 1),
(1084, 1, '[\"p-06.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 189, 78, 26, 0),
(1085, 2, '[\"p-04.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 89, 84, 38, 0),
(1086, 2, '[\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 97, 80, 33, 1),
(1087, 3, '[\"p-08.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 287, 90, 28, 1),
(1088, 3, '[\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 75, 55, 10, 0),
(1089, 1, '[\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 182, 33, 29, 0),
(1090, 1, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 121, 55, 48, 0),
(1091, 3, '[\"p-09.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 76, 43, 42, 0),
(1092, 2, '[\"p-25.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 210, 82, 18, 1),
(1093, 3, '[\"p-19.jpg\",\"p-01.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 220, 38, 24, 1),
(1094, 5, '[\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 151, 71, 27, 1),
(1095, 3, '[\"p-03.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 181, 58, 13, 0),
(1096, 1, '[\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 254, 63, 13, 1),
(1097, 4, '[\"p-03.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 99, 26, 37, 0),
(1098, 5, '[\"p-20.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 181, 90, 16, 0),
(1099, 4, '[\"p-29.jpg\",\"p-11.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 182, 22, 14, 0),
(1100, 4, '[\"p-24.jpg\",\"p-01.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 176, 64, 21, 1),
(1101, 5, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 61, 44, 11, 1),
(1102, 5, '[\"p-03.jpg\",\"p-04.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 288, 81, 13, 0),
(1103, 1, '[\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 286, 15, 33, 1),
(1104, 2, '[\"p-12.jpg\",\"p-11.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 246, 65, 17, 0),
(1105, 3, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 294, 71, 42, 0),
(1106, 4, '[\"p-09.jpg\",\"p-21.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 240, 46, 27, 0),
(1107, 2, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 215, 87, 36, 1),
(1108, 4, '[\"p-03.jpg\",\"p-11.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 237, 23, 34, 0),
(1109, 5, '[\"p-29.jpg\",\"p-13.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 87, 48, 41, 0),
(1110, 3, '[\"p-02.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 73, 25, 48, 0),
(1111, 2, '[\"p-25.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 192, 33, 33, 1),
(1112, 3, '[\"p-29.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 208, 71, 42, 1),
(1113, 3, '[\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 299, 73, 21, 1),
(1114, 2, '[\"p-18.jpg\",\"p-30.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 186, 79, 16, 0),
(1115, 2, '[\"p-30.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 252, 12, 29, 0),
(1116, 1, '[\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 101, 66, 43, 0),
(1117, 4, '[\"p-15.jpg\",\"p-11.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 244, 51, 25, 1),
(1118, 1, '[\"p-11.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 267, 90, 44, 0),
(1119, 5, '[\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 139, 12, 19, 1),
(1120, 3, '[\"p-24.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 156, 27, 42, 1),
(1121, 5, '[\"p-29.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 183, 44, 38, 0),
(1122, 2, '[\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 66, 11, 30, 1),
(1123, 4, '[\"p-10.jpg\",\"p-04.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 215, 11, 50, 1),
(1124, 2, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 231, 75, 28, 0),
(1125, 3, '[\"p-19.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 158, 22, 19, 0),
(1126, 1, '[\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 93, 48, 33, 0),
(1127, 4, '[\"p-30.jpg\",\"p-13.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 233, 77, 12, 0),
(1128, 1, '[\"p-06.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 106, 56, 21, 0),
(1129, 4, '[\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 246, 22, 40, 0),
(1130, 2, '[\"p-28.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 75, 11, 46, 1),
(1131, 5, '[\"p-01.jpg\",\"p-15.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 89, 84, 45, 1),
(1132, 2, '[\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 176, 88, 35, 0),
(1133, 4, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 126, 83, 36, 1),
(1134, 4, '[\"p-17.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 243, 17, 44, 0),
(1135, 1, '[\"p-10.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 63, 88, 25, 1),
(1136, 5, '[\"p-13.jpg\",\"p-08.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 241, 33, 31, 0),
(1137, 4, '[\"p-27.jpg\",\"p-21.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 102, 24, 39, 1),
(1138, 2, '[\"p-22.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 212, 65, 49, 1),
(1139, 1, '[\"p-05.jpg\",\"p-12.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 277, 55, 32, 0),
(1140, 4, '[\"p-22.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 269, 38, 36, 1),
(1141, 4, '[\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 259, 14, 47, 1),
(1142, 4, '[\"p-19.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 77, 40, 48, 1),
(1143, 5, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 225, 69, 15, 1),
(1144, 5, '[\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 107, 54, 23, 0),
(1145, 4, '[\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 158, 80, 39, 1),
(1146, 1, '[\"p-20.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 115, 47, 22, 0),
(1147, 4, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 189, 56, 21, 0),
(1148, 1, '[\"p-11.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 58, 26, 46, 0),
(1149, 2, '[\"p-29.jpg\",\"p-07.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 93, 43, 38, 0),
(1150, 2, '[\"p-22.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 125, 70, 22, 1),
(1151, 2, '[\"p-22.jpg\",\"p-27.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 103, 36, 41, 0),
(1152, 4, '[\"p-30.jpg\",\"p-11.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 259, 83, 31, 0),
(1153, 2, '[\"p-01.jpg\",\"p-05.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 150, 51, 44, 1),
(1154, 1, '[\"p-07.jpg\",\"p-02.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 246, 43, 12, 0),
(1155, 4, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 61, 21, 30, 0),
(1156, 3, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 249, 71, 18, 0),
(1157, 2, '[\"p-23.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 247, 88, 22, 1),
(1158, 5, '[\"p-07.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 286, 32, 28, 1),
(1159, 2, '[\"p-13.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 268, 34, 45, 0),
(1160, 5, '[\"p-23.jpg\",\"p-01.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 139, 72, 48, 0),
(1161, 5, '[\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 170, 45, 38, 0),
(1162, 1, '[\"p-01.jpg\",\"p-23.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 240, 18, 12, 1),
(1163, 3, '[\"p-16.jpg\",\"p-23.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 283, 30, 35, 1),
(1164, 1, '[\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 107, 58, 28, 1),
(1165, 1, '[\"p-10.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 262, 22, 18, 0),
(1166, 1, '[\"p-01.jpg\",\"p-06.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 148, 80, 45, 1),
(1167, 3, '[\"p-16.jpg\",\"p-02.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 195, 14, 32, 0),
(1168, 1, '[\"p-10.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 82, 33, 25, 1),
(1169, 1, '[\"p-11.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 269, 16, 27, 0),
(1170, 5, '[\"p-11.jpg\",\"p-01.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 242, 66, 22, 1),
(1171, 4, '[\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 217, 80, 48, 0),
(1172, 4, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 79, 89, 43, 0),
(1173, 1, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 252, 72, 44, 1),
(1174, 2, '[\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 252, 52, 23, 0),
(1175, 3, '[\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 220, 73, 45, 0),
(1176, 3, '[\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 182, 36, 26, 1),
(1177, 4, '[\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 272, 61, 10, 1),
(1178, 5, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 245, 17, 21, 0),
(1179, 2, '[\"p-28.jpg\",\"p-28.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 85, 71, 44, 1),
(1180, 5, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 246, 89, 40, 1),
(1181, 1, '[\"p-20.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 188, 16, 14, 0),
(1182, 4, '[\"p-26.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 200, 87, 13, 1),
(1183, 2, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 223, 56, 15, 1),
(1184, 2, '[\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 245, 80, 50, 1),
(1185, 2, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 124, 67, 23, 0),
(1186, 3, '[\"p-23.jpg\",\"p-12.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 133, 85, 44, 1),
(1187, 4, '[\"p-19.jpg\",\"p-06.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 124, 67, 42, 1),
(1188, 3, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 74, 52, 34, 0),
(1189, 1, '[\"p-20.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 231, 59, 24, 1),
(1190, 2, '[\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 141, 76, 35, 1),
(1191, 1, '[\"p-11.jpg\",\"p-26.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 107, 69, 25, 0),
(1192, 1, '[\"p-25.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 192, 54, 34, 0),
(1193, 5, '[\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 136, 36, 16, 1),
(1194, 3, '[\"p-20.jpg\",\"p-03.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 66, 86, 23, 0),
(1195, 5, '[\"p-09.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 187, 69, 38, 1),
(1196, 2, '[\"p-05.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 57, 39, 26, 1),
(1197, 3, '[\"p-30.jpg\",\"p-09.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 86, 86, 46, 1),
(1198, 3, '[\"p-19.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 136, 33, 40, 1),
(1199, 1, '[\"p-25.jpg\",\"p-17.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 50, 16, 25, 1),
(1200, 4, '[\"p-17.jpg\",\"p-28.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 291, 41, 25, 1),
(1201, 4, '[\"p-03.jpg\",\"p-21.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 123, 17, 23, 1),
(1202, 2, '[\"p-04.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 61, 30, 36, 0),
(1203, 5, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 194, 65, 47, 1),
(1204, 1, '[\"p-20.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 214, 84, 38, 0),
(1205, 3, '[\"p-29.jpg\",\"p-04.jpg\",\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 246, 47, 24, 0),
(1206, 2, '[\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 210, 65, 14, 1),
(1207, 4, '[\"p-08.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 92, 84, 22, 0),
(1208, 5, '[\"p-12.jpg\",\"p-17.jpg\",\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 111, 42, 20, 0),
(1209, 4, '[\"p-13.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 196, 24, 37, 1),
(1210, 3, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 235, 65, 43, 1),
(1211, 5, '[\"p-12.jpg\",\"p-20.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 215, 25, 33, 1),
(1212, 5, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 158, 25, 19, 0),
(1213, 5, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 116, 20, 26, 0),
(1214, 2, '[\"p-11.jpg\",\"p-02.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 190, 10, 16, 0),
(1215, 1, '[\"p-17.jpg\",\"p-03.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 149, 51, 38, 0),
(1216, 4, '[\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 168, 69, 24, 0),
(1217, 1, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 188, 16, 23, 0),
(1218, 2, '[\"p-06.jpg\",\"p-19.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 107, 78, 43, 1),
(1219, 3, '[\"p-07.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 167, 26, 24, 1),
(1220, 4, '[\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 134, 13, 13, 0),
(1221, 3, '[\"p-23.jpg\",\"p-12.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 224, 19, 12, 0),
(1222, 2, '[\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 152, 76, 45, 0),
(1223, 5, '[\"p-19.jpg\",\"p-19.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 201, 77, 16, 0),
(1224, 2, '[\"p-29.jpg\",\"p-20.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 132, 63, 42, 0),
(1225, 2, '[\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 282, 34, 33, 0),
(1226, 4, '[\"p-23.jpg\",\"p-15.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 246, 77, 45, 0),
(1227, 4, '[\"p-09.jpg\",\"p-27.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 217, 47, 20, 1),
(1228, 5, '[\"p-10.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 149, 68, 46, 0),
(1229, 1, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 245, 22, 14, 1),
(1230, 3, '[\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 65, 89, 35, 1);
INSERT INTO `products` (`product_id`, `category_id`, `image`, `name`, `description`, `price`, `discount`, `quantity`, `available`) VALUES
(1231, 5, '[\"p-08.jpg\",\"p-13.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 201, 49, 13, 0),
(1232, 3, '[\"p-02.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 187, 53, 15, 0),
(1233, 1, '[\"p-27.jpg\",\"p-14.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 127, 61, 12, 1),
(1234, 3, '[\"p-16.jpg\",\"p-27.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 154, 47, 49, 0),
(1235, 3, '[\"p-01.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 213, 34, 29, 1),
(1236, 5, '[\"p-11.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 224, 33, 41, 1),
(1237, 5, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 293, 60, 15, 1),
(1238, 5, '[\"p-11.jpg\",\"p-11.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 162, 52, 36, 1),
(1239, 4, '[\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 188, 19, 49, 1),
(1240, 4, '[\"p-29.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 88, 17, 23, 0),
(1241, 3, '[\"p-08.jpg\",\"p-13.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 161, 82, 14, 1),
(1242, 2, '[\"p-09.jpg\",\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 53, 50, 31, 1),
(1243, 3, '[\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 215, 73, 46, 0),
(1244, 2, '[\"p-05.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 283, 60, 40, 1),
(1245, 2, '[\"p-13.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 62, 24, 28, 0),
(1246, 3, '[\"p-14.jpg\",\"p-17.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 210, 35, 13, 0),
(1247, 3, '[\"p-21.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 55, 29, 10, 0),
(1248, 2, '[\"p-04.jpg\",\"p-25.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 264, 47, 38, 1),
(1249, 4, '[\"p-09.jpg\",\"p-15.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 286, 66, 25, 1),
(1250, 2, '[\"p-20.jpg\",\"p-03.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 117, 86, 41, 1),
(1251, 5, '[\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 63, 48, 27, 0),
(1252, 1, '[\"p-13.jpg\",\"p-25.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 75, 39, 18, 0),
(1253, 1, '[\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 58, 72, 34, 1),
(1254, 5, '[\"p-03.jpg\",\"p-12.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 293, 41, 49, 1),
(1255, 1, '[\"p-11.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 280, 80, 38, 0),
(1256, 3, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 212, 88, 39, 1),
(1257, 4, '[\"p-02.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 232, 44, 18, 1),
(1258, 1, '[\"p-04.jpg\",\"p-08.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 153, 90, 19, 0),
(1259, 1, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 125, 69, 42, 0),
(1260, 2, '[\"p-20.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 283, 69, 25, 0),
(1261, 3, '[\"p-02.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 220, 48, 30, 0),
(1262, 5, '[\"p-06.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 230, 65, 27, 0),
(1263, 1, '[\"p-01.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 84, 49, 49, 0),
(1264, 3, '[\"p-29.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 163, 80, 37, 0),
(1265, 1, '[\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 198, 51, 28, 0),
(1266, 2, '[\"p-04.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 152, 84, 24, 1),
(1267, 5, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 86, 30, 33, 0),
(1268, 3, '[\"p-21.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 288, 15, 21, 0),
(1269, 4, '[\"p-03.jpg\",\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 123, 17, 17, 1),
(1270, 4, '[\"p-18.jpg\",\"p-15.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 251, 90, 18, 1),
(1271, 3, '[\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 185, 12, 21, 1),
(1272, 1, '[\"p-27.jpg\",\"p-03.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 133, 25, 39, 1),
(1273, 5, '[\"p-02.jpg\",\"p-10.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 70, 36, 15, 1),
(1274, 5, '[\"p-22.jpg\",\"p-22.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 133, 33, 28, 1),
(1275, 4, '[\"p-14.jpg\",\"p-01.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 127, 45, 39, 1),
(1276, 4, '[\"p-27.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 295, 89, 44, 1),
(1277, 1, '[\"p-07.jpg\",\"p-13.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 186, 46, 23, 0),
(1278, 4, '[\"p-25.jpg\",\"p-29.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 128, 42, 30, 1),
(1279, 2, '[\"p-09.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 60, 47, 18, 0),
(1280, 4, '[\"p-30.jpg\",\"p-12.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 106, 53, 28, 0),
(1281, 4, '[\"p-02.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 233, 27, 25, 1),
(1282, 1, '[\"p-23.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 238, 90, 39, 0),
(1283, 1, '[\"p-21.jpg\",\"p-19.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 99, 53, 10, 0),
(1284, 5, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 115, 37, 45, 1),
(1285, 2, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 287, 67, 37, 1),
(1286, 1, '[\"p-10.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 52, 47, 44, 1),
(1287, 1, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 130, 53, 22, 0),
(1288, 2, '[\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 123, 83, 23, 1),
(1289, 2, '[\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 279, 84, 43, 1),
(1290, 1, '[\"p-07.jpg\",\"p-09.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 106, 62, 20, 0),
(1291, 2, '[\"p-30.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 226, 77, 16, 1),
(1292, 1, '[\"p-28.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 92, 77, 30, 0),
(1293, 2, '[\"p-12.jpg\",\"p-10.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 284, 43, 45, 0),
(1294, 4, '[\"p-11.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 178, 15, 45, 1),
(1295, 4, '[\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 297, 70, 15, 0),
(1296, 1, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 244, 56, 20, 0),
(1297, 5, '[\"p-13.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 177, 74, 21, 0),
(1298, 3, '[\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 231, 44, 21, 1),
(1299, 2, '[\"p-10.jpg\",\"p-12.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 64, 17, 19, 0),
(1300, 2, '[\"p-25.jpg\",\"p-27.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 196, 69, 22, 1),
(1301, 4, '[\"p-01.jpg\",\"p-18.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 85, 26, 44, 1),
(1302, 4, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 113, 45, 38, 0),
(1303, 4, '[\"p-05.jpg\",\"p-17.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 294, 64, 16, 0),
(1304, 1, '[\"p-24.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 171, 38, 45, 0),
(1305, 5, '[\"p-13.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 151, 38, 13, 1),
(1306, 3, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 230, 51, 34, 0),
(1307, 4, '[\"p-24.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 82, 34, 36, 0),
(1308, 5, '[\"p-11.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 85, 85, 27, 1),
(1309, 3, '[\"p-11.jpg\",\"p-12.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 75, 79, 50, 1),
(1310, 4, '[\"p-16.jpg\",\"p-09.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 206, 60, 36, 0),
(1311, 3, '[\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 89, 36, 16, 0),
(1312, 5, '[\"p-11.jpg\",\"p-17.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 82, 30, 36, 0),
(1313, 1, '[\"p-22.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 70, 76, 25, 0),
(1314, 1, '[\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 112, 16, 19, 0),
(1315, 2, '[\"p-10.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 72, 15, 19, 1),
(1316, 4, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 193, 44, 38, 1),
(1317, 4, '[\"p-27.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 58, 60, 49, 1),
(1318, 5, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 193, 55, 29, 0),
(1319, 4, '[\"p-30.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 252, 83, 43, 1),
(1320, 5, '[\"p-17.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 166, 16, 50, 1),
(1321, 1, '[\"p-01.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 105, 50, 46, 1),
(1322, 4, '[\"p-12.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 271, 57, 13, 0),
(1323, 2, '[\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 108, 18, 24, 1),
(1324, 2, '[\"p-15.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 275, 19, 39, 0),
(1325, 4, '[\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 284, 27, 24, 0),
(1326, 4, '[\"p-14.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 173, 14, 27, 1),
(1327, 4, '[\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 56, 76, 14, 0),
(1328, 4, '[\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 199, 22, 44, 0),
(1329, 1, '[\"p-18.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 158, 28, 20, 1),
(1330, 1, '[\"p-29.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 202, 77, 37, 0),
(1331, 5, '[\"p-27.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 57, 77, 30, 0),
(1332, 1, '[\"p-09.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 233, 26, 16, 0),
(1333, 3, '[\"p-10.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 219, 49, 15, 1),
(1334, 2, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 219, 38, 33, 0),
(1335, 4, '[\"p-25.jpg\",\"p-07.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 264, 38, 20, 1),
(1336, 3, '[\"p-04.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 114, 58, 38, 0),
(1337, 5, '[\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 222, 81, 32, 1),
(1338, 2, '[\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 61, 36, 40, 0),
(1339, 3, '[\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 154, 19, 39, 1),
(1340, 4, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 99, 15, 14, 1),
(1341, 1, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 238, 84, 38, 0),
(1342, 1, '[\"p-25.jpg\",\"p-26.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 263, 66, 46, 0),
(1343, 3, '[\"p-10.jpg\",\"p-29.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 249, 83, 20, 0),
(1344, 2, '[\"p-13.jpg\",\"p-27.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 65, 11, 31, 1),
(1345, 3, '[\"p-12.jpg\",\"p-01.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 250, 55, 26, 0),
(1346, 3, '[\"p-13.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 79, 15, 49, 1),
(1347, 3, '[\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 136, 19, 40, 1),
(1348, 4, '[\"p-26.jpg\",\"p-11.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 90, 31, 13, 0),
(1349, 5, '[\"p-02.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 181, 86, 33, 0),
(1350, 5, '[\"p-22.jpg\",\"p-03.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 83, 70, 12, 0),
(1351, 4, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 296, 87, 20, 1),
(1352, 2, '[\"p-28.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 125, 15, 35, 0),
(1353, 1, '[\"p-11.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 184, 14, 22, 1),
(1354, 2, '[\"p-10.jpg\",\"p-03.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 175, 40, 39, 0),
(1355, 3, '[\"p-10.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 299, 26, 42, 1),
(1356, 2, '[\"p-27.jpg\",\"p-28.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 187, 53, 32, 1),
(1357, 3, '[\"p-23.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 215, 88, 17, 1),
(1358, 5, '[\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 88, 74, 44, 1),
(1359, 3, '[\"p-10.jpg\",\"p-29.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 232, 30, 43, 1),
(1360, 2, '[\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 250, 64, 25, 0),
(1361, 4, '[\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 266, 69, 32, 1),
(1362, 5, '[\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 115, 76, 12, 0),
(1363, 3, '[\"p-12.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 135, 38, 19, 1),
(1364, 5, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 108, 61, 35, 0),
(1365, 5, '[\"p-13.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 265, 40, 40, 0),
(1366, 5, '[\"p-27.jpg\",\"p-01.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 177, 35, 33, 0),
(1367, 1, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 170, 19, 49, 1),
(1368, 5, '[\"p-10.jpg\",\"p-14.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 250, 23, 21, 1),
(1369, 5, '[\"p-02.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 128, 83, 43, 0),
(1370, 1, '[\"p-12.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 296, 68, 33, 1),
(1371, 1, '[\"p-05.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 70, 31, 31, 1),
(1372, 2, '[\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 248, 36, 16, 0),
(1373, 4, '[\"p-13.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 66, 72, 40, 1),
(1374, 3, '[\"p-04.jpg\",\"p-12.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 161, 64, 15, 0),
(1375, 4, '[\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 217, 37, 19, 0),
(1376, 4, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 148, 72, 16, 1),
(1377, 2, '[\"p-10.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 131, 84, 36, 1),
(1378, 5, '[\"p-08.jpg\",\"p-07.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 183, 76, 36, 1);

-- --------------------------------------------------------

--
-- Tabellstruktur `product_review`
--

CREATE TABLE `product_review` (
  `review_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `product_tag`
--

CREATE TABLE `product_tag` (
  `product_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `reset_password`
--

CREATE TABLE `reset_password` (
  `reset_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `pinCode` int(11) NOT NULL,
  `expiresAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `shipping`
--

CREATE TABLE `shipping` (
  `shipping_id` int(11) NOT NULL,
  `shipping_name` varchar(50) NOT NULL,
  `shipping_price` float NOT NULL,
  `shipping_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `shipping`
--

INSERT INTO `shipping` (`shipping_id`, `shipping_name`, `shipping_price`, `shipping_time`) VALUES
(2, 'DHL', 100.35, '02:00:00');

-- --------------------------------------------------------

--
-- Tabellstruktur `store_info`
--

CREATE TABLE `store_info` (
  `id` int(11) NOT NULL,
  `opening_day` time NOT NULL,
  `closing_day` time NOT NULL,
  `opening_weekend` time NOT NULL,
  `closing_weekend` time NOT NULL,
  `tax_percentage` decimal(5,2) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `adress` varchar(50) NOT NULL,
  `secondaryPhone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `store_info`
--

INSERT INTO `store_info` (`id`, `opening_day`, `closing_day`, `opening_weekend`, `closing_weekend`, `tax_percentage`, `phone`, `email`, `adress`, `secondaryPhone`) VALUES
(2, '09:00:00', '22:00:00', '10:00:00', '16:00:00', 25.00, ' 123456660', 'ahmad996cyc@gmail.com', '7563 St. Vicent Place, Glasgow, Greater Newyork', '0987654321');

-- --------------------------------------------------------

--
-- Tabellstruktur `tags`
--

CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `transaction`
--

CREATE TABLE `transaction` (
  `transaction_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `mode` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Index för tabell `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Index för tabell `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `orders_ibfk_1` (`customer_id`),
  ADD KEY `type_id` (`type_id`),
  ADD KEY `shipping_id` (`shipping_id`);

--
-- Index för tabell `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `order_items_ibfk_1` (`product_id`),
  ADD KEY `order_items_ibfk_2` (`order_id`);

--
-- Index för tabell `order_type`
--
ALTER TABLE `order_type`
  ADD PRIMARY KEY (`type_id`);

--
-- Index för tabell `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `products_ibfk_1` (`category_id`);

--
-- Index för tabell `product_review`
--
ALTER TABLE `product_review`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index för tabell `product_tag`
--
ALTER TABLE `product_tag`
  ADD KEY `tag_id` (`tag_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index för tabell `reset_password`
--
ALTER TABLE `reset_password`
  ADD PRIMARY KEY (`reset_id`);

--
-- Index för tabell `shipping`
--
ALTER TABLE `shipping`
  ADD PRIMARY KEY (`shipping_id`);

--
-- Index för tabell `store_info`
--
ALTER TABLE `store_info`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag_id`);

--
-- Index för tabell `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `order_id` (`order_id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT för tabell `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT för tabell `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=225;

--
-- AUTO_INCREMENT för tabell `order_items`
--
ALTER TABLE `order_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=398;

--
-- AUTO_INCREMENT för tabell `order_type`
--
ALTER TABLE `order_type`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT för tabell `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1379;

--
-- AUTO_INCREMENT för tabell `product_review`
--
ALTER TABLE `product_review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `reset_password`
--
ALTER TABLE `reset_password`
  MODIFY `reset_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT för tabell `shipping`
--
ALTER TABLE `shipping`
  MODIFY `shipping_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT för tabell `store_info`
--
ALTER TABLE `store_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT för tabell `tags`
--
ALTER TABLE `tags`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `order_type` (`type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipping_id`) REFERENCES `shipping` (`shipping_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `product_review`
--
ALTER TABLE `product_review`
  ADD CONSTRAINT `product_review_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_review_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `product_tag`
--
ALTER TABLE `product_tag`
  ADD CONSTRAINT `product_tag_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_tag_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Restriktioner för tabell `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
