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

	useEffect(() => {
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
	}, [setToken]);

	return (
		<div>
			{isLoadingToken ? (
				<p>Loading...</p>
			) : (
				<div>
					{token != null ? (
						<div className={styles.wrapper}>
							<ContentGrid
								headerName={"Recent Plays"}
								contentEndpoint="/recent/tracks"
								contentType="recent"
							/>
							<ContentGrid
								headerName={"Top 4 Weeks"}
								contentEndpoint="/top/tracks?timeRange=short_term"
								contentType="top"
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
