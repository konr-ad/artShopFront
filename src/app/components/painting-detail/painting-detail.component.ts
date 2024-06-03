import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Painting, PaintingService } from 'src/app/services/painting.service';

@Component({
  selector: 'app-painting-detail',
  templateUrl: './painting-detail.component.html',
  styleUrls: ['./painting-detail.component.css']
})
export class PaintingDetailComponent implements OnInit {
  painting: Painting | undefined;

  constructor(
    private route: ActivatedRoute,
    private paintingService: PaintingService
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
}
