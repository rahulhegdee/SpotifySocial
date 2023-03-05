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
	const [shouldLoadItems, setShouldLoadItems] = useState(false);
	const [hasNext, setHasNext] = useState(false);
	const [offset, setOffset] = useState(0);

	const limit = 50;

	const token = useContext(TokenContext);

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

	const getContent = async () => {
		try {
			const contentData = await fetch(
				`http://localhost:8000${contentEndpoint}?limit=${limit}&offset=${offset}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: token,
					},
				}
			).then((res) => res.json());
			console.log(contentData);

			const newContent = parseContent(contentData);
			setContent((prevContent) => {
				return [...prevContent, ...newContent];
			});

			if (
				contentData?.data?.total == null ||
				contentData?.data?.offset >= contentData?.data?.total
			) {
				setHasNext(false);
			} else {
				setHasNext(true);
			}

			const newOffset = contentData?.data?.offset ?? 0;
			setOffset(newOffset + limit);

			return;
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		// refresh offset and content when new header selected
		setOffset(0);
		setContent([]);
	}, [headerName]);

	useEffect(() => {
		// when both offset and content are both reset, get new content
		if (offset === 0 && content.length === 0) {
			getContent();
		}
	}, [offset, content]);

	useEffect(() => {
		if (shouldLoadItems === true) {
			getContent();
		}
		setShouldLoadItems(false);
	}, [shouldLoadItems]);

	const loadItems = (event: any) => {
		const el = event.currentTarget;
		const hasReachedBottom =
			Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) <= 1;
		const shouldLoad =
			hasReachedBottom && !shouldLoadItems && hasNext && content.length > 0;
		setShouldLoadItems(shouldLoad);
	};

	return (
		<div className={styles.layout} onScroll={loadItems}>
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
