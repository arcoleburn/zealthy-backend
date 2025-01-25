import { Env } from '..';


export async function updateModules(env: Env, data: { one: string[]; two: string[] }): Promise<Response> {
	const db = env.DB;
	try {
		// Update page 1 for all modules in "one"
		for (const moduleName of data.one) {
			await db.prepare('UPDATE Modules SET page = ? WHERE name = ?')
				.bind(1, moduleName)
				.run();
		}

		// Update page 2 for all modules in "two"
		for (const moduleName of data.two) {
			await db.prepare('UPDATE Modules SET page = ? WHERE name = ?')
				.bind(2, moduleName)
				.run();
		}

		return new Response('Modules updated successfully', { status: 200 });
	} catch (err) {
		console.error('Error updating modules:', err);
		return new Response('Internal Server Error', { status: 500 });
	}
}


export async function getAllModules(env: Env): Promise<Response> {
	const db = env.DB;

	try {
		const { results } = await db.prepare('SELECT * FROM Modules').all();

		if (results.length === 0) {
			return new Response('No modules found', { status: 404 });
		}

		return Response.json(results);
	} catch (err) {
		return new Response('Internal Server Error', { status: 500 });
	}
}
