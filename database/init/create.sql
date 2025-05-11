-- Create the database if it doesn't exist (optional, but good practice)
-- CREATE DATABASE IF NOT EXISTS phenix_mysql;
-- USE phenix_mysql;

-- Drop tables if they already exist to allow rerunning the script
-- Be careful with this in production environments!
DROP TABLE IF EXISTS pairs;
DROP TABLE IF EXISTS children;
DROP TABLE IF EXISTS assistants;

-- Create the children table
CREATE TABLE children (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    required_qualification VARCHAR(255),
    street VARCHAR(255),
    city VARCHAR(255),
    zip_code VARCHAR(20), 
    requested_hours INT
);

-- Create the assistants table
CREATE TABLE assistants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    qualification VARCHAR(255),
    capacity INT, -- e.g., number of children they can assist
    street VARCHAR(255),
    city VARCHAR(255),
    zip_code VARCHAR(20)
);

-- Create the pairs table to link children and assistants (the assignment)
CREATE TABLE pairs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    assistant_id INT NOT NULL,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (assistant_id) REFERENCES assistants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_pair (child_id, assistant_id)
);