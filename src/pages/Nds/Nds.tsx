import type { CheckboxProps, InputRef } from "antd"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"

import { LoadingOutlined } from "@ant-design/icons"
import { Button, Checkbox, Descriptions, Input, Spin } from "antd"
import axios from "axios"
import { useFormik } from "formik"
import * as yup from "yup"

import { useAuth } from "@shared/hooks/useAuth"
import routes from "@shared/routes"
import {
	getAuthHeader,
	getCurrentTimestampWithNanoseconds,
} from "@shared/utils"

import cls from "./Nds.module.scss"

interface Item {
	name: string
	description: string
	id: string
	value: number
	deletedAt: string
	createdAt: string
	updatedAt: string
}

const Nds: React.FC = () => {
	const { id } = useParams()
	const [item, setItem] = useState<Item | null>(null)
	const inputRef = useRef<InputRef>(null)
	const [loading, setLoading] = useState(false)
	const authContext = useAuth()
	const navigate = useNavigate()
	const [checked, setChecked] = useState<boolean>(false)

	const schema = yup.object({
		name: yup
			.string()
			.trim()
			.required("Это обязательное поле")
			.min(3, "Минимальная длина: 3")
			.max(40, "Максимальная длина: 40"),
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

	if (!authContext) {
		return null
	}

	const { token } = authContext

	if (!token) {
		return null
	}

	useLayoutEffect(() => {
		getElementById(id)
	}, [id])

	useEffect(() => {
		inputRef?.current?.focus()
	}, [])

	const formik = useFormik({
		initialValues: {
			name: item?.name,
			description: item?.description,
			value: item?.value,
			deletedAt: item?.deletedAt,
			createdAt: item?.createdAt,
			updatedAt: item?.updatedAt,
		},
		validationSchema: schema,
		onSubmit: async (values, { resetForm }) => {
			const idString = id as string
			const [deletedAt, updatedAt] = getCurrentTimestampWithNanoseconds()

			const getDeletedProp = () => {
				if (item?.deletedAt === null) {
					return checked ? deletedAt : null
				} else {
					return checked ? null : deletedAt
				}
			}

			const newNds = {
				id: idString,
				name: values.name,
				description: values.description,
				value: values.value,
				deletedAt: getDeletedProp(),
				createdAt: item?.createdAt,
				updatedAt: updatedAt,
			}

			try {
				const response = await axios.put(
					routes.updateNds(idString),
					newNds,
					getAuthHeader(token),
				)
				console.log(response)
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
			navigate("/")
		},
	})

	const getElementById = async (id: string | undefined) => {
		setLoading(true)
		if (id === null) {
			alert("ID не найден")
			return
		}

		const idString = id as string

		try {
			const response = await axios.get(
				routes.getNdsById(idString),
				getAuthHeader(token),
			)

			setItem(response.data)

			console.log("response: ", response.data)
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
		setLoading(false)
	}

	const onChange: CheckboxProps["onChange"] = (e) => {
		setChecked(e.target.checked)
	}

	return (
		<div>
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
				<div>
					<Descriptions title="Редактирование">
						<Descriptions.Item label="Name">{item?.name}</Descriptions.Item>
						<Descriptions.Item label="Description">
							{item?.description}
						</Descriptions.Item>
						<Descriptions.Item label="Value">{item?.value}</Descriptions.Item>
						<Descriptions.Item label="DeletedAt">
							{item?.deletedAt}
						</Descriptions.Item>
						<Descriptions.Item label="CreatedAt">
							{item?.createdAt}
						</Descriptions.Item>
						<Descriptions.Item label="UpdatedAt">
							{item?.updatedAt}
						</Descriptions.Item>
						<Descriptions.Item label="Id">{item?.id}</Descriptions.Item>
					</Descriptions>
				</div>
			)}

			<form onSubmit={formik.handleSubmit}>
				<div className={cls.control}>
					<label htmlFor="name">Название:</label>
					<Input
						className={`${cls.input} ${formik.errors.name ? cls.isInvalid : ""}`}
						name="name"
						type="text"
						size="large"
						onChange={formik.handleChange}
						value={formik.values.name}
						ref={inputRef}
						autoComplete="off"
					/>
				</div>
				<p className={cls.invalid}>{formik.errors.name}</p>
				<div className={cls.control}>
					<label htmlFor="description">Описание:</label>
					<Input
						className={`${cls.input} ${formik.errors.description ? cls.isInvalid : ""}`}
						name="description"
						type="text"
						size="large"
						onChange={formik.handleChange}
						value={formik.values.description}
						autoComplete="off"
					/>
				</div>
				<p className={cls.invalid}>{formik.errors.description}</p>
				<div className={cls.control}>
					<label htmlFor="value">Значение:</label>
					<Input
						className={`${cls.input} ${formik.errors.value ? cls.isInvalid : ""}`}
						name="value"
						type="number"
						size="large"
						onChange={formik.handleChange}
						value={formik.values.value}
						autoComplete="off"
					/>
				</div>
				<p className={cls.invalid}>{formik.errors.value}</p>
				<div className={cls.control}>
					{item?.deletedAt !== null ? (
						<label htmlFor="">Восстановить</label>
					) : (
						<label htmlFor="">Мягкое удаление:</label>
					)}
					<Checkbox onChange={onChange} />
				</div>

				<Button size="large" htmlType="submit">
					Сохранить
				</Button>
			</form>
		</div>
	)
}

export default Nds
