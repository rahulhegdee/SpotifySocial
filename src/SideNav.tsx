import React, { useState } from "react";
import { NavSection } from "./utilities/types";
import styles from "./SideNav.module.css";

type SideNavProps = {
	sections: Array<NavSection>;
};

function SideNav({ sections }: SideNavProps) {
	let [displaySideNav, setDisplaySideNav] = useState(false);

	function toggleDisplay() {
		setDisplaySideNav(!displaySideNav);
	}
	return (
		<div className={displaySideNav ? styles.wrapper : styles.buttonWrap}>
			{displaySideNav ? (
				<div>
					{sections.map((section) => {
						return (
							<div key={section.header}>
								<h1 className={styles.header}>{section.header}</h1>
							</div>
						);
					})}
					<div className={styles.closeButton} onClick={toggleDisplay}>
						<i className="fa fa-close"></i>
					</div>
				</div>
			) : (
				<div className={styles.openButton} onClick={toggleDisplay}>
					<i className="fa fa-angle-right"></i>
				</div>
			)}
		</div>
	);
}

export default SideNav;
