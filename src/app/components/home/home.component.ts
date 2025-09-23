import { Component, OnInit } from '@angular/core';
import { PaintingService, Painting } from '../../services/painting.service';
import { NgForm } from '@angular/forms';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  paintings: Painting[] = [];

  pageIndex = 0;
  pageSize = 10;
  totalPages = 0;
  loading = false;
  error?: string;

  constructor(private paintingService: PaintingService, private router: Router) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  viewPainting(id: number) {
    this.router.navigate(['/painting', id]);
  }

  loadPage(page: number) {
    this.loading = true;
    this.error = undefined;

    this.paintingService.getPaintingsPage({
      page,
      size: this.pageSize,
      sort: 'createdAt,desc'
      // tutaj możesz dorzucić q/type/minPrice/maxPrice jeśli chcesz filtrów na home
    }).subscribe({
      next: (res) => {
        // ADAPTER: mapujemy PaintingListItem -> Twój stary Painting (tylko pod to, co używasz w widoku)
        this.paintings = res.content.map(item => ({
          id: item.id,
          type: item.type,
          state: item.state ?? '',
          name: item.name,
          description: '',   // brak w liście – zostawiamy pusty
          price: item.price,
          image: '',         // nie używane już
          imageUrl: item.thumbnailUrl ?? 'assets/placeholder.png'
        }));
        this.pageIndex = res.number;
        this.pageSize = res.size;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => {
        this.error = 'Nie udało się pobrać obrazów.';
        this.loading = false;
      }
    });
  }

  nextPage() { if (this.pageIndex + 1 < this.totalPages) this.loadPage(this.pageIndex + 1); }
  prevPage() { if (this.pageIndex > 0) this.loadPage(this.pageIndex - 1); }

}
