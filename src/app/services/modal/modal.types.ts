export type ModalType =
  'ADD_TO_CART';

export interface ModalPayloadMap {
  ADD_TO_CART: {
    title: string,
    price: number,
    imgUrl: string,
    quantity: number,
  };
}

export interface ModalState {
  type: ModalType | null;
  payload?: unknown;
}
