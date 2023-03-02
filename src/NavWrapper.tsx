import React from "react";
import NavBar from "./NavBar";
import styles from "./NavWrapper.module.css";

function NavWrapper({ children }: any) {
	return (
		<div className={styles.wrapper}>
			<NavBar />
			<>{children}</>
		</div>
	);
}

export default NavWrapper;
