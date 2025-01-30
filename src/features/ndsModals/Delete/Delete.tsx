import type { InputRef } from "antd";



import { useEffect, useRef, useState } from "react";



import { Button, Input, Modal } from "antd";
import axios from "axios";
import { useFormik } from "formik";



import { useAuth } from "@shared/hooks/useAuth";
import routes from "@shared/routes";
import { getAuthHeader } from "@shared/utils";



import cls from "./Delete.module.scss";


type DeleteProps = {
	open: boolean
	setOpen: (open: boolean) => void
}

const Delete: React.FC<DeleteProps> = ({ open, setOpen }) => {
	const inputRef = useRef<InputRef>(null)
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	const handleCancel = () => {
		setOpen(false)
	}

	const authContext = useAuth()

	if (!authContext) {
		return null
	}

	const { token } = authContext

	if (!token) {
		return null
	}

	const formik = useFormik({
		initialValues: {
			id: "",
		},
		onSubmit: async (values, { resetForm }) => {
			setLoading(true)
			if (values.id === null) {
				alert("ID не найден")
				console.log("ID не найден")
				return
			}

			const idString = values.id as string

			try {
				const response = await axios.delete(
					routes.deleteNds(idString),
					getAuthHeader(token),
				)
				console.log("response: ", response)
			} catch (e) {
				if (axios.isAxiosError(e)) {
					if (e.response?.status === 401) {
						alert("Авторизуйся, пожалуйста (завези токен)")
					} else if (e.response?.status === 404) {
						alert("Такого элемента нет")
					} else {
						console.log(e)
					}
				} else {
					console.error("Произошла ошибка:", e)
				}
			}

			resetForm()
			handleCancel()
			setLoading(false)
		},
	})

	return (
		<Modal open={open} onCancel={handleCancel} footer={[]}>
			<form onSubmit={formik.handleSubmit}>
				<h2>Удаление элемента навсегда</h2>
				<Input
					className={cls.input}
					placeholder="Id элемента:"
					name="id"
					type="text"
					autoComplete="off"
					size="large"
					onChange={formik.handleChange}
					value={formik.values.id}
					ref={inputRef}
					disabled={loading}
				/>
				<Button
					size="large"
					variant="outlined"
					htmlType="submit"
					disabled={loading}
				>
					Удалить
				</Button>
			</form>
		</Modal>
	)
}

export default Delete