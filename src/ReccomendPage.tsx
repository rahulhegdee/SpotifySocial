import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import styles from "./ReccomendPage.module.css";
import { TokenContext } from "./App";
import ContentGrid from "./ContentGrid";
import SideNav from "./SideNav";
import { PageContent } from "./utilities/types";

type ReccomendPageProps = {
	setToken: (newToken: string) => void;
};

function ReccomendPage({ setToken }: ReccomendPageProps) {
	const [isLoadingToken, setIsLoadingToken] = useState(true); // we have to replace this to become a loading state
	const [pageContent, setPageContent] = useState<PageContent>({
		headerName: "",
		contentEndpoint: "",
		contentType: "",
	});

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
									{ header: "Playlists", pages: [] },
								]}
								setFunc={setPageContent}
							/>
							<div>
								<ContentGrid
									headerName={pageContent.headerName}
									contentEndpoint={pageContent.contentEndpoint}
									contentType={pageContent.contentType}
								/>
							</div>
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
