import type { InputRef } from "antd";



import React, { useEffect, useRef, useState } from "react";



import { Button, Input, Modal } from "antd";
import axios from "axios";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";



import { useAuth } from "@shared/hooks/useAuth";
import { getAuthHeader, getCurrentTimestampWithNanoseconds, getRandom } from "@shared/utils";



import routes from "../../../shared/routes";
import cls from "./Add.module.scss";


type AddProps = {
	open: boolean
	setOpen: (open: boolean) => void
}

const Add: React.FC<AddProps> = ({ open, setOpen }) => {
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
			name: "",
			description: "",
		},
		onSubmit: async (values, { resetForm }) => {
			setLoading(true)
			const [createdAt, updatedAt] = getCurrentTimestampWithNanoseconds()

			const newNds = {
				id: uuidv4(),
				name: values.name,
				description: values.description,
				value: getRandom(1, 100),
				deletedAt: null,
				createdAt,
				updatedAt,
			}
			console.log(newNds)
			try {
				const result = await axios.post(
					routes.createNds(),
					newNds,
					getAuthHeader(token),
				)
				console.log("result: ", result)
			} catch (e) {
				if (axios.isAxiosError(e)) {
					if (e.response?.status === 401) {
						alert("Авторизуйся, пожалуйста (завези токен)")
					} else {
						console.log(e)
					}
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
				<h2>Новый элемент</h2>
				<Input
					className={cls.input}
					placeholder="Название:"
					name="name"
					type="text"
					size="large"
					onChange={formik.handleChange}
					value={formik.values.name}
					ref={inputRef}
					autoComplete="off"
					disabled={loading}
				/>
				<Input
					className={cls.input}
					placeholder="Описание:"
					name="description"
					type="text"
					size="large"
					onChange={formik.handleChange}
					value={formik.values.description}
					autoComplete="off"
					disabled={loading}
				/>
				<Button
					size="large"
					variant="outlined"
					htmlType="submit"
					disabled={loading}
				>
					Создать
				</Button>
			</form>
		</Modal>
	)
}

export default Add