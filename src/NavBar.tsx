import React from "react";
import styles from "./NavBar.module.css";

function NavBar() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.sections}>
				<h1 className={styles.logo}>
					<span id={styles.spotifyText}>Spotify</span>Social™
				</h1>
				<p>Feed</p>
				<p>Reccomend</p>
			</div>
			<p>Log Out</p>
		</div>
	);
}

export default NavBar;
