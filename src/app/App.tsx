import { Route, Routes } from "react-router"

import { Home, Login, Nds, NotFound } from "@pages/index"
import AuthProvider from "@shared/hoc/AuthProvider"
import PrivateRoute from "@shared/hoc/PrivateRoute"
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
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</AuthProvider>
	)
}

export default App
