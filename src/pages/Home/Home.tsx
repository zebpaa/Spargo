import type { ModalName } from "../../features/ndsModals/index"
import type { Item } from "@shared/index"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

import { LoadingOutlined } from "@ant-design/icons"
import { Button, Spin, Table } from "antd"
import axios from "axios"

import { useAuth } from "@shared/hooks/useAuth"
import { getAuthHeader } from "@shared/utils"

import { getModal } from "../../features/ndsModals/index"
import routes from "../../shared/routes"
import cls from "./Home.module.scss"

const Home = () => {
	const [items, setItems] = useState<Item[]>([])
	const [loading, setLoading] = useState(false)
	const [activeTab, setActiveTab] = useState<"deleted" | "undeleted" | null>(
		null,
	)
	const [open, setOpen] = useState(false)
	const [modalType, setModalType] = useState<ModalName | null>(null)

	const navigate = useNavigate()

	useEffect(() => {
		getAllElements()
	}, [])

	const authContext = useAuth()

	if (!authContext) {
		return null
	}

	const { token } = authContext

	if (!token) {
		return null
	}

	const handleOpenModal = (type: ModalName) => {
		setModalType(type)
		setOpen(true)
	}

	const renderModal = () => {
		if (!modalType) {
			return null
		}

		const Component = getModal(modalType)

		if (!Component) {
			return null
		}

		return (
			<Component
				open={open}
				setOpen={setOpen}
				items={items}
				getAllElements={getAllElements}
			/>
		)
	}

	const getAllElements = async () => {
		setLoading(true)
		setItems([])
		try {
			const { data } = await axios.get(routes.getAllNds(), getAuthHeader(token))

			setActiveTab(null)
			if (data) {
				setItems(data)
			}
			console.log("data: ", data)
		} catch (e) {
			// Приведение типа к AxiosError
			if (axios.isAxiosError(e)) {
				if (e.response?.status === 401) {
					alert("Авторизуйся, пожалуйста")
				} else if (e.response?.status === 404) {
					alert("Такого элемента нет")
				} else {
					console.log(e)
				}
			} else {
				console.error("Произошла ошибка:", e)
			}
		} finally {
			setLoading(false)
		}
	}

	const handleNavigateToNds = (id: string) => {
		navigate(`api/nds/${id}`)
	}

	const columns = [
		{
			title: "Id",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Название",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Описание",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "Значение",
			dataIndex: "value",
			key: "value",
		},
	]

	const handleDeletedTab = () => {
		if (activeTab === "deleted") {
			setActiveTab(null)
		} else {
			setActiveTab("deleted")
		}
	}

	const handleUnDeletedTab = () => {
		if (activeTab === "undeleted") {
			setActiveTab(null)
		} else {
			setActiveTab("undeleted")
		}
	}

	return (
		<div className={cls.homepage}>
			<Button size="large" variant="outlined" onClick={getAllElements}>
				Обновление списка
			</Button>
			<div className={cls.tab}>
				<Button
					type="primary"
					size="large"
					variant="outlined"
					style={
						activeTab === "deleted"
							? { backgroundColor: "#5aa575" }
							: { backgroundColor: "#5b78a4" }
					}
					onClick={handleDeletedTab}
				>
					Удаленные
				</Button>
				<Button
					type="primary"
					size="large"
					variant="outlined"
					style={
						activeTab === "undeleted"
							? { backgroundColor: "#5aa575" }
							: { backgroundColor: "#5b78a4" }
					}
					onClick={handleUnDeletedTab}
				>
					Неудаленные
				</Button>
			</div>
			{loading ? (
				<div className={cls.loader}>
					<Spin
						indicator={
							<LoadingOutlined
								style={{
									fontSize: 48,
								}}
								spin
							/>
						}
					/>
				</div>
			) : (
				<Table
					dataSource={items
						.filter((item) => {
							if (activeTab === "undeleted") {
								return item.deletedAt === null
							}
							if (activeTab === "deleted") {
								return item.deletedAt !== null
							}
							return item
						})
						.map((item) => ({ ...item, key: item.id }))} // Добавляем уникальный ключ
					columns={columns}
					onRow={(item) => ({
						onClick: () => handleNavigateToNds(item.id), // Обработчик клика по строке
						style: { cursor: "pointer" }, // Стиль курсора
					})}
					pagination={{
						position: ["bottomCenter"], // Позиция пагинации
					}}
				/>
			)}

			<div className={cls.btnGroup}>
				<Button
					className={cls.addBtn}
					size="large"
					variant="outlined"
					htmlType="submit"
					onClick={() => handleOpenModal("adding")}
				>
					Добавить
				</Button>

				{renderModal()}
				<Button
					size="large"
					variant="outlined"
					htmlType="submit"
					onClick={() => handleOpenModal("deleting")}
				>
					Жесткое удаление
				</Button>
			</div>
		</div>
	)
}

export default Home
