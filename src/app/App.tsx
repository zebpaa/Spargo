import { Route, Routes } from "react-router"

import AuthProvider from "@shared/hoc/AuthProvider"
import PrivateRoute from "@shared/hoc/PrivateRoute"
import { Home, Login, Nds } from "@pages/index"
import Layout from "@widgets/Layout/Layout"

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route
						index
						element={
							<PrivateRoute>
								<Home />
							</PrivateRoute>
						}
					/>
					<Route path="login" element={<Login />} />
					<Route path="/api/nds/:id" element={<Nds />} />
				</Route>
			</Routes>
		</AuthProvider>
	)
}

export default App
