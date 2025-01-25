import type { Env } from '..';
import {
	addAddressQuery,
	addressByUserIdQuery,
	addUserQuery,
	allUsersDataQuery,
	deleteUserQuery,
	getUserQuery,
	updateAddressQuery,
	updateUserQuery,
} from '../shared/queries';
import { CreateUserBody } from '../shared/types';
import { cleanAddress, mergeWithExistingUser } from '../shared/utils';

const getUserById = async (env: Env, userId: string) => {
	try {
		const { results } = await env.DB.prepare(getUserQuery).bind(userId).all();
		console.log(results);
		return results[0]; // We expect only one result
	} catch (err) {
		console.error('Error fetching user:', err);
		throw new Error('Error fetching user');
	}
};
const getUserByEmailQuery = `
    SELECT userId
    FROM Users 
    WHERE email = ?;
  `;
const insertUserQuery = `
    INSERT INTO Users (email, pw) 
    VALUES (?, ?);
`;

export const lookUpUserByEmail = async (env: Env, email: string, pw: string): Promise<Response> => {
	try {
		const { results } = await env.DB.prepare(getUserByEmailQuery).bind(email).all();

		if (!results || results.length === 0) {
			await env.DB.prepare(insertUserQuery).bind(email, pw).run();
			const userIdResult = await env.DB.prepare('SELECT last_insert_rowid() AS userId').all();
			const userId = userIdResult.results[0].userId;
			// Retrieve the newly created user details (now with userId)
			const newUserQuery = `
				SELECT userId, email, pw, aboutMe, birthday 
				FROM Users 
				WHERE userId = ?;
			`;
			const newUser = await env.DB.prepare(newUserQuery).bind(userId).all();
			console.log(newUser);
			return Response.json({ ...newUser.results[0], newUser: true });
		}
		const user = await getUserById(env, results[0].userId as string);
		console.log(user);
		console.log(pw, user.pw);
		if (pw !== user.pw) {
			return new Response('Invalid password', { status: 401 });
		}
		return Response.json(user);
	} catch (err) {
		console.error('error fetching user', err);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export async function getUsers(env: Env): Promise<Response> {
	try {
		const { results } = await env.DB.prepare(allUsersDataQuery).all();
		if (!results || results.length === 0) {
			return new Response('no users found', { status: 404 });
		}
		return Response.json(results);
	} catch (err) {
		return new Response('Internal Server Error', { status: 500 });
	}
}

export async function addUser(req: Request, env: Env) {
	try {
		const body: CreateUserBody = await req.json();

		const { email, pw, aboutMe, birthday, address1, address2, city, state, zipcode } = body;

		if (!email || !pw || !aboutMe || !birthday) {
			return new Response('Missing required fields', { status: 400 });
		}

		await env.DB.prepare(addUserQuery).bind(email, pw, aboutMe, birthday).run();
		const userIdResult = await env.DB.prepare('SELECT last_insert_rowid() AS userId').all();
		const userId = userIdResult.results[0].userId;

		const addressVals = cleanAddress({ address1, address2, city, state, zipcode });
		if (addressVals.some((val) => val !== null)) {
			await env.DB.prepare(addAddressQuery)
				.bind(userId, ...addressVals)
				.run();
		}
		return Response.json({ userId }, { status: 201 });
	} catch (err) {
		console.error(err);
		return new Response('Internal server error', { status: 500 });
	}
}
export async function addAddress(userId: string, address: any, env: Env) {
	try {
		// const body: any = await req.json();
		// console.log({ body });
		const { address1, address2, city, state, zipcode } = address;

		const res = await env.DB.prepare(addAddressQuery).bind(userId, address1, address2, city, state, zipcode).run();
		console.log('res in add address', res);
		return Response.json({ status: 201 });
	} catch (err) {
		console.log('catch of add address');
		console.error(err);
		return new Response('Internal server error', { status: 500 });
	}
}
export async function updateUser(id: string, updatedData: any, env: Env): Promise<Response> {
	const user = await getUserById(env, id);
	try {
		// Update user details in the Users table
		const updatedUser = mergeWithExistingUser(user, updatedData);
		console.log(updatedUser, id);
		const res = await env.DB.prepare(updateUserQuery)
			.bind(updatedUser.email, updatedUser.pw, updatedUser.aboutMe, updatedUser.birthday, id)
			.run();
		// Return a success response
		return new Response(JSON.stringify({ message: 'User updated successfully' }), { status: 200 });
	} catch (err) {
		console.error('Error updating user:', err);
		return new Response('Internal Server Error', { status: 500 });
	}
}

export async function updateAddress(userId: string, updatedData: any, env: Env): Promise<Response> {
	if (!updatedData.address1 || !updatedData.city || !updatedData.state || !updatedData.zipcode) {
		return new Response('Missing required address fields', { status: 400 });
	}

	const address = await getAddressByUserId(env, userId);

	if (!address) {
		return new Response('Address not found', { status: 404 });
	}

	const updatedAddress = {
		address1: updatedData.address1 ?? null,
		address2: updatedData.address2 ?? null,
		city: updatedData.city ?? null,
		state: updatedData.state ?? null,
		zipcode: updatedData.zipcode ?? null,
	};

	try {
		await env.DB.prepare(updateAddressQuery)
			.bind(updatedAddress.address1, updatedAddress.address2, updatedAddress.city, updatedAddress.state, updatedAddress.zipcode, userId)
			.run();

		return new Response(JSON.stringify({ message: 'Address updated successfully' }), { status: 200 });
	} catch (err) {
		console.error('Error updating address:', err);
		return new Response('Internal Server Error', { status: 500 });
	}
}

// Function to get the address by userId
async function getAddressByUserId(env: Env, userId: string) {
	const { results } = await env.DB.prepare(addressByUserIdQuery).bind(userId).all();
	return results.length > 0 ? results[0] : null; // Return the address if found
}

export async function deleteUser(userId: string, env: Env): Promise<Response> {
	try {
		await env.DB.prepare(deleteUserQuery).bind(userId).run();

		return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
	} catch (err) {
		console.error('Error deleting user:', err);
		return new Response('Internal Server Error', { status: 500 });
	}
}
