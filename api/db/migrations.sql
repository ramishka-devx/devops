-- Run this manually on existing databases to add new LMS structures
-- Conditional add of role column compatible with older MySQL 8 versions
SET @missing_role := (
  SELECT COUNT(*) = 0 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
);
SET @ddl := IF(@missing_role, 'ALTER TABLE users ADD COLUMN role ENUM("student","admin") NOT NULL DEFAULT "student"', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  cover VARCHAR(255),
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS course_months (
  month_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  month_index INT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_month_course
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uniq_course_month (course_id, month_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS lessons (
  lesson_id INT AUTO_INCREMENT PRIMARY KEY,
  month_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content_url VARCHAR(500),
  content TEXT,
  display_order INT NOT NULL DEFAULT 1,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lesson_month
    FOREIGN KEY (month_id) REFERENCES course_months(month_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  month_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('paid','pending','failed') NOT NULL DEFAULT 'paid',
  txn_ref VARCHAR(100),
  paid_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_payment_course FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
  CONSTRAINT fk_payment_month FOREIGN KEY (month_id) REFERENCES course_months(month_id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_month (user_id, month_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
