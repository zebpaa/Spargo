import { Link, Outlet } from "react-router"

import { Button, Flex } from "antd"

import { useAuth } from "@shared/hooks/useAuth"

import cls from "./Layout.module.scss"

const Layout = () => {
	const authContext = useAuth()

	// Проверяем, что authContext не undefined
	if (!authContext) {
		return null // Или можно вернуть какой-то загрузочный компонент
	}

	const { token, signout } = authContext

	return (
		<>
			<header className={cls.header}>
				<nav className={cls.header__menu}>
					<Link to="/">Главная</Link>
					{!token ? (
						""
					) : (
						<Button size="large" variant="outlined" onClick={signout}>
							Выйти
						</Button>
					)}
				</nav>
			</header>
			<main className={cls.container}>
				<Outlet />
			</main>
			<footer />
		</>
	)
}

export default Layout
