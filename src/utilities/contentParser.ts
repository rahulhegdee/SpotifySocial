import { TrackInfo } from "./types";

function getItems(data: any) {
	return data?.data?.items ?? [];
}

function trackParser(track: any) {
	const artistArray = track?.artists?.reduce(
		(allArtists: Array<string>, currArtist: any) => {
			allArtists.push(currArtist.name);
			return allArtists;
		},
		[]
	);
	const artists = artistArray.join(", ");

	const song = track?.name;

	const cover = track?.album?.images?.[2]?.url;

	const album = track?.album?.name;

	const albumType = track?.album?.type;

	const URI = track?.external_urls?.spotify;

	const id = track?.played_at;

	return {
		artistName: artists,
		songName: song,
		songCover: cover,
		albumName: album,
		spotifyURI: URI,
		albumType: albumType,
		trackID: id,
	};
}

export function parseTopTracks(data: any): Array<TrackInfo> {
	const items = getItems(data);
	const parsedItems = items.map((item: any) => {
		return trackParser(item);
	});
	return parsedItems;
}

export function parseRecentTracks(data: any): Array<TrackInfo> {
	const items = getItems(data);
	const parsedItems = items.map((item: any) => {
		const track = item.track;
		return trackParser(track);
	});
	return parsedItems;
}
