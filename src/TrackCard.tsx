import React from "react";
import styles from "./TrackCard.module.css";
import { TrackInfo } from "./utilities/types";

type TrackCardProps = {
	trackInfo: TrackInfo;
};

function TrackCard({ trackInfo }: TrackCardProps) {
	const {
		artistName,
		songName,
		songCover,
		albumName,
		spotifyURI,
		albumType,
	} = trackInfo;
	return (
		<div className={styles.wrapper}>
			<img src={songCover} className={styles.songCover} />
			<p className={styles.songName}>{songName}</p>
			<p className={styles.artistName}>{artistName}</p>
			{albumType === "album" && <p className={styles.albumName}>{albumName}</p>}
			<div className={styles.dimmer}>
				<i className="fa fa-play"></i>
				<i className="fa fa-bars"></i>
				<i className="fa fa-share"></i>
			</div>
		</div>
	);
}

export default TrackCard;
