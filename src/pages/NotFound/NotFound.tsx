import { Link } from "react-router"

import { Button, Card, Flex, Image } from "antd"

import { useAuth } from "@shared/hooks/useAuth"

const NotFound: React.FC = () => {
	const authContext = useAuth()

	// Проверяем, что authContext не undefined
	if (!authContext) {
		return null // Или можно вернуть какой-то загрузочный компонент
	}

	const { token, signin } = authContext

	return (
		<Flex justify="center">
			<Card
				style={{
					width: 500,
					fontSize: "20px",
					textAlign: "center",
				}}
				title={<span style={{ fontSize: "24px" }}>Страница не найдена</span>}
			>
				<Image preview={false} src="./404.gif"></Image>
				{token ? (
					<Link to="/">
						<Button style={{ fontSize: "20px" }} size="large" type="link">
							Перейти на главную
						</Button>
					</Link>
				) : (
					<p>Необходимо авторизоваться!</p>
				)}
				{!token && (
					<Button size="large" variant="outlined" onClick={signin}>
						Войти
					</Button>
				)}
			</Card>
		</Flex>
	)
}

export default NotFound
