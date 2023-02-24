import React, { useContext, useState } from "react";
import { TokenContext } from "./App";
import { parseTopTracks, parseRecentTracks } from "./utilities/contentParser";

type ContentGridProps = {
	headerName: string;
	contentEndpoint: string;
	contentType: "top" | "recent";
};

function ContentGrid({
	headerName,
	contentEndpoint,
	contentType,
}: ContentGridProps) {
	const [content, setContent] = useState({});
	console.log(content);

	const token = useContext(TokenContext);

	const parseContent = (data: Object): Object => {
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
		</div>
	);
}

export default ContentGrid;
