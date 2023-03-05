import { TrackInfo, PlaylistInfo } from "./types";

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

	const infoURI = track?.external_urls?.spotify;

	const playURI = track?.uri;

	return {
		artistName: artists,
		songName: song,
		songCover: cover,
		albumName: album,
		spotifyURI: infoURI,
		albumType: albumType,
		playURI,
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

export function parsePlaylists(data: any): Array<PlaylistInfo> {
	const items = getItems(data);
	const parsedItems = items.map((item: any) => {
		const name = item.name;
		const id = item.id;
		const URI = item?.external_urls?.spotify;
		const tracksEndpoint = item?.tracks?.href;
		return {
			name,
			id,
			URI,
			tracksEndpoint,
		};
	});
	return parsedItems;
}

export function parsePlaylistTracks(data: any) {
	const items = getItems(data);
	const parsedItems = items.map((item: any) => {
		const track = item.track;
		const id = item.id;
		const trackMap = trackParser(track);
		trackMap["trackID"] = id;
		return trackMap;
	});
	return parsedItems;
}

export function formatPlaylistsForSideNav(pages: any): Array<any> {
	const formattedPages = pages.map((page: any) => {
		return {
			name: page.name,
			endpointOld: page.tracksEndpoint,
			endpoint: `/playlist/${page.id}`,
			id: page.id,
			type: "playlist",
		};
	});
	return formattedPages;
}
