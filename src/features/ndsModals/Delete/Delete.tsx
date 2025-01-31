import type { Item } from "@shared/index";
import type { InputRef } from "antd";



import { useEffect, useRef, useState } from "react";



import { Button, Input, Modal } from "antd";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";



import { useAuth } from "@shared/hooks/useAuth";
import routes from "@shared/routes";
import { getAuthHeader } from "@shared/utils";



import cls from "./Delete.module.scss";


type DeleteProps = {
	open: boolean
	setOpen: (open: boolean) => void
	items: Item[]
	getAllElements: () => void
}

const Delete: React.FC<DeleteProps> = ({
	open,
	setOpen,
	items,
	getAllElements,
}) => {
	const inputRef = useRef<InputRef>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const schema = yup.object({
		id: yup
			.string()
			.trim()
			.required("Это обязательное поле")
			.min(3, "Минимальная длина: 3")
			.max(40, "Максимальная длина: 40")
			.oneOf(
				items.map((i: Item) => i.id),
				"Такого НДС нет",
			),
	})

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
		validationSchema: schema,
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
				getAllElements()
			} catch (e) {
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
				<label htmlFor="description" className={cls.label}>
					Описание:
				</label>
				<Input
					className={`${cls.input} ${formik.errors.id ? cls.isInvalid : ""}`}
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
				<p className={cls.invalid}>{formik.errors.id}</p>
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