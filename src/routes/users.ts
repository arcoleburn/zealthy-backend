import type { Env } from '..';
const query = `SELECT 
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

const testQuery = 'SELECT * FROM Users';

export async function getUsers(env: Env): Promise<Response> {
	console.log('users route');
	try {
		const { results } = await env.DB.prepare(testQuery).all();
		console.log(results);
		if (!results || results.length === 0) {
			return new Response('no users found', { status: 404 });
		}
		return Response.json(results);
	} catch (err) {
		console.error('Error fetching users:', err);
		return new Response('Internal Server Error', { status: 500 });
	}
}
