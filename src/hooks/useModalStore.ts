import {create} from 'zustand'

export type ModalType = 'importStudents' 

// you can extend this type if you have more modal

// export type ModalType = "..." | "...." | "...."

type ModalData = {
    
}

type ModalStore = {
    type: ModalType | null;
    data:ModalData;
    isOpen: boolean;
    onOpen:(type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type:null,
    data: {},
    isOpen: false,
    onClose: () => set({type: null, isOpen: false}),
    onOpen:(type, data = {}) => set({isOpen: true, type, data}),
}))