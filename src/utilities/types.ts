export type TrackInfo = {
	artistName: string;
	songName: string;
	songCover: string;
	albumName: string;
	spotifyURI: string;
	albumType: string;
	trackID?: string;
};

export type Page = {
	name: string;
	content: Array<any>;
};

export type NavSection = {
	header: string;
	pages: Array<Page>;
};
