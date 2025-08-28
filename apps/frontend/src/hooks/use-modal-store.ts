import { create } from 'zustand';
import createSubject from '@/lib/subject';

export enum MODAL_STATUS {
  OPEN = 'open',
  CLOSE = 'close',
}

export type ModalType = 'alertDelete';

interface ModalData {
  alertDeleteData?: {
    title?: string;
    description?: string;
    detail: Record<string, any>;
  };
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: (data?: any) => void;
}

type ModalEvent = {
  type: ModalType;
  status: MODAL_STATUS;
  data: any;
};
export const modalEventSubject = createSubject<ModalEvent>();
export const useModal = create<ModalStore>((set, get) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: (data?: any) => {
    if (get().type) {
      modalEventSubject.next({
        type: get().type as ModalType,
        status: MODAL_STATUS.CLOSE,
        data: data,
      });
    }
    set({ type: null, isOpen: false });
  },
}));
