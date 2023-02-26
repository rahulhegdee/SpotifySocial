import React from "react";
import { NavSection } from "./utilities/types";
import styles from "./SideNav.module.css";

type SideNavProps = {
	sections: Array<NavSection>;
};

function SideNav({ sections }: SideNavProps) {
	return (
		<div className={styles.wrapper}>
			{sections.map((section) => {
				return (
					<div key={section.header}>
						<h1 className={styles.header}>{section.header}</h1>
					</div>
				);
			})}
		</div>
	);
}

export default SideNav;
