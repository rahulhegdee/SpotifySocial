export type TrackInfo = {
	artistName: string;
	songName: string;
	songCover: string;
	albumName: string;
	spotifyURI: string;
	albumType: string;
	trackID?: string;
};

export type PlaylistInfo = {
	name: string;
	id: string;
	URI: string;
	tracksEndpoint: string;
};

export type Page = {
	name: string;
	endpoint: string;
	type: string;
	id?: string;
};

export type NavSection = {
	header: string;
	pages: Array<Page>;
};

export type PageContent = {
	headerName: string;
	contentEndpoint: string;
	contentType: "top" | "recent";
	// Add a numContent field here
};
