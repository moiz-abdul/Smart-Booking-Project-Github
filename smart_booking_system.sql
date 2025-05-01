-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 01, 2025 at 07:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_booking_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `add_services`
--

CREATE TABLE `add_services` (
  `id` int(11) NOT NULL,
  `service_title` varchar(255) NOT NULL,
  `provider_name` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `duration_minutes` int(11) NOT NULL,
  `regular_price` decimal(10,2) NOT NULL,
  `member_price` decimal(10,2) NOT NULL,
  `available_days` varchar(255) NOT NULL,
  `slot_1_time` time DEFAULT NULL,
  `slot_2_time` time DEFAULT NULL,
  `slot_3_time` time DEFAULT NULL,
  `location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `add_services`
--

INSERT INTO `add_services` (`id`, `service_title`, `provider_name`, `user_id`, `category_id`, `description`, `duration_minutes`, `regular_price`, `member_price`, `available_days`, `slot_1_time`, `slot_2_time`, `slot_3_time`, `location`) VALUES
(6, 'Consultations', 'moizzz', 7, 3, 'This is consultatiosn classes', 60, 45.00, 449.98, 'Monday,Thursday,Saturday,Sunday', '11:00:00', '19:00:00', '21:00:00', 'Habeeb Consultations');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `email`, `username`, `password`) VALUES
(1, 'admin@smartbookingsystem.com', 'admin_sbs', '_@dMin_$mArT#B00KinG');

-- --------------------------------------------------------

--
-- Table structure for table `bookingform`
--

CREATE TABLE `bookingform` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `service_id` int(11) NOT NULL,
  `service_name` varchar(150) NOT NULL,
  `service_category` varchar(100) NOT NULL,
  `duration_minutes` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `selected_available_day` varchar(20) NOT NULL,
  `selected_available_time_slot` varchar(20) NOT NULL,
  `pay_per_booking_price` decimal(10,2) NOT NULL,
  `membership_price` decimal(10,2) NOT NULL,
  `payment_type` enum('Pay Per Booking','Membership') NOT NULL,
  `location` varchar(200) NOT NULL,
  `special_instructions` text DEFAULT NULL,
  `is_status` enum('pending','confirm','cancel','completed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `categoryname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `categoryname`) VALUES
(6, 'Beauty & Wellness'),
(4, 'Co-working Spaces'),
(3, 'Consultations'),
(5, 'Educational Services'),
(7, 'Event Bookings'),
(2, 'Fitness Classes'),
(1, 'Medical Appointments');

-- --------------------------------------------------------

--
-- Table structure for table `paymentform`
--

CREATE TABLE `paymentform` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_subscribe` tinyint(1) NOT NULL,
  `service_id` int(11) NOT NULL,
  `cardholder_name` varchar(100) NOT NULL,
  `card_number` varchar(20) NOT NULL,
  `expiry_date` varchar(7) NOT NULL,
  `cvv_code` varchar(5) NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `provider_profile_info`
--

CREATE TABLE `provider_profile_info` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provider_profile_info`
--

INSERT INTO `provider_profile_info` (`id`, `user_id`, `business_name`, `email`, `phone`, `address`, `description`) VALUES
(1, 7, 'Education Club', 'eduaplha@code.com', '03161599785', 'chicago H765, A Block', 'I have done Alhamd u Lillah '),
(2, 9, 'Fitness Club', 'abdullahmouizz@gmail.com', '03161599227', 'H # 3/1-C , str # 78 , G7/1 Islamabad', 'blha blahfg gfg fsj fadfgfg ');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `role` enum('customer','provider') NOT NULL,
  `is_subscribe` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `phoneNumber`, `role`, `is_subscribe`) VALUES
(1, 'abdul', 'abdullahmouizz@gmail.com', '$2b$10$j5QcCtpxetKDp8siBduxa.A4q.lEiOlzOF7dSC9wBGpt.obtAXRV2', '03337564114', 'customer', 0),
(2, 'moizabdul', 'moizwork999@gmail.com', '$2b$10$7Htz0.d/i/kt1ExWNkrbYef9hVu9NM2ejKps2VyJVQ1hW1M.zdC9u', '03337564114', 'provider', 0),
(4, 'abdulmoiz', 'alpha@gmial.com', '$2b$10$sZU4vKbz11ros8/VCLDwkeKNitqe6KjpAv9TtmL7Nyf5u9x9d1LG6', '0322 1877227', 'customer', 0),
(5, 'alii', 'aplhacode@gmail.com', 'qasw1234', '03821629227', 'customer', 0),
(7, 'moizzz', 'moizayy@gmail.com', 'asdf1212', '03161599227', 'provider', 0),
(8, 'mariaD', 'codeninja@gmail.com', 'qaz123', '0318 1834227', 'customer', 0),
(9, 'mominkhan', 'aerodb@gmail.com', 'wsx456', '03161537777', 'provider', 0),
(10, 'tahirzaman', 'tahir@gmail.com', 'edc789', '03161532326', 'provider', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `add_services`
--
ALTER TABLE `add_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `bookingform`
--
ALTER TABLE `bookingform`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categoryname` (`categoryname`);

--
-- Indexes for table `paymentform`
--
ALTER TABLE `paymentform`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `provider_profile_info`
--
ALTER TABLE `provider_profile_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `add_services`
--
ALTER TABLE `add_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bookingform`
--
ALTER TABLE `bookingform`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `paymentform`
--
ALTER TABLE `paymentform`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `provider_profile_info`
--
ALTER TABLE `provider_profile_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `add_services`
--
ALTER TABLE `add_services`
  ADD CONSTRAINT `add_services_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `add_services_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

--
-- Constraints for table `bookingform`
--
ALTER TABLE `bookingform`
  ADD CONSTRAINT `bookingform_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookingform_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `add_services` (`id`);

--
-- Constraints for table `paymentform`
--
ALTER TABLE `paymentform`
  ADD CONSTRAINT `paymentform_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookingform` (`id`),
  ADD CONSTRAINT `paymentform_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `paymentform_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `add_services` (`id`);

--
-- Constraints for table `provider_profile_info`
--
ALTER TABLE `provider_profile_info`
  ADD CONSTRAINT `provider_profile_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
