import React, { useContext } from "react";
import { TokenContext } from "./App";
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
		playURI,
	} = trackInfo;

	const token = useContext(TokenContext);

	function getSongInfo() {
		window.open(spotifyURI);
	}

	function playSong() {
		console.log(token);
		fetch("http://localhost:8000/play", {
			method: "PUT",
			body: JSON.stringify({
				uri: playURI,
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: token,
			},
		}).then((res) => console.log(res));
	}

	return (
		<div className={styles.wrapper}>
			<img
				src={songCover}
				className={styles.songCover}
				alt={`${songName} artwork`}
			/>
			<p className={styles.songName}>{songName}</p>
			<p className={styles.artistName}>{artistName}</p>
			{albumType === "album" && <p className={styles.albumName}>{albumName}</p>}
			<div className={styles.dimmer}>
				<i className="fa fa-play" onClick={playSong}></i>
				<i className="fa fa-info-circle" onClick={getSongInfo}></i>
				<i className="fa fa-share"></i>
			</div>
		</div>
	);
}

export default TrackCard;
