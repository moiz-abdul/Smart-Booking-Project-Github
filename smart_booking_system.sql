-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2025 at 08:27 PM
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
(9, 'Yoga Classes', 'moizzz', 7, 2, 'For Beginner Friendly Yoga Classes', 90, 40.00, 500.00, 'Monday,Tuesday,Wednesday,Thursday,Friday,Sunday,Saturday', '07:00:00', '09:00:00', '10:30:00', 'Chicago Fitness Studio'),
(11, 'Comprehensive Health Checkup', 'Jason', 2, 1, 'Full-body examination with lab tests', 60, 200.00, 180.00, 'Monday,Wednesday,Friday', '08:00:00', '11:00:00', '14:00:00', 'Jason Medical Clinic'),
(12, 'Corporate Stress Relief', 'Jason', 2, 1, 'Personalized diet plans', 45, 120.00, 100.00, 'Tuesday,Thursday', '09:30:00', '13:30:00', NULL, 'Virtual/Clinic'),
(13, 'Therapeutic Yoga', 'Jason', 2, 2, 'For pain management and rehabilitation', 60, 80.00, 70.00, 'Monday,Wednesday,Friday', '07:00:00', '17:00:00', NULL, 'Wellness Center'),
(15, 'Social Media Kit', 'Jacob', 7, 3, 'Post templates + story designs', 90, 300.00, 250.00, 'Tuesday,Thursday', '11:00:00', '15:00:00', NULL, 'Virtual'),
(16, 'Product Photography', 'Jacob', 7, 7, 'E-commerce ready images', 180, 400.00, 350.00, 'Friday,Saturday', '09:00:00', '13:00:00', NULL, 'Studio/On-location'),
(17, 'Signature Gold Facial', 'Sumeera', 9, 6, 'Luxury treatment with 24k gold', 90, 150.00, 130.00, 'Tuesday,Thursday,Saturday', '10:00:00', '14:00:00', '16:00:00', 'Beauty Studio'),
(18, 'Acne Clear Treatment', 'Sumeera', 9, 6, 'Medical-grade acne solution', 75, 120.00, 100.00, 'Monday,Wednesday', '11:00:00', '15:00:00', NULL, 'Beauty Studio'),
(19, 'Detox Body Wrap', 'Sumeera', 9, 6, 'Full-body detoxification', 120, 180.00, 160.00, 'Friday,Sunday', '12:00:00', '15:00:00', NULL, 'Spa Suite'),
(20, 'Sleep Therapy', 'Mia Chen', 17, 1, 'Personalized 4-week program combining cognitive behavioral techniques and relaxation exercises', 60, 90.00, 70.00, 'Monday,Wednesday,Friday', '09:00:00', NULL, NULL, 'Wellness Studio'),
(21, 'Corporate Stress Relief', 'Mia Chen', 17, 1, 'Customized workplace stress reduction sessions including breathwork', 45, 50.00, 300.00, 'Tuesday,Thursday', '10:00:00', '14:00:00', NULL, 'Virtual'),
(22, 'Premium Logo Package', 'Aisha Patel', 18, 3, 'Complete branding solution with 3 logo concepts and style guide', 120, 300.00, 250.00, 'Monday,Wednesday', '10:00:00', '13:00:00', NULL, 'Design Studio'),
(23, 'Brand Identity Workshop', 'Aisha Patel', 18, 3, 'Half-day intensive to define your brand voice and visual identity', 240, 500.00, 400.00, 'Friday', '09:00:00', NULL, NULL, 'Virtual');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `membership_type` enum('Monthly','Yearly') DEFAULT NULL,
  `membership_start_time` datetime DEFAULT NULL,
  `membership_end_time` datetime DEFAULT NULL,
  `monthly_membership_fee` decimal(10,2) DEFAULT NULL,
  `yearly_membership_fee` decimal(10,2) DEFAULT NULL,
  `cancelled_by` enum('customer','provider') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookingform`
--

INSERT INTO `bookingform` (`id`, `user_id`, `customer_name`, `customer_email`, `customer_phone`, `service_id`, `service_name`, `service_category`, `duration_minutes`, `start_time`, `end_time`, `selected_available_day`, `selected_available_time_slot`, `pay_per_booking_price`, `membership_price`, `payment_type`, `location`, `special_instructions`, `is_status`, `created_at`, `membership_type`, `membership_start_time`, `membership_end_time`, `monthly_membership_fee`, `yearly_membership_fee`, `cancelled_by`) VALUES
(42, 12, 'Emma Wilson', 'EmmaWilson@gmail.com', '447700123456', 11, 'Comprehensive Health Checkup', 'Medical Appointments', 60, '08:00:00', '09:00:00', 'Monday', '08:00:00', 200.00, 180.00, 'Pay Per Booking', 'Jason Medical Clinic', 'Annual physical', 'completed', '2025-05-24 00:40:16', NULL, NULL, NULL, NULL, NULL, NULL),
(43, 13, 'Olivia Taylor', 'OliviaTaylor@outlook.com', '447701234567', 12, 'Nutrition Counseling', 'Medical Appointments', 45, '13:30:00', '14:15:00', 'Tuesday', '13:30:00', 120.00, 100.00, 'Pay Per Booking', 'Virtual', 'Weight management', 'confirm', '2025-05-24 00:40:16', 'Monthly', '2025-05-24 05:40:16', '2025-06-24 05:40:16', 100.00, 1200.00, NULL),
(44, 14, 'Sophia Clark', 'SophiaClark@yahoo.com', '447712345678', 13, 'Therapeutic Yoga', 'Fitness Classes', 60, '07:00:00', '08:00:00', 'Friday', '07:00:00', 80.00, 70.00, 'Pay Per Booking', 'Wellness Center', 'Back pain relief', 'completed', '2025-05-24 00:40:16', NULL, NULL, NULL, NULL, NULL, NULL),
(46, 13, 'Olivia Taylor', 'OliviaTaylor@outlook.com', '447701234567', 17, 'Signature Gold Facial', 'Beauty & Wellness', 90, '10:00:00', '11:30:00', 'Friday', '10:00:00', 150.00, 130.00, 'Pay Per Booking', 'Beauty Studio', 'Special occasion', 'completed', '2025-05-24 00:43:13', NULL, NULL, NULL, NULL, NULL, NULL),
(47, 14, 'Sophia Clark', 'SophiaClark@yahoo.com', '447712345678', 18, 'Acne Clear Treatment', 'Beauty & Wellness', 75, '11:00:00', '12:15:00', 'Monday', '11:00:00', 120.00, 100.00, 'Membership', 'Beauty Studio', 'Teenage acne', 'completed', '2025-05-24 00:43:13', 'Monthly', '2025-05-24 05:43:13', '2025-06-24 05:43:13', 100.00, 1200.00, NULL),
(48, 15, 'Noah Roberts', 'NoahRoberts@gmail.com', '447723456789', 19, 'Detox Body Wrap', 'Beauty & Wellness', 120, '12:00:00', '14:00:00', 'Sunday', '12:00:00', 180.00, 160.00, 'Pay Per Booking', 'Spa Suite', 'Post-workout recovery', 'completed', '2025-05-24 00:43:13', NULL, NULL, NULL, NULL, NULL, NULL),
(49, 16, 'Liam Johnson', 'LiamJohnson@outlook.com', '447734567890', 13, 'Therapeutic Yoga', 'Fitness Classes', 60, '17:00:00', '18:00:00', 'Tuesday', '17:00:00', 80.00, 70.00, 'Pay Per Booking', 'Wellness Center', 'Neck pain', 'confirm', '2025-05-24 00:43:13', NULL, NULL, NULL, NULL, NULL, NULL),
(52, 13, 'Olivia Taylor', 'OliviaTaylor@outlook.com', '447701234567', 15, 'Social Media Kit', 'Consultations', 90, '11:00:00', '12:30:00', 'Thursday', '11:00:00', 300.00, 250.00, 'Membership', 'Virtual', 'Instagram content for boutique', 'completed', '2025-05-24 00:48:39', 'Yearly', '2025-05-24 05:48:39', '2026-06-24 05:48:39', 250.00, 3000.00, NULL),
(53, 15, 'Noah Roberts', 'NoahRoberts@gmail.com', '447723456789', 16, 'Product Photography', 'Event Bookings', 180, '09:00:00', '12:00:00', 'Saturday', '09:00:00', 400.00, 350.00, 'Pay Per Booking', 'Studio', 'E-commerce product shots', 'completed', '2025-05-24 00:50:17', NULL, NULL, NULL, NULL, NULL, NULL),
(55, 13, 'Olivia Taylor', 'OliviaTaylor@outlook.com', '447701234567', 15, 'Social Media Kit', 'Consultations', 90, '11:00:00', '12:30:00', 'Thursday', '11:00:00', 300.00, 250.00, 'Membership', 'Virtual', 'Monthly content for fashion boutique', 'confirm', '2025-05-24 00:54:04', 'Monthly', '2025-05-24 05:54:04', '2025-06-24 05:54:04', 250.00, 3000.00, NULL),
(56, 15, 'Noah Roberts', 'NoahRoberts@gmail.com', '447723456789', 16, 'Product Photography', 'Event Bookings', 180, '09:00:00', '12:00:00', 'Saturday', '09:00:00', 400.00, 350.00, 'Pay Per Booking', 'Studio', 'Jewelry collection for e-commerce', 'completed', '2025-05-24 00:54:14', NULL, NULL, NULL, NULL, NULL, NULL),
(57, 16, 'Liam Johnson', 'LiamJohnson@outlook.com', '447734567890', 15, 'Social Media Kit', 'Consultations', 90, '15:00:00', '16:30:00', 'Tuesday', '15:00:00', 300.00, 250.00, 'Pay Per Booking', 'Virtual', 'One-time campaign for product launch', 'pending', '2025-05-24 00:54:24', NULL, NULL, NULL, NULL, NULL, NULL),
(58, 12, 'Emma Wilson', 'EmmaWilson@gmail.com', '447700123456', 16, 'Product Photography', 'Event Bookings', 180, '10:00:00', '13:00:00', 'Saturday', '10:00:00', 400.00, 350.00, 'Membership', 'Studio', 'Food photography for bakery website', 'completed', '2025-05-24 00:54:38', 'Yearly', '2025-05-24 05:54:38', '2026-05-24 05:54:38', 350.00, 4200.00, NULL),
(59, 14, 'SophiaC', 'SophiaClark@yahoo.com', '447712345678', 18, 'Acne Clear Treatment', 'Beauty & Wellness', 75, '15:00:00', '16:15:00', 'Monday', '15:00:00', 120.00, 100.00, 'Membership', 'Beauty Studio', NULL, 'completed', '2025-05-24 01:13:43', 'Monthly', NULL, NULL, NULL, NULL, NULL),
(61, 17, 'Emma Wilson', 'EmmaWilson@gmail.com', '447700123456', 20, 'Sleep Therapy', 'Wellness', 60, '09:00:00', '10:00:00', 'Wednesday', '09:00:00', 90.00, 70.00, 'Membership', 'Wellness Studio', 'Need help with shift work insomnia', 'confirm', '2025-05-24 01:31:05', 'Monthly', '2025-05-24 06:31:05', '2025-06-24 06:31:05', 70.00, 840.00, NULL),
(62, 17, 'Noah Roberts', 'NoahRoberts@gmail.com', '447723456789', 21, 'Corporate Stress Relief', 'Wellness', 45, '10:00:00', '10:45:00', 'Tuesday', '10:00:00', 120.00, 95.00, 'Pay Per Booking', 'Virtual', 'Team of 12 employees attending', 'completed', '2025-05-24 01:31:18', NULL, NULL, NULL, NULL, NULL, NULL),
(63, 18, 'Sophia Clark', 'SophiaClark@yahoo.com', '447712345678', 22, 'Premium Logo Package', 'Design', 120, '10:00:00', '12:00:00', 'Wednesday', '10:00:00', 300.00, 250.00, 'Pay Per Booking', 'Design Studio', 'Minimalist design for vegan skincare line', 'completed', '2025-05-24 01:31:28', NULL, NULL, NULL, NULL, NULL, NULL),
(64, 18, 'Liam Johnson', 'LiamJohnson@outlook.com', '447734567890', 23, 'Brand Identity Workshop', 'Design', 240, '09:00:00', '13:00:00', 'Friday', '09:00:00', 500.00, 400.00, 'Membership', 'Virtual', 'Rebranding consulting firm - need Portuguese translator', 'completed', '2025-05-24 01:31:38', 'Yearly', '2025-05-24 06:31:38', '2026-05-24 06:31:38', 400.00, 4800.00, NULL),
(65, 17, 'Emma Wilson', 'EmmaWilson@gmail.com', '447700123456', 20, 'Sleep Therapy', 'Wellness', 60, '09:00:00', '10:00:00', 'Wednesday', '09:00:00', 90.00, 70.00, 'Membership', 'Wellness Studio', 'Need help with shift work insomnia', 'completed', '2025-05-24 01:38:39', 'Monthly', '2025-05-24 06:38:39', '2025-06-24 06:38:39', 70.00, 840.00, NULL),
(66, 17, 'Noah Roberts', 'NoahRoberts@gmail.com', '447723456789', 21, 'Corporate Stress Relief', 'Wellness', 45, '10:00:00', '10:45:00', 'Tuesday', '10:00:00', 120.00, 95.00, 'Pay Per Booking', 'Virtual', 'Team of 12 employees attending', 'completed', '2025-05-24 01:38:39', NULL, NULL, NULL, NULL, NULL, NULL),
(67, 18, 'Sophia Clark', 'SophiaClark@yahoo.com', '447712345678', 22, 'Premium Logo Package', 'Design', 120, '10:00:00', '12:00:00', 'Wednesday', '10:00:00', 300.00, 250.00, 'Pay Per Booking', 'Design Studio', 'Minimalist design for vegan skincare line', 'completed', '2025-05-24 01:38:39', NULL, NULL, NULL, NULL, NULL, NULL),
(68, 18, 'Liam Johnson', 'LiamJohnson@outlook.com', '447734567890', 23, 'Brand Identity Workshop', 'Design', 240, '09:00:00', '13:00:00', 'Friday', '09:00:00', 500.00, 400.00, 'Membership', 'Virtual', 'Rebranding consulting firm - need Portuguese translator', 'completed', '2025-05-24 01:38:39', 'Yearly', '2025-05-24 06:38:39', '2026-05-24 06:38:39', 400.00, 4800.00, NULL),
(69, 17, 'Emma Wilson', 'EmmaWilson@gmail.com', '447700123456', 20, 'Sleep Therapy', 'Wellness', 60, '14:00:00', '15:00:00', 'Friday', '14:00:00', 90.00, 70.00, 'Membership', 'Wellness Studio', 'Follow-up session for maintenance', 'completed', '2025-05-24 01:38:39', 'Monthly', '2025-05-24 06:38:39', '2025-06-24 06:38:39', 70.00, 840.00, NULL),
(70, 16, 'LiamJ', 'LiamJohnson@outlook.com', '447734567890', 21, 'Corporate Stress Relief', 'Medical Appointments', 45, '10:00:00', '10:45:00', 'Thursday', '10:00:00', 120.00, 95.00, 'Pay Per Booking', 'Virtual', NULL, 'completed', '2025-05-24 01:47:18', NULL, NULL, NULL, NULL, NULL, NULL),
(71, 13, 'OliviaT', 'OliviaTaylor@outlook.com', '447701234567', 21, 'Corporate Stress Relief', 'Medical Appointments', 45, '10:00:00', '10:45:00', 'Tuesday', '10:00:00', 120.00, 95.00, 'Pay Per Booking', 'Virtual', 'I kindly request an urgent medical appointment at your earliest availability due to a concerning health issue. Your prompt assistance would be deeply appreciated.', 'completed', '2025-05-24 07:43:18', 'Monthly', '2025-05-24 07:43:18', '2025-06-24 07:43:18', 95.00, 1140.00, 'customer'),
(72, 14, 'SophiaC', 'SophiaClark@yahoo.com', '447712345678', 15, 'Social Media Kit', 'Consultations', 90, '15:00:00', '16:30:00', 'Thursday', '15:00:00', 300.00, 250.00, 'Pay Per Booking', 'Virtual', 'Accept my booking ', 'completed', '2025-05-24 16:31:24', NULL, NULL, NULL, NULL, NULL, NULL),
(73, 13, 'OliviaT', 'OliviaTaylor@outlook.com', '447701234567', 22, 'Premium Logo Package', 'Consultations', 120, '10:00:00', '12:00:00', 'Wednesday', '10:00:00', 300.00, 250.00, 'Pay Per Booking', 'Design Studio', 'Book me please', 'pending', '2025-05-24 16:33:17', NULL, NULL, NULL, NULL, NULL, NULL),
(74, 15, 'NoahR', 'NoahRoberts@gmail.com', '447723456789', 21, 'Corporate Stress Relief', 'Medical Appointments', 45, '10:00:00', '10:45:00', 'Thursday', '10:00:00', 50.00, 300.00, 'Pay Per Booking', 'Virtual', NULL, 'pending', '2025-05-24 16:34:32', NULL, NULL, NULL, NULL, NULL, NULL),
(75, 15, 'NoahR', 'NoahRoberts@gmail.com', '447723456789', 16, 'Product Photography', 'Event Bookings', 180, '13:00:00', '16:00:00', 'Friday', '13:00:00', 400.00, 350.00, 'Membership', 'Studio/On-location', NULL, 'pending', '2025-05-24 16:35:19', 'Monthly', '2025-05-24 16:35:19', '2025-06-24 16:35:19', 350.00, 4200.00, NULL),
(76, 15, 'NoahR', 'NoahRoberts@gmail.com', '447723456789', 12, 'Corporate Stress Relief', 'Medical Appointments', 45, '09:30:00', '10:15:00', 'Thursday', '09:30:00', 120.00, 100.00, 'Pay Per Booking', 'Virtual/Clinic', NULL, 'pending', '2025-05-24 16:37:04', NULL, NULL, NULL, NULL, NULL, NULL),
(77, 14, 'SophiaC', 'SophiaClark@yahoo.com', '447712345678', 18, 'Acne Clear Treatment', 'Beauty & Wellness', 75, '11:00:00', '12:15:00', 'Wednesday', '11:00:00', 120.00, 100.00, 'Membership', 'Beauty Studio', NULL, 'confirm', '2025-05-24 16:39:12', 'Monthly', NULL, NULL, NULL, NULL, NULL),
(78, 14, 'SophiaC', 'SophiaClark@yahoo.com', '447712345678', 17, 'Signature Gold Facial', 'Beauty & Wellness', 90, '10:00:00', '11:30:00', 'Saturday', '10:00:00', 150.00, 130.00, 'Pay Per Booking', 'Beauty Studio', NULL, 'confirm', '2025-05-24 16:40:22', NULL, NULL, NULL, NULL, NULL, NULL),
(79, 15, 'NoahR', 'NoahRoberts@gmail.com', '447723456789', 17, 'Signature Gold Facial', 'Beauty & Wellness', 90, '16:00:00', '17:30:00', 'Saturday', '16:00:00', 150.00, 130.00, 'Pay Per Booking', 'Beauty Studio', NULL, 'pending', '2025-05-24 16:41:11', NULL, NULL, NULL, NULL, NULL, NULL),
(80, 16, 'LiamJ', 'LiamJohnson@outlook.com', '447734567890', 17, 'Signature Gold Facial', 'Beauty & Wellness', 90, '14:00:00', '15:30:00', 'Tuesday', '14:00:00', 150.00, 130.00, 'Pay Per Booking', 'Beauty Studio', NULL, 'completed', '2025-05-24 16:42:00', NULL, NULL, NULL, NULL, NULL, NULL),
(81, 14, 'SophiaC', 'SophiaClark@yahoo.com', '447712345678', 19, 'Detox Body Wrap', 'Beauty & Wellness', 120, '12:00:00', '14:00:00', 'Friday', '12:00:00', 180.00, 160.00, 'Pay Per Booking', 'Spa Suite', NULL, 'pending', '2025-05-24 16:43:02', NULL, NULL, NULL, NULL, NULL, NULL),
(82, 15, 'NoahR', 'NoahRoberts@gmail.com', '447723456789', 16, 'Product Photography', 'Event Bookings', 180, '09:00:00', '12:00:00', 'Friday', '09:00:00', 400.00, 350.00, 'Membership', 'Studio/On-location', NULL, 'cancel', '2025-05-24 16:44:56', 'Monthly', NULL, NULL, NULL, NULL, 'customer'),
(83, 14, 'SophiaC', 'SophiaClark@yahoo.com', '447712345678', 16, 'Product Photography', 'Event Bookings', 180, '13:00:00', '16:00:00', 'Saturday', '13:00:00', 400.00, 350.00, 'Pay Per Booking', 'Studio/On-location', NULL, 'pending', '2025-05-24 16:45:47', NULL, NULL, NULL, NULL, NULL, NULL),
(84, 14, 'SophiaC', 'SophiaClark@yahoo.com', '447712345678', 20, 'Sleep Therapy', 'Medical Appointments', 60, '09:00:00', '10:00:00', 'Monday', '09:00:00', 90.00, 70.00, 'Pay Per Booking', 'Wellness Studio', NULL, 'pending', '2025-05-24 16:46:38', NULL, NULL, NULL, NULL, NULL, NULL),
(85, 13, 'OliviaT', 'OliviaTaylor@outlook.com', '447701234567', 20, 'Sleep Therapy', 'Medical Appointments', 60, '09:00:00', '10:00:00', 'Friday', '09:00:00', 90.00, 70.00, 'Pay Per Booking', 'Wellness Studio', NULL, 'cancel', '2025-05-24 16:47:23', NULL, NULL, NULL, NULL, NULL, 'provider'),
(86, 16, 'LiamJ', 'LiamJohnson@outlook.com', '447734567890', 18, 'Acne Clear Treatment', 'Beauty & Wellness', 75, '11:00:00', '12:15:00', 'Monday', '11:00:00', 120.00, 100.00, 'Membership', 'Beauty Studio', NULL, 'cancel', '2025-05-24 16:48:48', 'Yearly', '2025-05-24 16:48:48', '2026-05-24 16:48:48', 100.00, 1200.00, 'customer'),
(87, 15, 'NoahR', 'NoahRoberts@gmail.com', '447723456789', 18, 'Acne Clear Treatment', 'Beauty & Wellness', 75, '15:00:00', '16:15:00', 'Monday', '15:00:00', 120.00, 100.00, 'Pay Per Booking', 'Beauty Studio', NULL, 'completed', '2025-05-24 16:49:32', NULL, NULL, NULL, NULL, NULL, NULL),
(88, 14, 'SophiaC', 'SophiaClark@yahoo.com', '447712345678', 18, 'Acne Clear Treatment', 'Beauty & Wellness', 75, '15:00:00', '16:15:00', 'Wednesday', '15:00:00', 120.00, 100.00, 'Membership', 'Beauty Studio', NULL, 'cancel', '2025-05-24 16:50:21', 'Monthly', NULL, NULL, NULL, NULL, 'provider'),
(89, 14, 'SophiaC', 'SophiaClark@yahoo.com', '447712345678', 11, 'Comprehensive Health Checkup', 'Medical Appointments', 60, '08:00:00', '09:00:00', 'Monday', '08:00:00', 200.00, 180.00, 'Pay Per Booking', 'Jason Medical Clinic', NULL, 'confirm', '2025-05-24 16:51:28', NULL, NULL, NULL, NULL, NULL, NULL),
(90, 12, 'EmmaW', 'EmmaWilson@gmail.com', '447700123456', 11, 'Comprehensive Health Checkup', 'Medical Appointments', 60, '11:00:00', '12:00:00', 'Monday', '11:00:00', 200.00, 180.00, 'Membership', 'Jason Medical Clinic', NULL, 'cancel', '2025-05-24 16:52:23', 'Monthly', '2025-05-24 16:52:23', '2025-06-24 16:52:23', 180.00, 2160.00, 'customer'),
(91, 15, 'NoahR', 'NoahRoberts@gmail.com', '447723456789', 11, 'Comprehensive Health Checkup', 'Medical Appointments', 60, '14:00:00', '15:00:00', 'Monday', '14:00:00', 200.00, 180.00, 'Pay Per Booking', 'Jason Medical Clinic', NULL, 'completed', '2025-05-24 16:53:30', NULL, NULL, NULL, NULL, NULL, NULL),
(92, 16, 'LiamJ', 'LiamJohnson@outlook.com', '447734567890', 13, 'Therapeutic Yoga', 'Fitness Classes', 60, '07:00:00', '08:00:00', 'Monday', '07:00:00', 80.00, 70.00, 'Pay Per Booking', 'Wellness Center', NULL, 'completed', '2025-05-24 17:22:20', NULL, NULL, NULL, NULL, NULL, NULL),
(93, 15, 'NoahR', 'NoahRoberts@gmail.com', '447723456789', 13, 'Therapeutic Yoga', 'Fitness Classes', 60, '17:00:00', '18:00:00', 'Monday', '17:00:00', 80.00, 70.00, 'Pay Per Booking', 'Wellness Center', NULL, 'cancel', '2025-05-24 17:23:05', NULL, NULL, NULL, NULL, NULL, 'provider'),
(94, 14, 'SophiaC', 'SophiaClark@yahoo.com', '447712345678', 13, 'Therapeutic Yoga', 'Fitness Classes', 60, '07:00:00', '08:00:00', 'Wednesday', '07:00:00', 80.00, 70.00, 'Membership', 'Wellness Center', NULL, 'confirm', '2025-05-24 17:23:37', 'Yearly', '2025-05-24 17:23:37', '2026-05-24 17:23:37', 70.00, 840.00, NULL),
(95, 13, 'OliviaT', 'OliviaTaylor@outlook.com', '447701234567', 13, 'Therapeutic Yoga', 'Fitness Classes', 60, '17:00:00', '18:00:00', 'Wednesday', '17:00:00', 80.00, 70.00, 'Membership', 'Wellness Center', NULL, 'cancel', '2025-05-24 17:24:12', 'Yearly', '2025-05-24 17:24:12', '2026-05-24 17:24:12', 70.00, 840.00, 'customer'),
(96, 12, 'EmmaW', 'EmmaWilson@gmail.com', '447700123456', 13, 'Therapeutic Yoga', 'Fitness Classes', 60, '07:00:00', '08:00:00', 'Friday', '07:00:00', 80.00, 70.00, 'Membership', 'Wellness Center', 'Book me please', 'completed', '2025-05-24 17:25:08', 'Monthly', '2025-05-24 17:25:08', '2025-06-24 17:25:08', 70.00, 840.00, NULL);

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
-- Table structure for table `customer_reviews`
--

CREATE TABLE `customer_reviews` (
  `id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `review_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_reviews`
--

INSERT INTO `customer_reviews` (`id`, `service_id`, `booking_id`, `user_id`, `rating`, `review_text`, `created_at`) VALUES
(7, 16, 58, 12, 4, 'Very talented.', '2025-05-24 01:07:45'),
(8, 11, 42, 12, 4, 'Checked thoroughly.', '2025-05-24 01:08:01'),
(9, 15, 52, 13, 4, 'Awesome.', '2025-05-24 01:09:04'),
(10, 17, 46, 13, 5, 'Looking Beautifull.', '2025-05-24 01:09:28'),
(11, 13, 44, 14, 5, 'Feeling peacfull', '2025-05-24 01:10:30'),
(12, 19, 48, 15, 4, 'Feeling good.', '2025-05-24 01:11:45'),
(13, 16, 53, 15, 4, 'Good Qulaity.', '2025-05-24 01:11:58'),
(14, 18, 47, 14, 5, 'Professional', '2025-05-24 01:17:06'),
(15, 20, 61, 17, 5, 'Mia transformed my sleep! After just 3 sessions, I\'m falling asleep faster and staying asleep through my night shifts. Her CBT techniques are life-changing. The wellness studio has such a calming atmosphere too.', '2025-05-24 01:35:03'),
(16, 21, 62, 17, 4, 'Great virtual session for our team. The breathing exercises were particularly effective, though we wished it could have been longer. Reduced our meeting stress noticeably for weeks after.', '2025-05-24 01:35:14'),
(17, 22, 63, 18, 5, 'Aisha nailed our vegan skincare branding! Delivered 3 stunning logo concepts and the final files in multiple formats. The studio visit was professional yet creative. Worth every penny.', '2025-05-24 01:35:23'),
(18, 23, 64, 18, 3, 'Good foundational workshop, though the virtual format made collaboration tricky. Aisha provided solid brand strategy templates, but we expected more hands-on design work during the session itself.', '2025-05-24 01:35:32'),
(19, 20, 65, 17, 5, 'Mia transformed my sleep! After just 3 sessions, I\'m falling asleep faster. Her CBT techniques are life-changing.', '2025-05-24 01:38:39'),
(20, 21, 66, 17, 4, 'Great virtual session for our team. The breathing exercises were particularly effective.', '2025-05-24 01:38:39'),
(21, 22, 67, 18, 5, 'Aisha nailed our vegan skincare branding! Delivered 3 stunning logo concepts.', '2025-05-24 01:38:39'),
(22, 23, 68, 18, 3, 'Good foundational workshop, though the virtual format made collaboration tricky.', '2025-05-24 01:38:39'),
(23, 20, 69, 17, 5, 'Fantastic follow-up session. Mia adjusted techniques based on my progress reports.', '2025-05-24 01:38:39'),
(24, 20, NULL, 17, 5, 'As a nurse working night shifts, Mia\'s sleep therapy revolutionized my rest. The personalized circadian rhythm adjustments and relaxation audios she provided helped me sleep 6 uninterrupted hours during the day - something I hadn\'t achieved in 5 years of shift work.', '2025-05-24 01:41:13'),
(25, 21, NULL, 17, 4, 'Our sales team was burned out from Q4 pressures. Mia\'s 45-minute corporate session taught us practical breathwork techniques we now use before client calls. The only improvement would be customizing exercises for our open-plan office environment.', '2025-05-24 01:41:13'),
(26, 22, NULL, 18, 5, 'Aisha understood our vegan ethos instantly. The moodboard she created featuring organic shapes and earthy tones perfectly captured our brand. We received 3 exceptional logo options, and the final files included everything from social media kits to vector files for merchandise.', '2025-05-24 01:41:13'),
(27, 23, NULL, 18, 3, 'The brand strategy framework was comprehensive, but our international team struggled with the virtual whiteboard. The pre-workshop questionnaire was excellent though, and we\'re implementing Aisha\'s brand voice matrix across all our communications.', '2025-05-24 01:41:13'),
(28, 20, NULL, 17, 5, 'This follow-up exceeded expectations! Mia analyzed my sleep tracker data beforehand and customized new mindfulness exercises addressing my specific REM cycle patterns. The personalized sleep hygiene checklist she emailed post-session is already helping.', '2025-05-24 01:41:13'),
(29, 21, 70, 16, 5, 'Nicccceeeeee!!!', '2025-05-24 01:50:03'),
(31, 21, 71, 13, 4, 'Nice Service', '2025-05-24 08:31:02');

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

--
-- Dumping data for table `paymentform`
--

INSERT INTO `paymentform` (`id`, `booking_id`, `user_id`, `is_subscribe`, `service_id`, `cardholder_name`, `card_number`, `expiry_date`, `cvv_code`, `amount_paid`, `created_at`) VALUES
(16, 42, 12, 0, 11, 'Emma Wilson', '4532123456789012', '12/25', '123', 200.00, '2025-05-24 00:41:00'),
(17, 43, 13, 1, 12, 'Olivia Taylor', '5555333344441111', '06/26', '456', 100.00, '2025-05-24 00:41:00'),
(18, 44, 14, 0, 13, 'Sophia Clark', '378282246310005', '03/27', '789', 80.00, '2025-05-24 00:41:00'),
(19, 46, 13, 0, 17, 'Olivia Taylor', '3530111333300000', '05/28', '987', 150.00, '2025-05-24 00:44:00'),
(20, 47, 14, 1, 18, 'Sophia Clark', '4111111111111111', '09/25', '321', 100.00, '2025-05-24 00:44:00'),
(21, 48, 15, 0, 19, 'Noah Roberts', '5105105105105100', '07/27', '567', 180.00, '2025-05-24 00:44:00'),
(22, 49, 16, 0, 13, 'Liam Johnson', '6011111111111111', '11/26', '654', 80.00, '2025-05-24 00:44:00'),
(23, 52, 13, 1, 15, 'Olivia Taylor', '5555333344441111', '06/26', '456', 250.00, '2025-05-24 00:48:39'),
(24, 53, 15, 0, 16, 'Noah Roberts', '5105105105105100', '07/27', '567', 400.00, '2025-05-24 00:50:17'),
(25, 55, 13, 1, 15, 'Olivia Taylor', '5555333344441111', '06/26', '456', 250.00, '2025-05-24 00:54:04'),
(26, 56, 15, 0, 16, 'Noah Roberts', '5105105105105100', '07/27', '567', 400.00, '2025-05-24 00:54:14'),
(27, 57, 16, 0, 15, 'Liam Johnson', '6011111111111111', '11/26', '654', 300.00, '2025-05-24 00:54:24'),
(28, 58, 12, 1, 16, 'Emma Wilson', '4532123456789012', '12/25', '123', 4200.00, '2025-05-24 00:54:38'),
(29, 62, 17, 0, 21, 'Noah Roberts', '5105105105105100', '07/27', '567', 120.00, '2025-05-24 01:31:18'),
(30, 63, 18, 0, 22, 'Sophia Clark', '4111111111111111', '09/25', '321', 300.00, '2025-05-24 01:31:28'),
(31, 64, 18, 1, 23, 'Liam Johnson', '6011111111111111', '11/26', '654', 4800.00, '2025-05-24 01:31:38'),
(32, 61, 17, 1, 20, 'Emma Wilson', '4532123456789012', '12/25', '123', 70.00, '2025-05-24 01:31:05'),
(33, 65, 17, 1, 20, 'Emma Wilson', '4532123456789012', '12/25', '123', 70.00, '2025-05-24 01:38:39'),
(34, 66, 17, 0, 21, 'Noah Roberts', '5105105105105100', '07/27', '567', 120.00, '2025-05-24 01:38:39'),
(35, 67, 18, 0, 22, 'Sophia Clark', '4111111111111111', '09/25', '321', 300.00, '2025-05-24 01:38:39'),
(36, 68, 18, 1, 23, 'Liam Johnson', '6011111111111111', '11/26', '654', 4800.00, '2025-05-24 01:38:39'),
(37, 69, 17, 1, 20, 'Emma Wilson', '4532123456789012', '12/25', '123', 70.00, '2025-05-24 01:38:39'),
(38, 70, 16, 0, 21, 'LiamJ', '4389 4789 2374 8374', '11/25', '345', 120.00, '2025-05-24 01:47:41'),
(39, 71, 13, 1, 21, 'John Smith', '2222 2454 5454 5656', '12/26', '2333', 95.00, '2025-05-24 07:50:54');

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
(5, 7, 'Jacob Creative Solutions', 'JacobCreative@gmail.com', '03161599227', '456 Design Street, Creative District', 'Award-winning graphic designer and multimedia specialist specializing in branding and digital design.'),
(6, 9, 'Sumeera Beauty Studio', 'SumeeraBeauty@gmail.com', '03161532326', '789 Elegance Avenue, Beauty Quarter', 'Licensed aesthetician offering premium skincare treatments and beauty therapies with organic products.'),
(7, 17, 'Tranquil Mind Wellness', 'mia.chen@example.com', '447701122334', '123 Wellness St, London, UK', 'Certified holistic wellness coach specializing in stress reduction and sleep improvement through evidence-based techniques. 8 years experience with corporate clients and individuals.'),
(8, 18, 'Patel Design Studio', 'aisha.patel@example.com', '447702233445', '456 Creative Lane, Manchester, UK', 'Award-winning graphic designer creating bold visual identities for women-led businesses. Specializing in logo design and brand strategy for the beauty and lifestyle industries.');

-- --------------------------------------------------------

--
-- Table structure for table `provider_reviews`
--

CREATE TABLE `provider_reviews` (
  `id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `customer_review_id` int(11) DEFAULT NULL,
  `review_text` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provider_reviews`
--

INSERT INTO `provider_reviews` (`id`, `service_id`, `booking_id`, `user_id`, `customer_review_id`, `review_text`, `created_at`) VALUES
(5, 11, 42, 12, NULL, 'Well Done.', '2025-05-24 05:41:29'),
(6, 13, 44, 14, NULL, 'Awesome.', '2025-05-24 05:41:51'),
(7, 16, 53, 15, NULL, 'Well Done', '2025-05-24 06:00:24'),
(8, 16, 56, 15, NULL, 'Awesome', '2025-05-24 06:00:33'),
(9, 16, 58, 12, NULL, 'Nice', '2025-05-24 06:00:53'),
(10, 15, 52, 13, NULL, 'Good', '2025-05-24 06:01:00'),
(11, 18, 59, 14, NULL, 'Very Well.', '2025-05-24 06:14:47'),
(12, 17, 46, 13, 10, 'Lovely', '2025-05-24 06:15:02'),
(13, 22, 63, 18, 17, 'Thanks', '2025-05-24 06:42:30'),
(14, 22, 67, 18, 21, 'Awesome\n', '2025-05-24 06:42:41'),
(15, 23, 64, 18, 18, 'Wonderfull', '2025-05-24 06:43:08'),
(16, 23, 68, 18, 22, 'Nice of You', '2025-05-24 06:43:18'),
(17, 20, 65, 17, 19, 'Thanks', '2025-05-24 06:45:22'),
(18, 21, 62, 17, 16, 'Good.', '2025-05-24 06:45:31'),
(19, 21, 66, 17, 20, 'Lovely', '2025-05-24 06:45:38'),
(20, 20, 69, 17, 23, 'Wow!!', '2025-05-24 06:45:46'),
(21, 21, 70, 16, NULL, 'Nice of you.', '2025-05-24 06:49:27'),
(22, 21, 71, 13, 31, 'Thank you for choosing our service! It was a pleasure working with you—looking forward to future collaborations.', '2025-05-24 14:17:52');

-- --------------------------------------------------------

--
-- Table structure for table `reserved_periods`
--

CREATE TABLE `reserved_periods` (
  `id` int(11) NOT NULL,
  `day` varchar(20) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reserved_periods`
--

INSERT INTO `reserved_periods` (`id`, `day`, `start_time`, `end_time`, `reason`, `created_at`) VALUES
(2, 'Sunday', '12:00:00', '18:00:00', 'For System Testing and Perfomance Checking Time reserved.', '2025-05-15 05:00:54'),
(10, 'Tuesday', '08:00:00', '14:00:00', 'Backend processing', '2025-05-24 11:13:54');

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
(2, 'Jason', 'Jason@gmail.com', 'Jason123', '03337564114', 'provider', 0),
(7, 'Jacob', 'Jacob@gmail.com', 'Jacob', '03161599227', 'provider', 0),
(9, 'Sumeera', 'Sumeera@gmail.com', 'Sumeera123', '03161537777', 'provider', 0),
(12, 'EmmaW', 'EmmaWilson@gmail.com', 'EmmaW123$', '447700123456', 'customer', 0),
(13, 'OliviaT', 'OliviaTaylor@outlook.com', 'OliviaT456!', '447701234567', 'customer', 1),
(14, 'SophiaC', 'SophiaClark@yahoo.com', 'SophiaC789!', '447712345678', 'customer', 0),
(15, 'NoahR', 'NoahRoberts@gmail.com', 'NoahR123$', '447723456789', 'customer', 1),
(16, 'LiamJ', 'LiamJohnson@outlook.com', 'LiamJ456!', '447734567890', 'customer', 0),
(17, 'mia_wellness', 'mia.chen@example.com', 'mia_wellness123', '447701122334', 'provider', 0),
(18, 'aisha_designs', 'aisha.patel@example.com', 'aisha!195', '447702233445', 'provider', 0),
(19, 'emilyjones', 'emily.jones@gmail.com', 'Emily@123', '07456 321098', 'provider', 0),
(20, 'jamesthomas', 'james.thomas@yahoo.com', ' James#456', '07891 234567', 'provider', 0),
(21, 'oliviasmith', 'olivia.smith@outlook.com', 'Olivia!789', '07723 987654', 'provider', 0),
(22, 'danielwright', 'daniel.wright@gmail.com', 'Daniel@321', '07984 112233', 'provider', 0),
(23, 'zubairtch', 'zubair.tech@gmail.com', 'Zubair!4321', '0306 4432211', 'provider', 0);

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
-- Indexes for table `customer_reviews`
--
ALTER TABLE `customer_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `user_id` (`user_id`);

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
-- Indexes for table `provider_reviews`
--
ALTER TABLE `provider_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_booking` (`booking_id`),
  ADD KEY `fk_customer_review` (`customer_review_id`);

--
-- Indexes for table `reserved_periods`
--
ALTER TABLE `reserved_periods`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bookingform`
--
ALTER TABLE `bookingform`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `customer_reviews`
--
ALTER TABLE `customer_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `paymentform`
--
ALTER TABLE `paymentform`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `provider_profile_info`
--
ALTER TABLE `provider_profile_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `provider_reviews`
--
ALTER TABLE `provider_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `reserved_periods`
--
ALTER TABLE `reserved_periods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

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
-- Constraints for table `customer_reviews`
--
ALTER TABLE `customer_reviews`
  ADD CONSTRAINT `customer_reviews_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `add_services` (`id`),
  ADD CONSTRAINT `customer_reviews_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `bookingform` (`id`),
  ADD CONSTRAINT `customer_reviews_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

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

--
-- Constraints for table `provider_reviews`
--
ALTER TABLE `provider_reviews`
  ADD CONSTRAINT `fk_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookingform` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_customer_review` FOREIGN KEY (`customer_review_id`) REFERENCES `customer_reviews` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
