import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {
  @Input() order: any; //TODO do dokonczenia
}
