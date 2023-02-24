import postgres from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = postgres;
const pool = new Pool({
	user: process.env.DB_USERNAME,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: 5432,
	host: "localhost",
});

async function addUser(userID: string, access: string, refresh: string) {
	try {
		// Inserts a user with their access and refresh, if they already exist then update their access and refresh token.
		await pool.query(
			"INSERT INTO users (userid, access, refresh) VALUES ($1, $2, $3) ON CONFLICT (userid) DO UPDATE SET access = $2, refresh = $3;",
			[userID, access, refresh]
		);
	} catch (err) {
		console.error(err);
	}
}

export { addUser };
