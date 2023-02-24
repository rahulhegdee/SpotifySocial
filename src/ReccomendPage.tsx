import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import TrackCard from "./TrackCard";
import styles from "./ReccomendPage.module.css";
import { TokenContext } from "./App";
import ContentGrid from "./ContentGrid";

type ReccomendPageProps = {
	setToken: (newToken: string) => void;
};

function ReccomendPage({ setToken }: ReccomendPageProps) {
	const [name, setName] = useState("");
	const [profilePic, setProfilePic] = useState("");
	const [isLoadingToken, setIsLoadingToken] = useState(true); // we have to replace this to become a loading state

	const token = useContext(TokenContext);

	function access(code: String, state: String) {
		fetch("http://localhost:8000/access/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				code,
				state,
			}),
		})
			.then((res) => res.json())
			.then((res) => setToken(res.token))
			.then(() => setIsLoadingToken(false));
	}

	useEffect(() => {
		let search = window.location.search;
		let params = new URLSearchParams(search);
		let code = params.get("code");
		let state = params.get("state");
		if (code != null && state != null) {
			setIsLoadingToken(true);
			access(code, state);
			params.delete("code");
			params.delete("state");
			window.history.replaceState({}, document.title, "/reccomend");
		} else {
			// either there is no code/state and no token already, or there is a token already.
			// both cases, we are no longer loading.
			setIsLoadingToken(false);
		}
	}, []);

	let test = () => {
		// fetch("http://localhost:8000/top/tracks?timeRange=short_term", {
		// 	method: "GET",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		Accept: "application/json",
		// 		Authorization: token,
		// 	},
		// })
		// 	.then((res) => res.json())
		// 	.then((res) => console.log(res));
		// fetch("http://localhost:8000/recent/tracks", {
		// 	method: "GET",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		Accept: "application/json",
		// 		Authorization: token,
		// 	},
		// })
		// 	.then((res) => res.json())
		// 	.then((res) => console.log(res));
	};

	const exampleTrack = {
		songName: "EMPTY DREAMS",
		artistName: "CYPARISS",
		albumName: "EMPTY DREAMS",
		spotifyURI: "https://open.spotify.com/track/2HhzV3FY4eZGueF0KpXZUo",
		songCover:
			"https://i.scdn.co/image/ab67616d000048515094c7ddde5b276cf014875d",
		albumType: "album",
	};

	return (
		<div>
			{isLoadingToken ? (
				<p>Loading...</p>
			) : (
				<div>
					{token != null ? (
						<div className={styles.wrapper}>
							<button onClick={() => test()}>Press ME!</button>
							<TrackCard trackInfo={exampleTrack} />
							<ContentGrid
								headerName={"Recent Plays"}
								contentEndpoint="/recent/tracks"
								contentType="recent"
							/>
						</div>
					) : (
						<Navigate to="/" replace={true} />
					)}
				</div>
			)}
		</div>
	);
}

export default ReccomendPage;
