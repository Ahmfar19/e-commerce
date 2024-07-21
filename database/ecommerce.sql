-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 21 jul 2024 kl 14:03
-- Serverversion: 10.4.32-MariaDB
-- PHP-version: 8.2.12

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
(2, 'snacks'),
(3, 'Bread'),
(4, 'Fruti'),
(5, 'demo');

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
  `zip` varchar(10) NOT NULL,
  `city` varchar(30) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `registered` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `customers`
--

INSERT INTO `customers` (`customer_id`, `fname`, `lname`, `email`, `password`, `address`, `zip`, `city`, `phone`, `registered`) VALUES
(119, 'osama', 'faroun', 'osamafaroun7@gmail.com', '$2a$10$VM2iUmA/9GTDxLcrgAlvu.c4Pm2eqtot8W6zwyqUOZYib74Uaq64e', 'aaaa', '', '', '234234', 0),
(120, 'Ahmad', 'Faroun', 'ahmad996cyc@gmail.com', '$2a$10$0TerN8ZfIHi9CItIpym7rupJW6a0iUmD8t6zMh0DHJ1uN1NrTfuf2', '', '', '', '', 0);

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
  `sub_total` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL,
  `items_discount` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL
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
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `quantity` smallint(6) NOT NULL,
  `available` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `image`, `name`, `description`, `price`, `discount`, `quantity`, `available`) VALUES
(1, 5, '[\"p-20.jpg\",\"p-29.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 120.00, 33.00, 0, 0),
(2, 4, '[\"p-21.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 275.00, 88.00, 0, 0),
(3, 4, '[\"p-21.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 264.00, 62.00, 0, 0),
(4, 3, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 108.00, 53.00, 20, 1),
(5, 1, '[\"p-30.jpg\",\"p-12.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 204.00, 40.00, 20, 1),
(6, 2, '[\"p-05.jpg\",\"p-02.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 175.00, 34.00, 20, 1),
(7, 2, '[\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 101.00, 74.00, 20, 1),
(8, 4, '[\"p-06.jpg\",\"p-08.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 101.00, 87.00, 20, 1),
(9, 5, '[\"p-24.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 68.00, 50.00, 20, 1),
(10, 3, '[\"p-24.jpg\",\"p-09.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 75.00, 25.00, 20, 1),
(11, 2, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 155.00, 74.00, 20, 1),
(12, 4, '[\"p-26.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 247.00, 80.00, 20, 1),
(13, 3, '[\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 270.00, 72.00, 20, 1),
(14, 5, '[\"p-22.jpg\",\"p-10.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 263.00, 73.00, 20, 1),
(15, 1, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 241.00, 73.00, 20, 1),
(16, 3, '[\"p-27.jpg\",\"p-29.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 293.00, 23.00, 20, 1),
(17, 3, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 284.00, 52.00, 20, 1),
(18, 1, '[\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 255.00, 68.00, 20, 1),
(19, 5, '[\"p-04.jpg\",\"p-26.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 249.00, 33.00, 20, 1),
(20, 3, '[\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 242.00, 47.00, 20, 1),
(21, 3, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 207.00, 59.00, 20, 1),
(22, 5, '[\"p-04.jpg\",\"p-15.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 104.00, 21.00, 20, 1),
(23, 1, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 186.00, 73.00, 20, 1),
(24, 5, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 133.00, 63.00, 20, 1),
(25, 1, '[\"p-16.jpg\",\"p-27.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 96.00, 19.00, 20, 1),
(26, 3, '[\"p-23.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 78.00, 59.00, 20, 1),
(27, 5, '[\"p-19.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 228.00, 84.00, 20, 1),
(28, 1, '[\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 246.00, 32.00, 20, 1),
(29, 4, '[\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 87.00, 25.00, 20, 1),
(30, 4, '[\"p-11.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 107.00, 63.00, 20, 1),
(31, 3, '[\"p-14.jpg\",\"p-04.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 76.00, 55.00, 20, 1),
(32, 5, '[\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 139.00, 58.00, 20, 1),
(33, 2, '[\"p-19.jpg\",\"p-11.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 196.00, 23.00, 20, 1),
(34, 5, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 116.00, 70.00, 20, 1),
(35, 3, '[\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 235.00, 75.00, 20, 1),
(36, 1, '[\"p-19.jpg\",\"p-10.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 80.00, 62.00, 20, 1),
(37, 1, '[\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 142.00, 36.00, 20, 1),
(38, 1, '[\"p-10.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 122.00, 70.00, 20, 1),
(39, 2, '[\"p-10.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 211.00, 29.00, 20, 1),
(40, 5, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 150.00, 66.00, 20, 1),
(41, 4, '[\"p-09.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 188.00, 45.00, 20, 1),
(42, 1, '[\"p-30.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 185.00, 58.00, 20, 1),
(43, 2, '[\"p-20.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 277.00, 70.00, 20, 1),
(44, 5, '[\"p-09.jpg\",\"p-25.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 218.00, 10.00, 20, 1),
(45, 3, '[\"p-10.jpg\",\"p-13.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 213.00, 46.00, 20, 1),
(46, 3, '[\"p-04.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 212.00, 11.00, 20, 1),
(47, 2, '[\"p-03.jpg\",\"p-20.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 261.00, 43.00, 20, 1),
(48, 4, '[\"p-03.jpg\",\"p-23.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 78.00, 88.00, 20, 1),
(49, 3, '[\"p-26.jpg\",\"p-03.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 66.00, 37.00, 20, 1),
(50, 4, '[\"p-22.jpg\",\"p-30.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 249.00, 90.00, 20, 1),
(51, 2, '[\"p-04.jpg\",\"p-02.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 153.00, 41.00, 20, 1),
(52, 2, '[\"p-14.jpg\",\"p-15.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 60.00, 55.00, 20, 1),
(53, 1, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 299.00, 71.00, 20, 1),
(54, 1, '[\"p-10.jpg\",\"p-18.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 246.00, 55.00, 20, 1),
(55, 1, '[\"p-20.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 179.00, 29.00, 20, 1),
(56, 4, '[\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 280.00, 27.00, 20, 1),
(57, 5, '[\"p-07.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 250.00, 73.00, 20, 1),
(58, 4, '[\"p-04.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 188.00, 29.00, 20, 1),
(59, 2, '[\"p-24.jpg\",\"p-10.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 240.00, 58.00, 20, 1),
(60, 3, '[\"p-03.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 152.00, 83.00, 20, 1),
(61, 2, '[\"p-11.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 108.00, 13.00, 20, 1),
(62, 4, '[\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 268.00, 55.00, 20, 1),
(63, 2, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 239.00, 28.00, 20, 1),
(64, 1, '[\"p-22.jpg\",\"p-04.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 152.00, 64.00, 20, 1),
(65, 2, '[\"p-29.jpg\",\"p-21.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 216.00, 90.00, 20, 1),
(66, 4, '[\"p-23.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 261.00, 83.00, 20, 1),
(67, 2, '[\"p-28.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 88.00, 82.00, 20, 1),
(68, 1, '[\"p-11.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 78.00, 83.00, 20, 1),
(69, 5, '[\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 138.00, 84.00, 20, 1),
(70, 3, '[\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 237.00, 63.00, 20, 1),
(71, 5, '[\"p-03.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 72.00, 66.00, 20, 1),
(72, 5, '[\"p-08.jpg\",\"p-20.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 209.00, 34.00, 20, 1),
(73, 2, '[\"p-10.jpg\",\"p-02.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 52.00, 14.00, 20, 1),
(74, 1, '[\"p-06.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 282.00, 80.00, 20, 1),
(75, 5, '[\"p-21.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 147.00, 63.00, 20, 1),
(76, 3, '[\"p-09.jpg\",\"p-30.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 228.00, 60.00, 20, 1),
(77, 3, '[\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 208.00, 16.00, 20, 1),
(78, 5, '[\"p-29.jpg\",\"p-10.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 77.00, 38.00, 20, 1),
(79, 4, '[\"p-26.jpg\",\"p-28.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 111.00, 31.00, 20, 1),
(80, 5, '[\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 136.00, 40.00, 20, 1),
(81, 2, '[\"p-25.jpg\",\"p-08.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 200.00, 68.00, 20, 1),
(82, 4, '[\"p-09.jpg\",\"p-17.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 234.00, 51.00, 20, 1),
(83, 1, '[\"p-23.jpg\",\"p-25.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 266.00, 28.00, 20, 1),
(84, 2, '[\"p-22.jpg\",\"p-19.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 184.00, 57.00, 20, 1),
(85, 3, '[\"p-20.jpg\",\"p-03.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 76.00, 72.00, 20, 1),
(86, 5, '[\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 77.00, 55.00, 20, 1),
(87, 3, '[\"p-12.jpg\",\"p-25.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 167.00, 58.00, 20, 1),
(88, 3, '[\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 137.00, 65.00, 20, 1),
(89, 3, '[\"p-09.jpg\",\"p-11.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 215.00, 59.00, 20, 1),
(90, 5, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 99.00, 11.00, 20, 1),
(91, 1, '[\"p-29.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 295.00, 67.00, 20, 1),
(92, 1, '[\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 100.00, 33.00, 20, 1),
(93, 5, '[\"p-10.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 269.00, 80.00, 20, 1),
(94, 4, '[\"p-08.jpg\",\"p-10.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 59.00, 26.00, 20, 1),
(95, 2, '[\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 207.00, 45.00, 20, 1),
(96, 1, '[\"p-11.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 118.00, 60.00, 20, 1),
(97, 2, '[\"p-19.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 251.00, 71.00, 20, 1),
(98, 5, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 218.00, 73.00, 20, 1),
(99, 3, '[\"p-09.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 223.00, 33.00, 20, 1),
(100, 5, '[\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 253.00, 58.00, 20, 1),
(101, 4, '[\"p-22.jpg\",\"p-16.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 152.00, 37.00, 20, 1),
(102, 4, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 153.00, 30.00, 20, 1),
(103, 3, '[\"p-07.jpg\",\"p-12.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 176.00, 51.00, 20, 1),
(104, 5, '[\"p-11.jpg\",\"p-18.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 78.00, 59.00, 20, 1),
(105, 2, '[\"p-22.jpg\",\"p-18.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 216.00, 50.00, 20, 1),
(106, 5, '[\"p-24.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 297.00, 43.00, 20, 1),
(107, 5, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 141.00, 54.00, 20, 1),
(108, 4, '[\"p-17.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 213.00, 51.00, 20, 1),
(109, 1, '[\"p-05.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 90.00, 32.00, 20, 1),
(110, 1, '[\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 239.00, 86.00, 20, 1),
(111, 5, '[\"p-23.jpg\",\"p-13.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 297.00, 62.00, 20, 1),
(112, 2, '[\"p-17.jpg\",\"p-11.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 231.00, 47.00, 20, 1),
(113, 2, '[\"p-12.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 171.00, 24.00, 20, 1),
(114, 1, '[\"p-14.jpg\",\"p-09.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 212.00, 74.00, 20, 1),
(115, 4, '[\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 130.00, 73.00, 20, 1),
(116, 3, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 184.00, 55.00, 20, 1),
(117, 4, '[\"p-16.jpg\",\"p-01.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 132.00, 13.00, 20, 1),
(118, 2, '[\"p-12.jpg\",\"p-09.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 206.00, 17.00, 20, 1),
(119, 3, '[\"p-19.jpg\",\"p-12.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 124.00, 66.00, 20, 1),
(120, 3, '[\"p-17.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 126.00, 45.00, 20, 1),
(121, 2, '[\"p-02.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 57.00, 67.00, 20, 1),
(122, 3, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 249.00, 55.00, 20, 1),
(123, 1, '[\"p-18.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 140.00, 79.00, 20, 1),
(124, 3, '[\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 240.00, 37.00, 20, 1),
(125, 4, '[\"p-30.jpg\",\"p-12.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 113.00, 29.00, 20, 1),
(126, 4, '[\"p-15.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 214.00, 14.00, 20, 1),
(127, 3, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 172.00, 50.00, 20, 1),
(128, 1, '[\"p-02.jpg\",\"p-08.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 102.00, 72.00, 20, 1),
(129, 4, '[\"p-13.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 266.00, 85.00, 20, 1),
(130, 3, '[\"p-13.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 69.00, 65.00, 20, 1),
(131, 3, '[\"p-24.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 195.00, 69.00, 20, 1),
(132, 5, '[\"p-04.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 115.00, 18.00, 20, 1),
(133, 4, '[\"p-11.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 298.00, 28.00, 20, 1),
(134, 3, '[\"p-26.jpg\",\"p-21.jpg\",\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 96.00, 67.00, 20, 1),
(135, 4, '[\"p-15.jpg\",\"p-15.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 89.00, 16.00, 20, 1),
(136, 1, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 212.00, 81.00, 20, 1),
(137, 5, '[\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 55.00, 14.00, 20, 1),
(138, 5, '[\"p-14.jpg\",\"p-17.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 206.00, 85.00, 20, 1),
(139, 5, '[\"p-20.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 141.00, 62.00, 20, 1),
(140, 4, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 179.00, 49.00, 20, 1),
(141, 4, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 184.00, 48.00, 20, 1),
(142, 2, '[\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 247.00, 86.00, 20, 1),
(143, 2, '[\"p-24.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 139.00, 14.00, 20, 1),
(144, 2, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 131.00, 39.00, 20, 1),
(145, 4, '[\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 70.00, 67.00, 20, 1),
(146, 5, '[\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 144.00, 20.00, 20, 1),
(147, 2, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 148.00, 36.00, 20, 1),
(148, 4, '[\"p-26.jpg\",\"p-16.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 269.00, 19.00, 20, 1),
(149, 5, '[\"p-22.jpg\",\"p-25.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 149.00, 85.00, 20, 1),
(150, 3, '[\"p-27.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 193.00, 90.00, 20, 1),
(151, 2, '[\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 169.00, 53.00, 20, 1),
(152, 1, '[\"p-04.jpg\",\"p-29.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 224.00, 72.00, 20, 1),
(153, 4, '[\"p-04.jpg\",\"p-03.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 199.00, 47.00, 20, 1),
(154, 2, '[\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 124.00, 27.00, 20, 1),
(155, 3, '[\"p-15.jpg\",\"p-26.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 197.00, 48.00, 20, 1),
(156, 3, '[\"p-28.jpg\",\"p-10.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 62.00, 23.00, 20, 1),
(157, 5, '[\"p-28.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 172.00, 77.00, 20, 1),
(158, 3, '[\"p-20.jpg\",\"p-09.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 235.00, 67.00, 20, 1),
(159, 3, '[\"p-12.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 226.00, 55.00, 20, 1),
(160, 4, '[\"p-26.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 212.00, 53.00, 20, 1),
(161, 3, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 79.00, 69.00, 20, 1),
(162, 4, '[\"p-12.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 179.00, 87.00, 20, 1),
(163, 2, '[\"p-07.jpg\",\"p-12.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 187.00, 31.00, 20, 1),
(164, 5, '[\"p-04.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 235.00, 12.00, 20, 1),
(165, 5, '[\"p-13.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 256.00, 42.00, 20, 1),
(166, 4, '[\"p-07.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 126.00, 89.00, 20, 1),
(167, 2, '[\"p-05.jpg\",\"p-12.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 221.00, 77.00, 20, 1),
(168, 2, '[\"p-13.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 256.00, 18.00, 20, 1),
(169, 2, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 75.00, 68.00, 20, 1),
(170, 1, '[\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 81.00, 23.00, 20, 1),
(171, 1, '[\"p-01.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 155.00, 74.00, 20, 1),
(172, 3, '[\"p-03.jpg\",\"p-16.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 295.00, 52.00, 20, 1),
(173, 2, '[\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 187.00, 84.00, 20, 1),
(174, 1, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 126.00, 58.00, 20, 1),
(175, 1, '[\"p-30.jpg\",\"p-05.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 279.00, 59.00, 20, 1),
(176, 5, '[\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 66.00, 22.00, 20, 1),
(177, 5, '[\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 100.00, 11.00, 20, 1),
(178, 3, '[\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 86.00, 22.00, 20, 1),
(179, 2, '[\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 245.00, 68.00, 20, 1),
(180, 3, '[\"p-27.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 200.00, 71.00, 20, 1),
(181, 1, '[\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 286.00, 27.00, 20, 1),
(182, 5, '[\"p-24.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 75.00, 50.00, 20, 1),
(183, 5, '[\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 274.00, 88.00, 20, 1),
(184, 4, '[\"p-09.jpg\",\"p-11.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 250.00, 10.00, 20, 1),
(185, 2, '[\"p-23.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 125.00, 25.00, 20, 1),
(186, 4, '[\"p-11.jpg\",\"p-13.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 179.00, 74.00, 20, 1),
(187, 5, '[\"p-27.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 189.00, 75.00, 20, 1),
(188, 3, '[\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 284.00, 61.00, 20, 1),
(189, 5, '[\"p-04.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 270.00, 79.00, 20, 1),
(190, 5, '[\"p-07.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 172.00, 25.00, 20, 1),
(191, 3, '[\"p-10.jpg\",\"p-10.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 155.00, 28.00, 20, 1),
(192, 2, '[\"p-16.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 252.00, 42.00, 20, 1),
(193, 4, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 223.00, 68.00, 20, 1),
(194, 4, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 55.00, 53.00, 20, 1),
(195, 2, '[\"p-13.jpg\",\"p-22.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 225.00, 60.00, 20, 1),
(196, 4, '[\"p-13.jpg\",\"p-05.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 146.00, 73.00, 20, 1),
(197, 4, '[\"p-12.jpg\",\"p-29.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 228.00, 12.00, 20, 1),
(198, 3, '[\"p-11.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 272.00, 48.00, 20, 1),
(199, 4, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 225.00, 77.00, 20, 1),
(200, 4, '[\"p-16.jpg\",\"p-28.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 150.00, 60.00, 20, 1),
(201, 2, '[\"p-10.jpg\",\"p-16.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 200.00, 59.00, 20, 1),
(202, 2, '[\"p-22.jpg\",\"p-08.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 71.00, 20.00, 20, 1),
(203, 3, '[\"p-19.jpg\",\"p-10.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 233.00, 70.00, 20, 1),
(204, 2, '[\"p-20.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 257.00, 71.00, 20, 1),
(205, 4, '[\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 156.00, 29.00, 20, 1),
(206, 4, '[\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 186.00, 68.00, 20, 1),
(207, 3, '[\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 294.00, 36.00, 20, 1),
(208, 2, '[\"p-05.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 82.00, 89.00, 20, 1),
(209, 3, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 293.00, 84.00, 20, 1),
(210, 5, '[\"p-05.jpg\",\"p-06.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 201.00, 74.00, 20, 1),
(211, 5, '[\"p-30.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 258.00, 73.00, 20, 1),
(212, 3, '[\"p-21.jpg\",\"p-23.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 219.00, 77.00, 20, 1),
(213, 3, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 237.00, 43.00, 20, 1),
(214, 4, '[\"p-05.jpg\",\"p-22.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 258.00, 60.00, 20, 1),
(215, 3, '[\"p-22.jpg\",\"p-03.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 146.00, 90.00, 20, 1),
(216, 1, '[\"p-19.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 241.00, 48.00, 20, 1),
(217, 2, '[\"p-20.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 118.00, 20.00, 20, 1),
(218, 3, '[\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 157.00, 25.00, 20, 1),
(219, 1, '[\"p-12.jpg\",\"p-21.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 130.00, 36.00, 20, 1),
(220, 5, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 52.00, 83.00, 20, 1),
(221, 5, '[\"p-28.jpg\",\"p-18.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 114.00, 20.00, 20, 1),
(222, 3, '[\"p-22.jpg\",\"p-11.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 140.00, 70.00, 20, 1),
(223, 2, '[\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 240.00, 78.00, 20, 1),
(224, 5, '[\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 129.00, 35.00, 20, 1),
(225, 3, '[\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 127.00, 51.00, 20, 1),
(226, 4, '[\"p-12.jpg\",\"p-03.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 249.00, 30.00, 20, 1),
(227, 5, '[\"p-23.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 154.00, 87.00, 20, 1),
(228, 1, '[\"p-14.jpg\",\"p-09.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 57.00, 71.00, 20, 1),
(229, 2, '[\"p-13.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 66.00, 80.00, 20, 1),
(230, 4, '[\"p-15.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 140.00, 27.00, 20, 1),
(231, 3, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 161.00, 23.00, 20, 1),
(232, 5, '[\"p-24.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 195.00, 44.00, 20, 1),
(233, 1, '[\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 156.00, 74.00, 20, 1),
(234, 5, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 237.00, 30.00, 20, 1),
(235, 3, '[\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 199.00, 81.00, 20, 1),
(236, 4, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 111.00, 66.00, 20, 1),
(237, 4, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 220.00, 57.00, 20, 1),
(238, 4, '[\"p-23.jpg\",\"p-24.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 285.00, 80.00, 20, 1),
(239, 3, '[\"p-08.jpg\",\"p-05.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 93.00, 27.00, 20, 1),
(240, 2, '[\"p-25.jpg\",\"p-04.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 204.00, 52.00, 20, 1),
(241, 4, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 221.00, 69.00, 20, 1),
(242, 4, '[\"p-15.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 206.00, 87.00, 20, 1),
(243, 5, '[\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 76.00, 67.00, 20, 1),
(244, 1, '[\"p-15.jpg\",\"p-15.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 197.00, 17.00, 20, 1),
(245, 2, '[\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 193.00, 51.00, 20, 1),
(246, 3, '[\"p-13.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 284.00, 47.00, 20, 1),
(247, 2, '[\"p-04.jpg\",\"p-16.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 154.00, 27.00, 20, 1),
(248, 5, '[\"p-25.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 246.00, 48.00, 20, 1),
(249, 5, '[\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 248.00, 77.00, 20, 1),
(250, 5, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 67.00, 41.00, 20, 1),
(251, 3, '[\"p-29.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 58.00, 72.00, 20, 1),
(252, 3, '[\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 157.00, 52.00, 20, 1),
(253, 5, '[\"p-18.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 270.00, 57.00, 20, 1),
(254, 3, '[\"p-07.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 218.00, 46.00, 20, 1),
(255, 1, '[\"p-18.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 177.00, 57.00, 20, 1),
(256, 5, '[\"p-12.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 195.00, 48.00, 20, 1),
(257, 5, '[\"p-27.jpg\",\"p-01.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 152.00, 15.00, 20, 1),
(258, 4, '[\"p-24.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 85.00, 55.00, 20, 1),
(259, 3, '[\"p-19.jpg\",\"p-16.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 143.00, 76.00, 20, 1),
(260, 1, '[\"p-26.jpg\",\"p-12.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 133.00, 61.00, 20, 1),
(261, 3, '[\"p-19.jpg\",\"p-10.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 252.00, 76.00, 20, 1),
(262, 4, '[\"p-04.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 122.00, 63.00, 20, 1),
(263, 2, '[\"p-23.jpg\",\"p-06.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 167.00, 46.00, 20, 1),
(264, 5, '[\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 125.00, 18.00, 20, 1),
(265, 2, '[\"p-28.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 158.00, 65.00, 20, 1),
(266, 2, '[\"p-04.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 208.00, 47.00, 20, 1),
(267, 5, '[\"p-09.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 236.00, 88.00, 20, 1),
(268, 3, '[\"p-26.jpg\",\"p-11.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 193.00, 43.00, 20, 1),
(269, 1, '[\"p-01.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 93.00, 58.00, 20, 1),
(270, 2, '[\"p-16.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 288.00, 53.00, 20, 1),
(271, 3, '[\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 155.00, 11.00, 20, 1),
(272, 1, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 276.00, 38.00, 20, 1),
(273, 4, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 121.00, 31.00, 20, 1),
(274, 1, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 180.00, 62.00, 20, 1),
(275, 1, '[\"p-17.jpg\",\"p-14.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 260.00, 50.00, 20, 1),
(276, 4, '[\"p-17.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 93.00, 18.00, 20, 1),
(277, 5, '[\"p-18.jpg\",\"p-15.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 138.00, 20.00, 20, 1),
(278, 5, '[\"p-30.jpg\",\"p-11.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 132.00, 88.00, 20, 1),
(279, 2, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 154.00, 48.00, 20, 1),
(280, 2, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 157.00, 82.00, 20, 1),
(281, 3, '[\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 81.00, 32.00, 20, 1),
(282, 5, '[\"p-14.jpg\",\"p-11.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 181.00, 24.00, 20, 1),
(283, 5, '[\"p-05.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 293.00, 81.00, 20, 1),
(284, 2, '[\"p-18.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 157.00, 21.00, 20, 1),
(285, 3, '[\"p-10.jpg\",\"p-18.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 241.00, 64.00, 20, 1),
(286, 3, '[\"p-10.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 195.00, 49.00, 20, 1),
(287, 5, '[\"p-25.jpg\",\"p-23.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 186.00, 82.00, 20, 1),
(288, 5, '[\"p-06.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 272.00, 42.00, 20, 1),
(289, 3, '[\"p-13.jpg\",\"p-26.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 51.00, 16.00, 20, 1),
(290, 1, '[\"p-24.jpg\",\"p-12.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 289.00, 72.00, 20, 1),
(291, 1, '[\"p-07.jpg\",\"p-22.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 225.00, 37.00, 20, 1),
(292, 3, '[\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 236.00, 78.00, 20, 1),
(293, 5, '[\"p-20.jpg\",\"p-14.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 122.00, 20.00, 20, 1),
(294, 4, '[\"p-10.jpg\",\"p-23.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 108.00, 60.00, 20, 1),
(295, 2, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 126.00, 58.00, 20, 1),
(296, 2, '[\"p-19.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 215.00, 44.00, 20, 1),
(297, 2, '[\"p-06.jpg\",\"p-08.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 185.00, 76.00, 20, 1),
(298, 2, '[\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 91.00, 22.00, 20, 1),
(299, 2, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 295.00, 66.00, 20, 1),
(300, 3, '[\"p-21.jpg\",\"p-02.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 154.00, 88.00, 20, 1),
(301, 5, '[\"p-11.jpg\",\"p-11.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 109.00, 31.00, 20, 1),
(302, 4, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 66.00, 29.00, 20, 1),
(303, 5, '[\"p-29.jpg\",\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 113.00, 69.00, 20, 1),
(304, 3, '[\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 183.00, 86.00, 20, 1),
(305, 2, '[\"p-28.jpg\",\"p-09.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 88.00, 52.00, 20, 1),
(306, 4, '[\"p-15.jpg\",\"p-03.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 299.00, 72.00, 20, 1),
(307, 1, '[\"p-17.jpg\",\"p-28.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 86.00, 25.00, 20, 1),
(308, 4, '[\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 125.00, 35.00, 20, 1),
(309, 3, '[\"p-10.jpg\",\"p-10.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 299.00, 60.00, 20, 1),
(310, 2, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 128.00, 54.00, 20, 1),
(311, 1, '[\"p-02.jpg\",\"p-20.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 277.00, 58.00, 20, 1),
(312, 5, '[\"p-21.jpg\",\"p-10.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 139.00, 80.00, 20, 1),
(313, 2, '[\"p-28.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 61.00, 17.00, 20, 1),
(314, 3, '[\"p-19.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 214.00, 64.00, 20, 1),
(315, 2, '[\"p-04.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 283.00, 19.00, 20, 1),
(316, 4, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 274.00, 29.00, 20, 1),
(317, 2, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 107.00, 51.00, 20, 1),
(318, 1, '[\"p-13.jpg\",\"p-04.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 140.00, 45.00, 20, 1),
(319, 1, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 127.00, 27.00, 20, 1),
(320, 2, '[\"p-23.jpg\",\"p-11.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 269.00, 83.00, 20, 1),
(321, 5, '[\"p-28.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 86.00, 65.00, 20, 1),
(322, 3, '[\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 183.00, 57.00, 20, 1),
(323, 3, '[\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 175.00, 20.00, 20, 1),
(324, 2, '[\"p-03.jpg\",\"p-13.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 271.00, 73.00, 20, 1),
(325, 4, '[\"p-26.jpg\",\"p-04.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 134.00, 43.00, 20, 1),
(326, 1, '[\"p-30.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 60.00, 80.00, 20, 1),
(327, 2, '[\"p-24.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 298.00, 30.00, 20, 1),
(328, 5, '[\"p-06.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 57.00, 18.00, 20, 1),
(329, 4, '[\"p-14.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 284.00, 86.00, 20, 1),
(330, 3, '[\"p-15.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 160.00, 26.00, 20, 1),
(331, 1, '[\"p-12.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 207.00, 57.00, 20, 1),
(332, 1, '[\"p-13.jpg\",\"p-15.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 63.00, 59.00, 20, 1),
(333, 3, '[\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 256.00, 72.00, 20, 1),
(334, 5, '[\"p-15.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 172.00, 69.00, 20, 1),
(335, 5, '[\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 259.00, 46.00, 20, 1),
(336, 2, '[\"p-30.jpg\",\"p-10.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 138.00, 64.00, 20, 1),
(337, 4, '[\"p-14.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 116.00, 84.00, 20, 1),
(338, 3, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 264.00, 25.00, 20, 1),
(339, 5, '[\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 180.00, 85.00, 20, 1);
INSERT INTO `products` (`product_id`, `category_id`, `image`, `name`, `description`, `price`, `discount`, `quantity`, `available`) VALUES
(340, 1, '[\"p-15.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 58.00, 47.00, 20, 1),
(341, 1, '[\"p-16.jpg\",\"p-28.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 145.00, 35.00, 20, 1),
(342, 4, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 297.00, 25.00, 20, 1),
(343, 2, '[\"p-11.jpg\",\"p-12.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 107.00, 61.00, 20, 1),
(344, 1, '[\"p-26.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 269.00, 77.00, 20, 1),
(345, 3, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 284.00, 76.00, 20, 1),
(346, 3, '[\"p-17.jpg\",\"p-10.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 206.00, 69.00, 20, 1),
(347, 2, '[\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 197.00, 64.00, 20, 1),
(348, 4, '[\"p-01.jpg\",\"p-06.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 64.00, 61.00, 20, 1),
(349, 1, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 256.00, 38.00, 20, 1),
(350, 2, '[\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 71.00, 61.00, 20, 1),
(351, 3, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 111.00, 12.00, 20, 1),
(352, 2, '[\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 291.00, 88.00, 20, 1),
(353, 2, '[\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 275.00, 32.00, 20, 1),
(354, 5, '[\"p-18.jpg\",\"p-10.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 65.00, 10.00, 20, 1),
(355, 5, '[\"p-13.jpg\",\"p-21.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 118.00, 74.00, 20, 1),
(356, 3, '[\"p-14.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 127.00, 38.00, 20, 1),
(357, 4, '[\"p-12.jpg\",\"p-27.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 221.00, 35.00, 20, 1),
(358, 4, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 114.00, 73.00, 20, 1),
(359, 3, '[\"p-25.jpg\",\"p-07.jpg\",\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 172.00, 83.00, 20, 1),
(360, 2, '[\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 194.00, 30.00, 20, 1),
(361, 3, '[\"p-19.jpg\",\"p-10.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 161.00, 90.00, 20, 1),
(362, 1, '[\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 113.00, 64.00, 20, 1),
(363, 3, '[\"p-19.jpg\",\"p-25.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 116.00, 23.00, 20, 1),
(364, 2, '[\"p-27.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 226.00, 49.00, 20, 1),
(365, 2, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 285.00, 41.00, 20, 1),
(366, 5, '[\"p-22.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 181.00, 18.00, 20, 1),
(367, 5, '[\"p-10.jpg\",\"p-15.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 173.00, 38.00, 20, 1),
(368, 5, '[\"p-16.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 149.00, 61.00, 20, 1),
(369, 5, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 288.00, 46.00, 20, 1),
(370, 5, '[\"p-16.jpg\",\"p-24.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 58.00, 43.00, 20, 1),
(371, 4, '[\"p-09.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 279.00, 32.00, 20, 1),
(372, 2, '[\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 229.00, 44.00, 20, 1),
(373, 5, '[\"p-11.jpg\",\"p-24.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 161.00, 42.00, 20, 1),
(374, 1, '[\"p-04.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 283.00, 62.00, 20, 1),
(375, 5, '[\"p-24.jpg\",\"p-12.jpg\",\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 234.00, 15.00, 20, 1),
(376, 5, '[\"p-29.jpg\",\"p-10.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 136.00, 82.00, 20, 1),
(377, 2, '[\"p-30.jpg\",\"p-07.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 118.00, 51.00, 20, 1),
(378, 3, '[\"p-14.jpg\",\"p-13.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 256.00, 25.00, 20, 1),
(379, 3, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 58.00, 42.00, 20, 1),
(380, 2, '[\"p-12.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 159.00, 20.00, 20, 1),
(381, 3, '[\"p-10.jpg\",\"p-19.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 240.00, 49.00, 20, 1),
(382, 4, '[\"p-24.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 160.00, 42.00, 20, 1),
(383, 1, '[\"p-10.jpg\",\"p-08.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 137.00, 82.00, 20, 1),
(384, 1, '[\"p-10.jpg\",\"p-17.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 144.00, 56.00, 20, 1),
(385, 5, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 161.00, 51.00, 20, 1),
(386, 4, '[\"p-05.jpg\",\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 125.00, 84.00, 20, 1),
(387, 1, '[\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 119.00, 56.00, 20, 1),
(388, 5, '[\"p-04.jpg\",\"p-06.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 206.00, 41.00, 20, 1),
(389, 5, '[\"p-10.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 70.00, 44.00, 20, 1),
(390, 3, '[\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 206.00, 50.00, 20, 1),
(391, 5, '[\"p-13.jpg\",\"p-13.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 291.00, 57.00, 20, 1),
(392, 5, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 133.00, 52.00, 20, 1),
(393, 5, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 265.00, 20.00, 20, 1),
(394, 1, '[\"p-12.jpg\",\"p-12.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 115.00, 44.00, 20, 1),
(395, 2, '[\"p-02.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 161.00, 56.00, 20, 1),
(396, 5, '[\"p-02.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 271.00, 56.00, 20, 1),
(397, 1, '[\"p-10.jpg\",\"p-10.jpg\",\"p-23.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 223.00, 70.00, 20, 1),
(398, 5, '[\"p-12.jpg\",\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 155.00, 21.00, 20, 1),
(399, 4, '[\"p-02.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 109.00, 64.00, 20, 1),
(400, 2, '[\"p-16.jpg\",\"p-09.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 131.00, 62.00, 20, 1),
(401, 2, '[\"p-21.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 107.00, 52.00, 20, 1),
(402, 1, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 214.00, 79.00, 20, 1),
(403, 2, '[\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 215.00, 54.00, 20, 1),
(404, 4, '[\"p-20.jpg\",\"p-02.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 293.00, 45.00, 20, 1),
(405, 5, '[\"p-07.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 100.00, 19.00, 20, 1),
(406, 5, '[\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 66.00, 26.00, 20, 1),
(407, 3, '[\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 229.00, 67.00, 20, 1),
(408, 4, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 266.00, 47.00, 20, 1),
(409, 4, '[\"p-16.jpg\",\"p-16.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 89.00, 60.00, 20, 1),
(410, 3, '[\"p-08.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 123.00, 67.00, 20, 1),
(411, 3, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 233.00, 75.00, 20, 1),
(412, 5, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 171.00, 57.00, 20, 1),
(413, 5, '[\"p-22.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 121.00, 70.00, 20, 1),
(414, 1, '[\"p-19.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 280.00, 18.00, 20, 1),
(415, 1, '[\"p-10.jpg\",\"p-13.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 278.00, 24.00, 20, 1),
(416, 1, '[\"p-20.jpg\",\"p-08.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 214.00, 78.00, 20, 1),
(417, 2, '[\"p-19.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 127.00, 40.00, 20, 1),
(418, 5, '[\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 161.00, 29.00, 20, 1),
(419, 2, '[\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 223.00, 26.00, 20, 1),
(420, 5, '[\"p-18.jpg\",\"p-14.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 64.00, 90.00, 20, 1),
(421, 5, '[\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 210.00, 89.00, 20, 1),
(422, 5, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 286.00, 52.00, 20, 1),
(423, 5, '[\"p-11.jpg\",\"p-21.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 208.00, 52.00, 20, 1),
(424, 1, '[\"p-30.jpg\",\"p-03.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 132.00, 18.00, 20, 1),
(425, 4, '[\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 114.00, 48.00, 20, 1),
(426, 2, '[\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 64.00, 80.00, 20, 1),
(427, 4, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 259.00, 31.00, 20, 1),
(428, 4, '[\"p-06.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 250.00, 45.00, 20, 1),
(429, 3, '[\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 227.00, 34.00, 20, 1),
(430, 4, '[\"p-25.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 164.00, 19.00, 20, 1),
(431, 4, '[\"p-08.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 209.00, 32.00, 20, 1),
(432, 5, '[\"p-15.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 179.00, 73.00, 20, 1),
(433, 2, '[\"p-18.jpg\",\"p-10.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 69.00, 11.00, 20, 1),
(434, 4, '[\"p-12.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 109.00, 78.00, 20, 1),
(435, 5, '[\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 127.00, 20.00, 20, 1),
(436, 2, '[\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 271.00, 63.00, 20, 1),
(437, 4, '[\"p-29.jpg\",\"p-27.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 120.00, 73.00, 20, 1),
(438, 4, '[\"p-03.jpg\",\"p-10.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 263.00, 83.00, 20, 1),
(439, 5, '[\"p-29.jpg\",\"p-22.jpg\",\"p-24.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 88.00, 39.00, 20, 1),
(440, 1, '[\"p-10.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 170.00, 31.00, 20, 1),
(441, 4, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 154.00, 64.00, 20, 1),
(442, 1, '[\"p-12.jpg\",\"p-02.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 132.00, 77.00, 20, 1),
(443, 2, '[\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 244.00, 18.00, 20, 1),
(444, 1, '[\"p-11.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 75.00, 65.00, 20, 1),
(445, 4, '[\"p-17.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 55.00, 78.00, 20, 1),
(446, 5, '[\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 114.00, 65.00, 20, 1),
(447, 5, '[\"p-11.jpg\",\"p-04.jpg\",\"p-28.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 264.00, 64.00, 20, 1),
(448, 1, '[\"p-03.jpg\",\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 82.00, 38.00, 20, 1),
(449, 3, '[\"p-09.jpg\",\"p-16.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 119.00, 64.00, 20, 1),
(450, 5, '[\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 105.00, 66.00, 20, 1),
(451, 3, '[\"p-11.jpg\",\"p-06.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 86.00, 57.00, 20, 1),
(452, 1, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 149.00, 29.00, 20, 1),
(453, 5, '[\"p-08.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 75.00, 57.00, 20, 1),
(454, 1, '[\"p-27.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 68.00, 26.00, 20, 1),
(455, 5, '[\"p-29.jpg\",\"p-14.jpg\",\"p-30.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 226.00, 40.00, 20, 1),
(456, 2, '[\"p-27.jpg\",\"p-10.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 145.00, 23.00, 20, 1),
(457, 4, '[\"p-05.jpg\",\"p-15.jpg\",\"p-27.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 135.00, 53.00, 20, 1),
(458, 2, '[\"p-12.jpg\",\"p-01.jpg\",\"p-14.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 142.00, 17.00, 20, 1),
(459, 4, '[\"p-15.jpg\",\"p-19.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 275.00, 83.00, 20, 1),
(460, 4, '[\"p-11.jpg\",\"p-26.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 57.00, 28.00, 20, 1),
(461, 3, '[\"p-02.jpg\",\"p-10.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 156.00, 88.00, 20, 1),
(462, 3, '[\"p-06.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 180.00, 14.00, 20, 1),
(463, 3, '[\"p-01.jpg\",\"p-28.jpg\",\"p-25.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 260.00, 35.00, 20, 1),
(464, 3, '[\"p-13.jpg\",\"p-27.jpg\",\"p-22.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 300.00, 73.00, 20, 1),
(465, 2, '[\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 212.00, 32.00, 20, 1),
(466, 1, '[\"p-19.jpg\",\"p-02.jpg\",\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 173.00, 28.00, 20, 1),
(467, 1, '[\"p-12.jpg\",\"p-16.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 65.00, 32.00, 20, 1),
(468, 4, '[\"p-22.jpg\",\"p-18.jpg\",\"p-18.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 223.00, 41.00, 20, 1),
(469, 2, '[\"p-05.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 295.00, 71.00, 20, 1),
(470, 4, '[\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 114.00, 59.00, 20, 1),
(471, 5, '[\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 213.00, 50.00, 20, 1),
(472, 1, '[\"p-05.jpg\",\"p-15.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 261.00, 69.00, 20, 1),
(473, 2, '[\"p-06.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 141.00, 79.00, 20, 1),
(474, 4, '[\"p-11.jpg\",\"p-20.jpg\",\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 271.00, 22.00, 20, 1),
(475, 3, '[\"p-06.jpg\",\"p-02.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 282.00, 77.00, 20, 1),
(476, 1, '[\"p-14.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 194.00, 67.00, 20, 1),
(477, 2, '[\"p-11.jpg\",\"p-26.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 184.00, 12.00, 20, 1),
(478, 3, '[\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 172.00, 90.00, 20, 1),
(479, 4, '[\"p-14.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 55.00, 66.00, 20, 1),
(480, 2, '[\"p-27.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 254.00, 66.00, 20, 1),
(481, 5, '[\"p-04.jpg\",\"p-19.jpg\",\"p-13.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 121.00, 51.00, 20, 1),
(482, 1, '[\"p-22.jpg\",\"p-10.jpg\",\"p-07.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 226.00, 32.00, 20, 1),
(483, 1, '[\"p-09.jpg\",\"p-03.jpg\",\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 121.00, 18.00, 20, 1),
(484, 4, '[\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 114.00, 75.00, 20, 1),
(485, 2, '[\"p-12.jpg\",\"p-30.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 294.00, 26.00, 20, 1),
(486, 5, '[\"p-30.jpg\",\"p-30.jpg\",\"p-01.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 185.00, 31.00, 20, 1),
(487, 1, '[\"p-05.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 71.00, 16.00, 20, 1),
(488, 2, '[\"p-25.jpg\",\"p-04.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 286.00, 37.00, 20, 1),
(489, 5, '[\"p-30.jpg\",\"p-05.jpg\",\"p-19.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 206.00, 87.00, 20, 1),
(490, 4, '[\"p-21.jpg\",\"p-21.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 149.00, 89.00, 20, 1),
(491, 2, '[\"p-13.jpg\",\"p-06.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 52.00, 32.00, 20, 1),
(492, 1, '[\"p-13.jpg\",\"p-14.jpg\",\"p-09.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 167.00, 69.00, 20, 1),
(493, 1, '[\"p-17.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 88.00, 77.00, 20, 1),
(494, 1, '[\"p-20.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 287.00, 87.00, 20, 1),
(495, 1, '[\"p-12.jpg\",\"p-18.jpg\",\"p-08.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 270.00, 34.00, 20, 1),
(496, 2, '[\"p-03.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 175.00, 52.00, 20, 1),
(497, 3, '[\"p-03.jpg\",\"p-11.jpg\",\"p-12.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 268.00, 78.00, 20, 1),
(498, 1, '[\"p-08.jpg\",\"p-29.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 253.00, 18.00, 20, 1),
(499, 1, '[\"p-28.jpg\",\"p-11.jpg\"]', 'National Fresh Fruit', 'All products are carefully selected to ensure food safety.', 59.00, 39.00, 20, 1);

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
  `shipping_price` decimal(10,2) NOT NULL,
  `shipping_time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `shipping`
--

INSERT INTO `shipping` (`shipping_id`, `shipping_name`, `shipping_price`, `shipping_time`) VALUES
(15, 'DHL', 30.00, 2),
(16, 'qwe', 123.00, 345);

-- --------------------------------------------------------

--
-- Tabellstruktur `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `username` varchar(25) NOT NULL,
  `fname` varchar(25) NOT NULL,
  `lname` varchar(25) NOT NULL,
  `phone` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `staff`
--

INSERT INTO `staff` (`staff_id`, `username`, `fname`, `lname`, `phone`, `email`, `password`) VALUES
(3, 'osamafaroun', 'osama', 'faroun', 234234, 'osamafaroun7@gmail.com', '$2a$10$0a2KOYWk02tIrVWOzdA1MObV3S5HHhb06TdFAU.XmDEp9OLa6qmJy');

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
  `free_shipping` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `street` varchar(50) NOT NULL,
  `city` varchar(20) NOT NULL,
  `zip` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `store_info`
--

INSERT INTO `store_info` (`id`, `opening_day`, `closing_day`, `opening_weekend`, `closing_weekend`, `tax_percentage`, `free_shipping`, `phone`, `email`, `street`, `city`, `zip`) VALUES
(2, '09:00:00', '22:00:00', '10:00:00', '16:00:00', 25.00, 700, ' 123456660', 'ahmad996cyc@gmail.com', 'Norrbytvärgata 32', 'Borås', '312 40');

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
-- Tabellstruktur `top_products`
--

CREATE TABLE `top_products` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `top_products`
--

INSERT INTO `top_products` (`id`, `product_id`) VALUES
(3, 1),
(4, 2),
(5, 3),
(1, 47),
(2, 47);

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

-- --------------------------------------------------------

--
-- Tabellstruktur `units`
--

CREATE TABLE `units` (
  `unit_id` int(11) NOT NULL,
  `unit_name` varchar(50) NOT NULL
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
-- Index för tabell `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`);

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
-- Index för tabell `top_products`
--
ALTER TABLE `top_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index för tabell `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Index för tabell `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`unit_id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT för tabell `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT för tabell `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=226;

--
-- AUTO_INCREMENT för tabell `order_items`
--
ALTER TABLE `order_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=399;

--
-- AUTO_INCREMENT för tabell `order_type`
--
ALTER TABLE `order_type`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT för tabell `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=501;

--
-- AUTO_INCREMENT för tabell `product_review`
--
ALTER TABLE `product_review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `reset_password`
--
ALTER TABLE `reset_password`
  MODIFY `reset_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT för tabell `shipping`
--
ALTER TABLE `shipping`
  MODIFY `shipping_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT för tabell `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- AUTO_INCREMENT för tabell `top_products`
--
ALTER TABLE `top_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT för tabell `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `units`
--
ALTER TABLE `units`
  MODIFY `unit_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `order_type` (`type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipping_id`) REFERENCES `shipping` (`shipping_id`);

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
-- Restriktioner för tabell `top_products`
--
ALTER TABLE `top_products`
  ADD CONSTRAINT `top_products_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

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
