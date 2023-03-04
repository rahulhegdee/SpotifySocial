import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import styles from "./ReccomendPage.module.css";
import { TokenContext } from "./App";
import ContentGrid from "./ContentGrid";
import SideNav from "./SideNav";
import { PageContent, Page } from "./utilities/types";
import {
	formatPlaylistsForSideNav,
	parsePlaylists,
} from "./utilities/contentParser";

type ReccomendPageProps = {
	setToken: (newToken: string) => void;
};

function ReccomendPage({ setToken }: ReccomendPageProps) {
	const [isLoadingToken, setIsLoadingToken] = useState(true); // we have to replace this to become a loading state
	const [pageContent, setPageContent] = useState<PageContent>({
		headerName: "Recent Activity",
		contentEndpoint: "/recent/tracks",
		contentType: "recent",
	});
	const [userPlaylists, setUserPlaylists] = useState<Array<Page>>([]);

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

	useEffect(() => {
		function userPlaylists() {
			fetch("http://localhost:8000/playlists", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: token,
				},
			})
				.then((res) => res.json())
				.then((res) => parsePlaylists(res))
				.then((res) => formatPlaylistsForSideNav(res))
				.then((res) => setUserPlaylists(res));
		}
		userPlaylists();
	}, [token]);

	return (
		<>
			{isLoadingToken ? (
				<p>Loading...</p>
			) : (
				<>
					{token != null ? (
						<div className={styles.wrapper}>
							<SideNav
								sections={[
									{
										header: "Listening Activity",
										pages: [
											{
												name: "Recent Activity",
												endpoint: "/recent/tracks",
												type: "recent",
											},
											{
												name: "Top 4 Weeks",
												endpoint: "/top/tracks?timeRange=short_term",
												type: "top",
											},
											{
												name: "Top 6 Months",
												endpoint: "/top/tracks?timeRange=medium_term",
												type: "top",
											},
											{
												name: "Top Few Years",
												endpoint: "/top/tracks?timeRange=long_term",
												type: "top",
											},
										],
									},
									{ header: "Playlists", pages: userPlaylists },
								]}
								setFunc={setPageContent}
							/>
							<ContentGrid
								headerName={pageContent.headerName}
								contentEndpoint={pageContent.contentEndpoint}
								contentType={pageContent.contentType}
							/>
						</div>
					) : (
						<Navigate to="/" replace={true} />
					)}
				</>
			)}
		</>
	);
}

export default ReccomendPage;
