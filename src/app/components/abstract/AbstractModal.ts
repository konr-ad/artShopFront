import {Directive, EventEmitter, Input, Output} from '@angular/core';

@Directive()
export abstract class AbstractModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.closeModal.emit();
  }
}
