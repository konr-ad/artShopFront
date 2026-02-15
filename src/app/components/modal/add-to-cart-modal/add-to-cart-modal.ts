import {AfterViewInit, Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ModalService} from "../../../services/modal/modal-service.service";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-add-to-cart-modal',
  standalone: true,
    imports: [
        RouterLink,
        TranslatePipe
    ],
  templateUrl: './add-to-cart-modal.html',
  styleUrl: './add-to-cart-modal.css',
})
export class AddToCartModalComponent implements AfterViewInit {
  protected modalService: ModalService = inject(ModalService);

  data = this.modalService.state().payload as {
    title: string,
    price: number;
    imgUrl: string;
    quantity: number;
  }

  entered = signal(false);

  ngAfterViewInit() {
    setTimeout(() => {
      this.entered.set(true);
    });
  }
}
