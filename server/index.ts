import express, { Request, Response } from "express";
import querystring from "querystring";
import axios from "axios";
import { createHash, randomBytes, randomUUID } from "crypto";
import bodyParser from "body-parser";
import Redis from "redis";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { addUser } from "./database.js";

dotenv.config();
const PORT = process.env.port || 8000;
const app = express();
const redisClient = Redis.createClient(); // currently on localhost, pass in production URL when shipping
redisClient.on("error", (error) => console.error(`Error : ${error}`));
(async () => {
	await redisClient.connect();
})();

const client_secret = process.env.CLIENT_SECRET;
const client_id = process.env.CLIENT_ID;
const state = randomUUID();
const redirect_uri = process.env.REDIRECT_URI; //URI that is redirected to after the Spotify agreement is fulfilled.
// Note any URI here has to go in settings of the dashboard
const jwt_key = process.env.JWT_SECRET_KEY || "";
const default_expire = 3600000; // one hour

function base64URLEncode(str: any) {
	return str
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
}
const verifier = base64URLEncode(randomBytes(32));

function sha256(buffer: any) {
	return createHash("sha256").update(buffer).digest();
}

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
	);
	next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

interface TokenRequest extends Request {
	accessToken?: string | null;
	token?: string;
}

interface JwtInfo extends jwt.JwtPayload {
	user?: string;
}

function verifyToken(req: TokenRequest, res: Response, next: any) {
	//verifies JWT token in authorization header and verifies if the token is authentic
	const bearer = req.headers["authorization"];
	if (typeof bearer != undefined) {
		req.token = bearer || "";
		jwt.verify(req.token, jwt_key, async (err, data: any) => {
			const username = data?.user ?? "";
			req.accessToken = await redisClient.get(username);
			if (req.accessToken == null) {
				// TODO: CHECK POSTGRESQL
			}
			if (err || req.accessToken == null) {
				res.status(401).json({
					message: "Access Denied",
				});
			} else {
				next(); //moves forward because we successfully found a token
			}
		});
	} else {
		res.status(401).json({
			message: "Access Denied",
		});
	}
}

app.get("/login", function (req, res) {
	let challenge = base64URLEncode(sha256(verifier));

	const scope =
		"user-read-private user-library-read user-read-recently-played user-top-read user-read-email playlist-read-collaborative playlist-read-private user-modify-playback-state";

	res.redirect(
		"https://accounts.spotify.com/authorize?" +
			querystring.stringify({
				response_type: "code",
				client_id: client_id,
				scope: scope,
				redirect_uri: redirect_uri,
				state: state,
				code_challenge_method: "S256",
				code_challenge: challenge,
			})
	);
});

app.post("/access", async function (req, res) {
	const code = req.body.code || null;
	const userState = req.body.state || null;

	if (userState === null || userState !== state) {
		res.redirect(
			"/#" +
				querystring.stringify({
					error: "state_mismatch",
				})
		);
	} else {
		let accessToken = "";
		let refreshToken = "";

		await axios
			.post(
				"https://accounts.spotify.com/api/token",
				{
					code: code,
					redirect_uri: redirect_uri,
					grant_type: "authorization_code",
					client_id,
					code_verifier: verifier,
				},
				{
					headers: {
						Authorization:
							"Basic " +
							Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
						"Content-Type": "application/x-www-form-urlencoded",
					},
				}
			)
			.then((res) => res.data)
			.then((res) => {
				accessToken = res.access_token;
				refreshToken = res.refresh_token;
			})
			.catch((err) => console.log(err));

		let userID = "";
		let name = "";
		let picInfo = "";

		await axios
			.get("https://api.spotify.com/v1/me", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.then((res) => res.data)
			.then((res) => {
				userID = res.id;
				name = res.display_name;
				picInfo = res.images;
			});

		console.log(userID);
		redisClient.set(userID, accessToken, {
			EX: default_expire,
		});

		addUser(userID, accessToken, refreshToken);

		return res.status(200).json({
			token: jwt.sign({ user: userID }, jwt_key, {
				expiresIn: default_expire,
			}),
			name,
			picInfo,
		});

		// res.status(200).json({
		// 	access: accessToken,
		// 	refresh: refreshToken,
		// });
	}
});

app.get("/top/tracks", verifyToken, async function (req: TokenRequest, res) {
	const accessToken = req.accessToken;
	let timeRange = req.query.timeRange;
	if (
		timeRange == null ||
		(timeRange !== "short_term" &&
			timeRange !== "medium_term" &&
			timeRange !== "long_term")
	) {
		timeRange = "short_term";
	}
	try {
		const topTracks = await axios
			.get("https://api.spotify.com/v1/me/top/tracks", {
				params: { time_range: timeRange, limit: 50 },
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.then((res) => res.data);
		res.status(200).json({
			data: topTracks,
		});
	} catch (err) {
		res.status(500).json({
			message: err,
		});
	}
});

app.get("/recent/tracks", verifyToken, async function (req: TokenRequest, res) {
	const accessToken = req.accessToken;
	try {
		const recentTracks = await axios
			.get("https://api.spotify.com/v1/me/player/recently-played", {
				params: { limit: 50 },
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.then((res) => res.data);
		res.status(200).json({
			data: recentTracks,
		});
	} catch (err) {
		res.status(500).json({
			message: err,
		});
	}
});

app.get("/playlists", verifyToken, async function (req: TokenRequest, res) {
	try {
		const userPlaylists = await axios
			.get("https://api.spotify.com/v1/me/playlists", {
				params: { limit: 50 },
				headers: {
					Authorization: `Bearer ${req.accessToken}`,
				},
			})
			.then((res) => res.data);
		res.status(200).json({
			data: userPlaylists,
		});
	} catch (err) {
		res.status(500).json({
			message: err,
		});
	}
});

app.get("/playlist/:id", verifyToken, async function (req: TokenRequest, res) {
	const playlistID = req.params.id;
	try {
		const userPlaylists = await axios
			.get(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
				params: { limit: 50 },
				headers: {
					Authorization: `Bearer ${req.accessToken}`,
				},
			})
			.then((res) => res.data);
		res.status(200).json({
			data: userPlaylists,
		});
	} catch (err) {
		res.status(500).json({
			message: err,
		});
	}
});

app.put("/play", verifyToken, async function (req: TokenRequest, res) {
	const uri = req.body.uri;
	try {
		await axios({
			method: "put",
			url: `https://api.spotify.com/v1/me/player/play`,
			data: {
				uris: [`${uri}`],
			},
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${req.accessToken}`,
			},
		});
		res.status(200).json({
			message: "success",
		});
	} catch (err: any) {
		res.status(500).json({
			message: err,
		});
	}
});

app.listen(PORT, () => {
	console.log(`listening on PORT ${PORT}`);
});

process.on("exit", async () => {
	await redisClient.quit();
});
process.on("SIGINT", async () => {
	await redisClient.quit();
	process.exit();
});
