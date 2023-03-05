import React, { useContext, useState, useEffect } from "react";
import { TokenContext } from "./App";
import TrackCard from "./TrackCard";
import {
	parseTopTracks,
	parseRecentTracks,
	parsePlaylistTracks,
} from "./utilities/contentParser";
import styles from "./ContentGrid.module.css";
import { PageContent } from "./utilities/types";

function ContentGrid({
	headerName,
	contentEndpoint,
	contentType,
}: PageContent) {
	const [content, setContent] = useState<any[]>([]);

	const token = useContext(TokenContext);

	useEffect(() => {
		const parseContent = (data: Object): any => {
			switch (contentType) {
				case "top":
					return parseTopTracks(data);
				case "recent":
					return parseRecentTracks(data);
				case "playlist":
					return parsePlaylistTracks(data);
			}
		};

		(async () => {
			try {
				const contentData = await fetch(
					`http://localhost:8000${contentEndpoint}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
							Authorization: token,
						},
					}
				).then((res) => res.json());
				setContent(parseContent(contentData));
			} catch (error) {
				console.log(error);
			}
		})();
	}, [contentEndpoint, contentType, token]);

	return (
		<div className={styles.layout}>
			<h1>{headerName}</h1>
			<div className={styles.grid}>
				{content.map((item) => {
					return (
						<div key={item.trackID} className={styles.item}>
							<TrackCard trackInfo={item} />
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default ContentGrid;
