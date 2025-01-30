import Add from "./Add/Add"
import Delete from "./Delete/Delete"
import Search from "./Search/Search"

export type ModalName = "adding" | "deleting" | "searching"

const modals: Record<ModalName, React.FC<any>> = {
	adding: Add,
	deleting: Delete,
	searching: Search,
}

export const getModal = (modalName: ModalName): React.FC<any> | undefined => {
	return modals[modalName]
}
