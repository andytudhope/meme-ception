import { HashRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Vote from "./Vote";
import Meme from "./Meme";

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path={"/"} element={<Home />} />
				<Route path={"/vote/"} element={<Vote />} />
        <Route path={"/meme/"} element={<Meme />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
