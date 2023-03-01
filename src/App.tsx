import React from "react";
import "./index.css";
import "./App.css";
import ReccomendPage from "./ReccomendPage";
import Title from "./Title";
import NavWrapper from "./NavWrapper";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";

const TokenContext = React.createContext("");

function App() {
	const [jwtStore, setJwtStore, removeJwtStore] = useCookies(["token"]);

	function setJwt(newToken: string) {
		setJwtStore("token", newToken, { maxAge: 3600 }); // expires in
	}

	return (
		<TokenContext.Provider value={jwtStore.token}>
			<BrowserRouter>
				<Routes>
					<Route index element={<Title />} />
					<Route
						path="/reccomend"
						element={
							<NavWrapper>
								<ReccomendPage setToken={setJwt} />
							</NavWrapper>
						}
					/>
				</Routes>
			</BrowserRouter>
		</TokenContext.Provider>
	);
}

export default App;
export { TokenContext };
