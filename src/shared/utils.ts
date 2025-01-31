import { DateTime } from "luxon"

export const getAuthHeader = (token: string) => {
	if (token) {
		return {
			headers: { Authorization: `Bearer ${token}` },
		}
	}

	return {}
}

export const getCurrentTimestampWithNanoseconds = () => {
	const now = DateTime.now().setZone("utc") // Устанавливаем временную зону UTC
	const nanoseconds = Math.floor(Math.random() * 9999) // Генерируем случайное значение для наносекунд (0-9998)
	// Форматируем строку в формате ISO 8601 с наносекундами
	return [
		`${now.toISO({ includeOffset: false })}${String(nanoseconds).padStart(4, "0")}Z`,
		`${now.toISO({ includeOffset: false })}${String(nanoseconds + 1).padStart(4, "0")}Z`,
	]
}