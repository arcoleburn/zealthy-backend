import { AutoRouter, cors, RouterType } from 'itty-router';
import { addAddress, addUser, deleteUser, getUsers, lookUpUserByEmail, updateAddress, updateUser } from './routes/users';
import { getAllModules, updateModules } from './routes/modules';
export interface Env {
	DB: D1Database;
	router?: RouterType;
}
const { preflight, corsify } = cors({ origin: '*', allowMethods: '*' });


export default {
	async fetch(req, env): Promise<Response> {
		if (env.router === undefined) {
			env.router = buildRouter(env);
		}
		return env.router.fetch(req);
	},
} satisfies ExportedHandler<Env>;

function buildRouter(env: Env): RouterType {
	const router = AutoRouter({ before: [preflight], finally: [corsify] });

	router.get('/users', async () => {
		const res = await getUsers(env);
		return res;
	});
	router.post('/login', async (req) => {
		const body: { email: string; pw: string } = await req.json();
		const res = await lookUpUserByEmail(env, body.email, body.pw);
		return res;
	});

	router.post('/users', async (req) => {
		const response = await addUser(req, env);
		return response;
	});

	router.put('/users/:userId', async (req) => {
		const userId = req.params.userId;
		console.log('USER ID', userId, req);
		const updatedUser = await req.json();
		if (!updatedUser) {
			return new Response('Invalid user data', { status: 400 });
		}

		// Call the updateUser function with the userId and the data
		const response = await updateUser(userId, { ...updatedUser }, env);
		return response;
	});
	router.post('/address/:userId', async (req) => {
		const userId = req.params.userId;
		const address = await req.json();
		console.log({ address });
		const res = await addAddress(userId, address, env);
		console.log('res in route', { res });
		return res;
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

	router.get('/modules', async () => {
		const res = await getAllModules(env);
		return res;
	});

	router.put('/modules', async (req) => {
		const updatedModules: { one: string[]; two: string[] } = await req.json();
		console.log({ updatedModules });

		const res = await updateModules(env, updatedModules);
		return res;
	});

	router.all('*', () => new Response('Not Found.', { status: 404 }));

	return router;
}
