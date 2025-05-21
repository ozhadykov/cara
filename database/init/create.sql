-- Create the database if it doesn't exist (optional, but good practice)
-- CREATE DATABASE IF NOT EXISTS phenix_mysql;
-- USE phenix_mysql;

-- Drop tables if they already exist to allow rerunning the script
-- Be careful with this in production environments!
DROP TABLE IF EXISTS pairs;
DROP TABLE IF EXISTS address;
DROP TABLE IF EXISTS children;
DROP TABLE IF EXISTS assistants;
DROP TABLE IF EXISTS apiKeys;


CREATE TABLE address (
    id INT AUTO_INCREMENT PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    street_number VARCHAR(20) NOT NULL,
    city VARCHAR(255) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);

-- Create the children table
CREATE TABLE children (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    required_qualification VARCHAR(255) NOT NULL,
    requested_hours INT NOT NULL,
    address_id INT NOT NULL,

    FOREIGN KEY (address_id) REFERENCES address(id) ON DELETE CASCADE
);

-- Create the assistants table
CREATE TABLE assistants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    qualification VARCHAR(255),
    capacity INT NOT NULL, -- e.g., number of children they can assist
    address_id INT NOT NULL,

    FOREIGN KEY(address_id) REFERENCES address(id) ON DELETE CASCADE
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

CREATE TABLE apiKeys (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    apiKey VARCHAR(255) NOT NULL
);

INSERT INTO apiKeys (id, apiKey)
VALUES
    ('opencagekey', ''),
    ('amplkey', '');
