import "./styles/index.scss"

import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router"

import App from "./App.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<Router>
		<App />
	</Router>,
)
