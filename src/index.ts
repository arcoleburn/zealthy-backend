import { AutoRouter, RouterType } from 'itty-router';
import { addUser, deleteUser, getUsers, updateAddress, updateUser } from './routes/users';
export interface Env {
	DB: D1Database;
	router?: RouterType;
}
const router = AutoRouter();
router.all('*', () => new Response('Not Found', { status: 404 }));
router.get('/users', async (env: Env) => {
	return await getUsers(env);
});

export default {
	async fetch(req, env): Promise<Response> {
		if (env.router === undefined) {
			env.router = buildRouter(env);
		}
		return env.router.fetch(req);
	},
} satisfies ExportedHandler<Env>;

function buildRouter(env: Env): RouterType {
	const router = AutoRouter();

	router.get('/users', async () => {
		console.log('users route');
		const res = await getUsers(env);
		return res;
	});

	router.post('/users', async (req) => {
		const response = await addUser(req, env);
		return response;
	});

	router.put('/users/:userId', async (req) => {
		const userId = req.params.userId;
		const updatedUser = await req.json();
		if (!updatedUser) {
			return new Response('Invalid user data', { status: 400 });
		}

		// Call the updateUser function with the userId and the data
		const response = await updateUser(userId, { ...updatedUser }, env);
		return response;
	});

	router.put('/address/:userId', async (req) => {
		const userId = req.params.userId;
		const updatedAddress = await req.json();

		if (!updatedAddress) {
			return new Response('Invalid user data', { status: 400 });
		}
		const response = await updateAddress(userId, { ...updatedAddress }, env);
		return response;
	});

	router.delete('/users/:userId', async (req) => {
		const userId = req.params.userId;
		return await deleteUser(userId, env); // Pass the userId and env to your deleteUser function
	});

	router.all('*', () => new Response('Not Found.', { status: 404 }));

	return router;
}
