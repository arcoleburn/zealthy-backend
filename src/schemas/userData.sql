-- Drop the Addresses table first
DROP TABLE IF EXISTS Addresses;

-- Drop the Users table
DROP TABLE IF EXISTS Users;

-- Create Users table with auto-increment userId
CREATE TABLE IF NOT EXISTS Users (
  userId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  email TEXT,
  pw TEXT,
  aboutMe TEXT,
  birthday DATE
);

-- Insert new Users
INSERT INTO Users (email, pw, aboutMe, birthday)
VALUES
  ('jamesFraser@gmail.com', 'iLoveClaire', 'Just a humble scot', '1721-05-01'),
  ('claireFraser@gmail.com', 'iLoveJamie', 'Time travelling surgeon...', '1918-10-20');

-- Create Addresses table with auto-increment addressId
CREATE TABLE IF NOT EXISTS Addresses (
  addressId INTEGER PRIMARY KEY AUTOINCREMENT,  -- Auto-increment addressId
  userId INTEGER NOT NULL,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zipcode TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE
);

-- Insert data into Addresses
INSERT INTO Addresses (userId, address1, address2, city, state, zipcode)
VALUES
  (1, '123 Main Street', null, "Fraser's Ridge", "NC", '28605'),
  (2, '789 Furey Street', 'Apt 2', 'Boston', 'MA', '02133');
