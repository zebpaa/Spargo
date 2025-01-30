import Add from "./Add/Add"
import Delete from "./Delete/Delete"

export type ModalName = "adding" | "deleting"

const modals: Record<ModalName, React.FC<any>> = {
	adding: Add,
	deleting: Delete,
}

export const getModal = (modalName: ModalName): React.FC<any> | undefined => {
	return modals[modalName]
}
