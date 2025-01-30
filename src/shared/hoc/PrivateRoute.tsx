import type { ReactNode } from "react"

import { Navigate, useLocation } from "react-router"

interface PrivateRouteType {
	children: ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteType) => {
	const location = useLocation()

	const token = localStorage.getItem("token")
	if (!token) {
		return <Navigate to="/login" state={{ from: location }} />
	}

	return children
}

export default PrivateRoute
