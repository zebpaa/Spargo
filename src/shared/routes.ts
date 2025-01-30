const BASE_URL = "http://195.133.39.82:8080"
const API_URL = `${BASE_URL}/api/nds`

export default {
	getToken: () => [BASE_URL, "token"].join("/"),
	getAllNds: () => API_URL,
	getNdsById: (id: string) => [API_URL, id].join("/"),
	createNds: () => API_URL,
	updateNds: (id: string) => [API_URL, id].join("/"),
	deleteNds: (id: string) => [API_URL, id].join("/"),
}
