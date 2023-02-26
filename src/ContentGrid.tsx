import React, { useContext, useState, useEffect } from "react";
import { TokenContext } from "./App";
import TrackCard from "./TrackCard";
import { parseTopTracks, parseRecentTracks } from "./utilities/contentParser";
import styles from "./ContentGrid.module.css";

type ContentGridProps = {
	headerName: string;
	contentEndpoint: string;
	contentType: "top" | "recent";
	// Add a numContent field here
};

function ContentGrid({
	headerName,
	contentEndpoint,
	contentType,
}: ContentGridProps) {
	const [content, setContent] = useState<any[]>([]);
	const [showContent, setShowContent] = useState(false);

	const token = useContext(TokenContext);

	const toggleShowContent = () => {
		setShowContent(!showContent);
	};

	useEffect(() => {
		const parseContent = (data: Object): any => {
			return contentType === "top"
				? parseTopTracks(data)
				: parseRecentTracks(data);
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
			<h1 onClick={() => toggleShowContent()}>
				{headerName}{" "}
				{!showContent ? (
					<i className="fa fa-caret-down"></i>
				) : (
					<i className="fa fa-caret-up"></i>
				)}
			</h1>
			{showContent && (
				<div className={styles.grid}>
					{content.map((item) => {
						return (
							<div key={item.trackID} className={styles.item}>
								<TrackCard trackInfo={item} />
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default ContentGrid;
