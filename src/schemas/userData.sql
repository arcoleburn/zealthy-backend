DROP TABLE IF EXISTS UserData;

CREATE TABLE
  IF NOT EXISTS Users (
    userId INTEGER PRIMARY KEY,
    email TEXT,
    pw TEXT,
    aboutMe TEXT,
    birthday DATE
  );

INSERT INTO
  Users (userId, email, pw, aboutMe, birthday)
VALUES
  (
    1,
    'jamesFraser@gmail.com',
    'iLoveClaire',
    'Just a humble scot',
    '1721-05-01'
  ),
  (
    2,
    "claireFraser@gmail.com",
    'iLoveJamie',
    "You're gonna think I'm batty but... I am a time travelling surgeon. Kind of accidentally. Well, accidentally the first time. It's a long story. Like, over 7500 pages long.",
    '1918-10-20'
  );

DROP TABLE IF EXISTS Addresses;

CREATE TABLE
  IF NOT EXISTS Addresses (
    addressId integer PRIMARY KEY,
    userId INTEGER NOT NULL,
    address1 TEXT NOT NULL,
    address2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zipcode TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE
  );
INSERT INTO
  ADDRESSES (
    addressId,
    userId,
    address1,
    address2,
    city,
    state,
    zipcode
  )
VALUES
  (
    1,
    1,
    '123 Main Street',
    null,
    "Fraser's Ridge",
    "NC",
    '28605'
  ),
  (
    2,
    2,
    '789 Furey Street',
    'Apt 2',
    'Boston',
    'MA',
    '02133'
  );