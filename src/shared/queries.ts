export const deleteUserQuery = `
DELETE FROM Users WHERE userId = ?;
`;

export const allUsersDataQuery = `SELECT 
Users.userId,
				email,
				aboutMe,
				birthday,
				address1,
				address2,
				city,
				state,
				zipcode
			FROM Users
			LEFT JOIN Addresses ON Users.userId = Addresses.userId;`;

export const addUserQuery = 'INSERT INTO Users (email, pw, aboutMe, birthday) VALUES(?, ?, ?, ?)';
export const addAddressQuery = `
  INSERT INTO Addresses (userId, address1, address2, city, state, zipcode)
  VALUES (?, ?, ?, ?, ?, ?);
`;

// SQL query to update user details
export const updateUserQuery = `
  UPDATE Users
  SET email = ?, pw = ?, aboutMe = ?, birthday = ?
  WHERE userId = ?;
`;

// SQL query to update address details
export const updateAddressQuery = `
  UPDATE Addresses
  SET address1 = ?, address2 = ?, city = ?, state = ?, zipcode = ?
  WHERE userId = ?;
`;

export const getUserQuery = `
  SELECT 
    Users.userId,
    email,
    pw,
    aboutMe,
    birthday,
    address1,
    address2,
    city,
    state,
    zipcode
  FROM Users
  LEFT JOIN Addresses ON Users.userId = Addresses.userId
  WHERE Users.userId = ?;
`;
export 	const addressByUserIdQuery = 'SELECT * FROM Addresses WHERE userId = ?';
