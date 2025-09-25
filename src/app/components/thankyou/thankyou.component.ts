import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './thankyou.component.html',
  styleUrl: './thankyou.component.css',
})
export class ThankyouComponent implements OnInit {
  orderId?: string | null;
  email?: string | null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // 1) próba z query paramów (np. .../thankyou?orderId=123&email=foo@bar)
    this.route.queryParamMap.subscribe(params => {
      this.orderId = params.get('orderId') ?? this.orderId;
      this.email   = params.get('email')   ?? this.email;
    });

    // 2) fallback z history.state (jeśli wrócisz z własnego redirectu)
    const st = history.state as { orderId?: string; email?: string } | undefined;
    if (st) {
      this.orderId = this.orderId ?? st.orderId ?? null;
      this.email   = this.email   ?? st.email   ?? null;
    }

    // 3) ostatnia deska ratunku: sessionStorage (zapisz to po utworzeniu zamówienia)
    if (!this.orderId) this.orderId = sessionStorage.getItem('lastOrderId');
    if (!this.email)   this.email   = sessionStorage.getItem('lastOrderEmail');
  }
}
