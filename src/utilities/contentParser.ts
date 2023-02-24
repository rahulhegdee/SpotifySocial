function getItems(data: any) {
	return data?.data?.items ?? [];
}

function trackParser(track: any) {
	const artistArray = track?.artists?.reduce(
		(allArtists: Array<string>, currArtist: any) => {
			allArtists.push(currArtist.name);
		}
	);
	const artists = artistArray.join(", ");

	const song = track?.name;

	const cover = track?.album?.images?.get(0)?.url;

	const album = track?.album?.name;

	const albumType = track?.album?.type;

	const URI = track?.external_urls?.spotify;

	return {
		artistName: artists,
		songName: song,
		songCover: cover,
		albumName: album,
		spotifyURI: URI,
		albumType: albumType,
	};
}

export function parseTopTracks(data: any): Object {
	const items = getItems(data);
	items.map((item: any) => {
		return trackParser(item);
	});
	return items;
}

export function parseRecentTracks(data: any): Object {
	const items = getItems(data);
	items.map((item: any) => {
		const track = item.track;
		return trackParser(track);
	});
	return items;
}
