import { AutoRouter } from 'itty-router';
import { getUsers } from './routes/users';
export interface Env {
	DB: D1Database;
}
const router = AutoRouter();
router.all('*', () => new Response('Not Found', { status: 404 }));
router.get('/users', async (env: Env) => {
	console.log('Matched /users route');
	return await getUsers(env);
});

export default {
	async fetch(req, env): Promise<Response> {
		console.log('req received,', req.method, req.url);

		return router.handle(req, env);
	},
} satisfies ExportedHandler<Env>;
