import type { ReactNode } from "react"

import { createContext, useState } from "react"
import { useNavigate } from "react-router"

import axios from "axios"

import routes from "../routes"

interface AuthContextType {
	token: string | null
	signin: () => Promise<void>
	signout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token") || null,
	)
	const navigate = useNavigate()

	const signin = async () => {
		if (token) {
			alert("Вы уже вошли!")
			return
		}

		const { data } = await axios.get(routes.getToken())

		if (data) {
			localStorage.setItem("token", data)
			setToken(data)
			navigate("/")
		}
	}

	const signout = () => {
		if (!token) {
			alert("Вы уже вышли!")
			return
		}

		localStorage.removeItem("token")
		setToken(null)
		navigate("/login")
	}

	const value = { token, signin, signout }

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
