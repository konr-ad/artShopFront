import { Injectable, signal } from '@angular/core';
import {ModalPayloadMap, ModalState, ModalType} from './modal.types';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  private modalState = signal<ModalState>({
    type: null,
  });

  readonly state = this.modalState.asReadonly()

  open(type: ModalType, payload: unknown) {
    this.modalState.set({
      type: type,
      payload: payload,
    });
  }

  close() {
    this.modalState.set({
      type: null,
    })
  }

}
