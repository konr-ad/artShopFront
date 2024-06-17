import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Painting, PaintingService } from 'src/app/services/painting.service';
import { CartService } from 'src/app/services/cart.service'; // Import CartService

@Component({
  selector: 'app-painting-detail',
  templateUrl: './painting-detail.component.html',
  styleUrls: ['./painting-detail.component.css']
})
export class PaintingDetailComponent implements OnInit {
  painting: Painting | undefined;
  buttonText: string = "Add to Cart";
  isButtonDisabled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private paintingService: PaintingService,
    private cartService: CartService // Inject CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const paintingId = +params['id'];
      this.loadPainting(paintingId);
    });
  }

  loadPainting(id: number): void {
    this.paintingService.getPaintingById(id).subscribe((painting: Painting) => {
      this.painting = {
        ...painting,
        imageUrl: 'data:image/jpeg;base64,' + painting.image
      };
    });
  }

  addToCart(): void {
    if (this.painting) {
      this.cartService.addItem(this.painting);
      this.buttonText = "Added!";
      this.isButtonDisabled = true;

      setTimeout(() => {
        this.buttonText = "Add to Cart";
        this.isButtonDisabled = false;
      }, 2000);
    }
  }
}
