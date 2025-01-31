import type { Item } from "@shared/index"
import type { InputRef } from "antd"

import React, { useEffect, useRef, useState } from "react"

import { Button, Input, Modal } from "antd"
import axios from "axios"
import { useFormik } from "formik"
import { v4 as uuidv4 } from "uuid"
import * as yup from "yup"

import { useAuth } from "@shared/hooks/useAuth"
import {
	getAuthHeader,
	getCurrentTimestampWithNanoseconds,
} from "@shared/utils"

import routes from "../../../shared/routes"
import cls from "./Add.module.scss"

type AddProps = {
	open: boolean
	setOpen: (open: boolean) => void
	items: Item[]
	getAllElements: () => void
}

const Add: React.FC<AddProps> = ({ open, setOpen, items, getAllElements }) => {
	const inputRef = useRef<InputRef>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const schema = yup.object({
		name: yup
			.string()
			.trim()
			.required("Это обязательное поле")
			.min(3, "Минимальная длина: 3")
			.max(40, "Максимальная длина: 40")
			.notOneOf(
				items.map((i: Item) => i.name),
				"Такой НДС уже есть",
			),
		description: yup
			.string()
			.trim()
			.required("Это обязательное поле")
			.min(3, "Минимальная длина: 3")
			.max(40, "Максимальная длина: 40"),
		value: yup
			.number()
			.integer("Значение должно быть целым")
			.required("Это обязательное поле"),
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
			name: "",
			description: "",
			value: "",
		},
		validationSchema: schema,
		onSubmit: async (values, { resetForm }) => {
			setLoading(true)
			const [createdAt, updatedAt] = getCurrentTimestampWithNanoseconds()

			const newNds = {
				id: uuidv4(),
				name: values.name,
				description: values.description,
				value: values.value,
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
				getAllElements()
			} catch (e) {
				if (axios.isAxiosError(e)) {
					if (e.response?.status === 401) {
						alert("Авторизуйся, пожалуйста")
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
				<label htmlFor="name" className={cls.label}>
					Название:
				</label>
				<Input
					className={`${cls.input} ${formik.errors.name ? cls.isInvalid : ""}`}
					name="name"
					type="text"
					size="large"
					onChange={formik.handleChange}
					value={formik.values.name}
					ref={inputRef}
					autoComplete="off"
					disabled={loading}
				/>
				<p className={cls.invalid}>{formik.errors.name}</p>
				<label htmlFor="description" className={cls.label}>
					Описание:
				</label>
				<Input
					className={`${cls.input} ${formik.errors.description ? cls.isInvalid : ""}`}
					name="description"
					type="text"
					size="large"
					onChange={formik.handleChange}
					value={formik.values.description}
					autoComplete="off"
					disabled={loading}
				/>
				<p className={cls.invalid}>{formik.errors.description}</p>
				<label htmlFor="value" className={cls.label}>
					Значение:
				</label>
				<Input
					className={`${cls.input} ${formik.errors.value ? cls.isInvalid : ""}`}
					name="value"
					type="number"
					size="large"
					onChange={formik.handleChange}
					value={formik.values.value}
					autoComplete="off"
					disabled={loading}
				/>
				<p className={cls.invalid}>{formik.errors.value}</p>
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
