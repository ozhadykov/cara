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
DROP TABLE IF EXISTS qualifications;

CREATE TABLE qualifications
(
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    qualification_text VARCHAR(10) NOT NULL
);

INSERT INTO qualifications (qualification_text)
VALUES ('QHK'),
       ('ReKo'),
       ('HK');

CREATE TABLE address
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    street        VARCHAR(255)     NOT NULL,
    street_number VARCHAR(20)      NOT NULL,
    city          VARCHAR(255)     NOT NULL,
    zip_code      VARCHAR(20)      NOT NULL,
    latitude      DOUBLE PRECISION NOT NULL,
    longitude     DOUBLE PRECISION NOT NULL
);

-- Create the children table
CREATE TABLE children
(
    id                     INT AUTO_INCREMENT PRIMARY KEY,
    first_name             VARCHAR(255) NOT NULL CHECK (LENGTH(first_name) > 1),
    family_name            VARCHAR(255) NOT NULL CHECK (LENGTH(family_name) > 1),

    required_qualification INT CHECK (required_qualification > 0 AND required_qualification <= 3),

    requested_hours        INT          NOT NULL,

    address_id             INT          NOT NULL,

    created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at             DATETIME  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE,
    FOREIGN KEY (required_qualification) REFERENCES qualifications (id)
);

-- Create the assistants table
CREATE TABLE assistants
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    first_name    VARCHAR(255) NOT NULL CHECK (LENGTH(first_name) > 1),
    family_name   VARCHAR(255) NOT NULL CHECK (LENGTH(family_name) > 1),

    qualification INT CHECK (qualification > 0 AND qualification <= 3),

    min_capacity  INT          NOT NULL CHECK (min_capacity >= 0),
    max_capacity  INT          NOT NULL CHECK (max_capacity >= 0),

    address_id    INT          NOT NULL,
    has_car       BOOL         NOT NULL,

    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE,
    FOREIGN KEY (qualification) REFERENCES qualifications (id)
);


-- Create the pairs table to link children and assistants (the assignment)
CREATE TABLE pairs
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    child_id     INT NOT NULL,
    assistant_id INT NOT NULL,

    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (child_id) REFERENCES children (id) ON DELETE CASCADE,
    FOREIGN KEY (assistant_id) REFERENCES assistants (id) ON DELETE CASCADE,
    UNIQUE KEY unique_pair (child_id, assistant_id)
);


-- Create distance matrix for children and assistants

CREATE TABLE distance_matrix
(
    id                     INT AUTO_INCREMENT PRIMARY KEY,
    origin_address_id      INT   NOT NULL,
    destination_address_id INT   NOT NULL,
    distance               FLOAT NOT NULL,
    travel_time            FLOAT NOT NULL,

    created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at             DATETIME  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (origin_address_id) REFERENCES address (id) ON DELETE CASCADE,
    FOREIGN KEY (destination_address_id) REFERENCES address (id) ON DELETE CASCADE,
    UNIQUE KEY unique_pair (origin_address_id, destination_address_id)
);

CREATE TABLE apiKeys
(
    id     VARCHAR(255) NOT NULL PRIMARY KEY,
    apiKey VARCHAR(255) NOT NULL
);

INSERT INTO apiKeys (id, apiKey)
VALUES ('opencage_key', ''),
       ('ampl_key', ''),
       ('google_maps_key', '');
