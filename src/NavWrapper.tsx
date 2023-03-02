import React from "react";
import NavBar from "./NavBar";

function NavWrapper({ children }: any) {
	return (
		<div style={{ height: "100%" }}>
			<NavBar />
			<>{children}</>
		</div>
	);
}

export default NavWrapper;
