import React, { useContext, useState } from "react";
import { TokenContext } from "./App";
import TrackCard from "./TrackCard";
import { parseTopTracks, parseRecentTracks } from "./utilities/contentParser";

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

	const token = useContext(TokenContext);

	const parseContent = (data: Object): any => {
		return contentType === "top"
			? parseTopTracks(data)
			: parseRecentTracks(data);
	};

	const getContent = async () => {
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
	};

	getContent();
	return (
		<div>
			<h1>{headerName}</h1>
			<div>
				{content.map((item) => {
					return <TrackCard trackInfo={item} key={item.trackID} />;
				})}
			</div>
		</div>
	);
}

export default ContentGrid;
