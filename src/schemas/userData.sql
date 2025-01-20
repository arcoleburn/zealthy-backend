-- Drop the Addresses table first
DROP TABLE IF EXISTS Addresses;

-- Drop the Users table
DROP TABLE IF EXISTS Users;

DROP TABLE IF EXISTS Modules;

-- Create Users table with auto-increment userId
CREATE TABLE
  IF NOT EXISTS Users (
    userId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    email TEXT NOT NULL,
    pw TEXT NOT NULL,
    aboutMe TEXT,
    birthday DATE
  );

CREATE TABLE
  IF NOT EXISTS Modules (
    moduleId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    page INTEGER NOT NULL,
    UNIQUE(name, page)
  );

INSERT INTO
  Modules (name, page)
VALUES
  ('aboutMe', 1),
  ('birthday', 1),
  ('address', 2);

-- Insert new Users
INSERT INTO
  Users (email, pw, aboutMe, birthday)
VALUES
  (
    'jamesFraser@gmail.com',
    'iLoveClaire',
    'Just a humble scot. Sometimes known as Alexander Malcolm. Or Mr. McTavish. Or, to my friends, McDoo.',
    '1721-05-01'
  ),
  (
    'claireFraser@gmail.com',
    'iLoveJamie',
    'A time travelling surgeon. No, really... Its a long story. Like, 7200 pages long. Anyone know where I can get some penicillin?',
    '1918-10-20'
  );

-- Create Addresses table with auto-increment addressId
CREATE TABLE
  IF NOT EXISTS Addresses (
    addressId INTEGER PRIMARY KEY AUTOINCREMENT, -- Auto-increment addressId
    userId INTEGER NOT NULL,
    address1 TEXT NOT NULL,
    address2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zipcode TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE
  );

-- Insert data into Addresses
INSERT INTO
  Addresses (userId, address1, address2, city, state, zipcode)
VALUES
  (
    1,
    '123 Main Street',
    null,
    "Fraser's Ridge",
    "NC",
    '28605'
  ),
  (
    2,
    '789 Furey Street',
    'Apt 2',
    'Boston',
    'MA',
    '02133'
  );