import React, { useState } from "react";
import { NavSection } from "./utilities/types";
import styles from "./SideNav.module.css";

type SideNavProps = {
	sections: Array<NavSection>;
	setFunc: any;
};

function SideNav({ sections, setFunc }: SideNavProps) {
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
								<div>
									{section.pages.map((page) => {
										return (
											<p
												key={page.id ?? page.name}
												className={styles.page}
												onClick={() =>
													setFunc({
														headerName: page.name,
														contentType: page.type,
														contentEndpoint: page.endpoint,
													})
												}
											>
												{page.name}
											</p>
										);
									})}
								</div>
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
