import React from "react";
import NavBar from "./NavBar";

function NavWrapper({ children }: any) {
	return (
		<div>
			<NavBar />
			<>{children}</>
		</div>
	);
}

export default NavWrapper;
