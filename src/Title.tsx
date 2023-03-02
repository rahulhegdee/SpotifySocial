import React, { useContext } from "react";
import styles from "./Title.module.css";
import { Navigate } from "react-router-dom";
import { TokenContext } from "./App";

function Title() {
	const token = useContext(TokenContext);

	return (
		<>
			{token != null ? (
				<Navigate to="/reccomend" replace={true} />
			) : (
				<div className={styles.wrapper}>
					<div className={styles.layout}>
						<div className={styles.row}>
							<h1 className={styles.logo}>
								<span id={styles.spotifyText}>Spotify</span>Social™
							</h1>
						</div>
						<div className={styles.row}>
							<p className={styles.slogan}>Music: The Universal Language</p>
						</div>
						<div className={styles.row}>
							<a className={styles.login} href="http://localhost:8000/login/">
								<img
									src={require("./spotify.png")}
									className={styles.spotifyLogo}
									width="30px"
									height="30px"
								/>
								<p className={styles.loginText}>LOGIN WITH SPOTIFY</p>
							</a>
						</div>
					</div>
					<div className={styles.footer}>
						<p id={styles.company}>© Santa's Workshop 2023</p>
						<div className={styles.socials}>
							<p>
								<a href="https://github.com/rahulhegdee" target="_blank">
									<i className="fa fa-github"></i>
								</a>
								<a href="https://twitter.com/rahulhegdee" target="_blank">
									<i className="fa fa-twitter"></i>
								</a>
								<a href="https://instagram.com/rahulhegdee" target="_blank">
									<i className="fa fa-instagram"></i>
								</a>
								<a href="https://linkedin.com/in/rahulhegde" target="_blank">
									<i className="fa fa-linkedin"></i>
								</a>
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default Title;
