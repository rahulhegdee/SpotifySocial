import { TrackInfo } from "./types";

function getItems(data: any) {
	return data?.data?.items ?? [];
}

function trackParser(track: any): TrackInfo {
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

	return {
		artistName: artists,
		songName: song,
		songCover: cover,
		albumName: album,
		spotifyURI: URI,
		albumType: albumType,
	};
}

export function parseTopTracks(data: any): Array<TrackInfo> {
	const items = getItems(data);
	const parsedItems = items.map((item: any) => {
		const id = item?.id;
		const trackMap = trackParser(item);
		trackMap["trackID"] = id;
		return trackMap;
	});
	return parsedItems;
}

export function parseRecentTracks(data: any): Array<TrackInfo> {
	const items = getItems(data);
	const parsedItems = items.map((item: any) => {
		const track = item.track;
		const id = `${track?.id} ${item?.played_at}`;
		const trackMap = trackParser(track);
		trackMap["trackID"] = id;
		return trackMap;
	});
	return parsedItems;
}
