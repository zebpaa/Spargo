import type { InputRef } from "antd";
import type { FormEvent } from "react";



import React, { useEffect, useRef, useState } from "react";



import { Button, Input, Modal } from "antd";
import axios from "axios";



import { useAuth } from "@shared/hooks/useAuth";
import { getAuthHeader } from "@shared/utils";



import routes from "../../../shared/routes";
import cls from "./Search.module.scss";


type SearchProps = {
	open: boolean
	setOpen: (open: boolean) => void
}

const Search: React.FC<SearchProps> = ({ open, setOpen }) => {
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

	const getElementById = async (e: FormEvent<HTMLFormElement>) => {
		setLoading(true)
		e.preventDefault()
		const form = e.target as HTMLFormElement
		const id = new FormData(form).get("id")

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

			console.log("response: ", response.data)
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

		// resetForm()
		handleCancel()
		setLoading(false)
	}

	return (
		<>
			<Modal open={open} onCancel={handleCancel} footer={[]}>
				<form onSubmit={(e) => getElementById(e)}>
					<h2>Поиск nds по id</h2>
					<Input
						className={cls.input}
						placeholder="Id элемента:"
						name="id"
						type="text"
						autoComplete="off"
						size="large"
						ref={inputRef}
						disabled={loading}
					/>
					<Button
						size="large"
						variant="outlined"
						htmlType="submit"
						disabled={loading}
					>
						Получить
					</Button>
				</form>
			</Modal>
		</>
	)
}

export default Search