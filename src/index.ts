// import { AutoRouter } from 'itty-router';

export interface Env {
	DB: D1Database;
}

// const router = AutoRouter()

// router.get('/users')

export default {
	async fetch(req, env): Promise<Response> {
		const { pathname } = new URL(req.url);

		if (pathname === '/get/users') {
			const { results } = await env.DB.prepare(
				`SELECT 
				email,
				aboutMe,
				birthday,
				address1,
				address2,
				city,
				state,
				zipcode
			FROM Users
			LEFT JOIN Addresses ON Users.userId = Addresses.userId;`
			).all();
			return Response.json(results);
		}
		return new Response('not found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
