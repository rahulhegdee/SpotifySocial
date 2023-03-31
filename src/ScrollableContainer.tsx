import React, { useState, useEffect } from "react";

function ScrollableContainer({ children }: any) {
	const [content, setContent] = useState<any[]>([]);
	const [shouldLoadItems, setShouldLoadItems] = useState(false);
	const [hasNext, setHasNext] = useState(false);
	const [offset, setOffset] = useState(0);
	const [abortController, setAbortController] = useState<AbortController>();
	const [childFunc, setChildFunc] = useState<any>();

	async function getContent() {
		const newAbortController = new AbortController();
		setAbortController(newAbortController);

		if (childFunc != null) {
			const newContent = await childFunc(newAbortController);
			setContent((prevContent) => {
				return [...prevContent, ...newContent];
			});

			// if (
			// 	contentData?.data?.total == null ||
			// 	contentData?.data?.offset + contentData?.data?.limit >=
			// 		contentData?.data?.total
			// ) {
			// 	setHasNext(false);
			// } else {
			// 	setHasNext(true);
			// }

			// const newOffset = contentData?.data?.offset ?? 0;
			// setOffset(newOffset + limit);
		}
	}

	useEffect(() => {
		// cleanup function to abort previous getContent call whenever getContent is run
		return () => {
			if (abortController != null) {
				abortController.abort();
			}
		};
	}, [abortController]);

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

	return <div onScroll={loadItems}>{children}</div>; // change this so that loadItems is passed as a prop so any component inside can scroll and call it instead of entire component
}

export default ScrollableContainer;
