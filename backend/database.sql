-- IPTV Admin Panel Database Schema
-- Run this SQL in your cPanel phpMyAdmin or MySQL terminal

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS iptv_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE iptv_database;

-- Admins table (for authentication)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings table (logo, contact info, etc.)
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  logo_url VARCHAR(500) DEFAULT NULL,
  logo_text VARCHAR(100) DEFAULT NULL,
  use_logo_image BOOLEAN DEFAULT TRUE COMMENT 'TRUE for image, FALSE for text',
  contact_email VARCHAR(255) DEFAULT NULL,
  whatsapp_number VARCHAR(50) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Plans table (pricing plans for 1, 2, 3, 6 devices)
CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_tab ENUM('1', '2', '3', '6') NOT NULL,
  name VARCHAR(100) NOT NULL,
  price VARCHAR(50) NOT NULL,
  features TEXT NULL COMMENT 'JSON array of features',
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  buy_link VARCHAR(500) DEFAULT NULL COMMENT 'URL for Buy Now button',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_device_tab (device_tab),
  UNIQUE KEY uniq_device_name (device_tab, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQs table (dynamic Frequently Asked Questions)
CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings record
INSERT INTO settings (id, logo_url, contact_email, whatsapp_number)
VALUES (1, NULL, 'contact@yourdomain.com', '+1 555 123 4567')
ON DUPLICATE KEY UPDATE id=id;

-- Insert default admin (email: admin@site.com, password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admins (email, password_hash)
VALUES ('admin@site.com', '$2a$10$rZ6zYqvE8w3L0xQxH8ZW2.J8vKGYp0K8uPZj5qGQxN8aJ9KxN8vGW')
ON DUPLICATE KEY UPDATE email=email;

-- Insert default plans (original hardcoded pricing)
INSERT INTO plans (device_tab, name, price, features, display_order, is_featured) VALUES
-- 1 Device
('1', '1 Month', '$10.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 1, 0),
('1', '3 Months', '$24.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 2, 0),
('1', '6 Months', '$39.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 3, 1),
('1', '12 Months', '$59.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 4, 0),
-- 2 Devices
('2', '1 Month', '$18.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 1, 0),
('2', '3 Months', '$44.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 2, 0),
('2', '6 Months', '$69.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 3, 1),
('2', '12 Months', '$109.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 4, 0),
-- 3 Devices
('3', '1 Month', '$24.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 1, 0),
('3', '3 Months', '$64.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 2, 0),
('3', '6 Months', '$109.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 3, 1),
('3', '12 Months', '$179.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 4, 0),
-- 6 Devices
('6', '1 Month', '$59.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 1, 0),
('6', '3 Months', '$129.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 2, 0),
('6', '6 Months', '$219.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 3, 1),
('6', '12 Months', '$349.99', '["SD / HD / FHD / 4K Streams","40,000+ Live Channels with EPG","54,000+ VOD","VIP & Premium Channels","Anti-buffering Technology","24/7 Support"]', 4, 0)
ON DUPLICATE KEY UPDATE 
  price = VALUES(price),
  features = VALUES(features),
  display_order = VALUES(display_order),
  is_featured = VALUES(is_featured);

-- Default FAQs (mirroring the original hardcoded list)
INSERT INTO faqs (question, answer, display_order) VALUES
('What is TITAN IPTV?', 'TITAN IPTV is a premium IPTV service offering access to over 40,000 live channels and 54,000+ VOD titles from around the world. Compatible with Smart TV, Android, iOS, Windows, and more.', 1),
('How do I get started?', 'Simply choose a subscription plan, complete your purchase, and you\'ll receive login credentials via email within minutes. Install our app or configure your device, and start streaming immediately.', 2),
('What devices are supported?', 'TITAN IPTV works on Smart TVs, Android devices, iOS (iPhone/iPad), Windows, Mac, Amazon Fire Stick, MAG boxes, and most IPTV-compatible devices.', 3),
('Is there a free trial available?', 'Yes! We offer a free trial so you can test our service quality and channel selection before committing to a paid subscription.', 4),
('Can I use one subscription on multiple devices?', 'Our plans support multiple connections depending on the package you choose. Check the pricing section for details on simultaneous device usage.', 5),
('What if I experience buffering or technical issues?', 'Our support team is available 24/7 to help with any technical issues. We also provide setup guides and troubleshooting resources to ensure smooth streaming.', 6)
ON DUPLICATE KEY UPDATE id=id;
