import { Component, OnInit } from '@angular/core';
import { PaintingService, Painting } from '../../services/painting.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  paintings: Painting[] = [];
  newPainting: Partial<Painting> = {
    type: '',
    state: '',
    name: '',
    price: 0,
    image: undefined
  };
  selectedFile: File | undefined;

  constructor(private paintingService: PaintingService) {}

  ngOnInit(): void {
    this.paintingService.getPaintings().subscribe((data: Painting[]) => {
      this.paintings = data.map(painting => ({
        ...painting,
        imageUrl: 'data:image/jpeg;base64,' + painting.image
      }));
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(form: NgForm): void {
    const formData = new FormData();
    formData.append('type', this.newPainting.type || '');
    formData.append('state', this.newPainting.state || '');
    formData.append('name', this.newPainting.name || '');
    formData.append('price', this.newPainting.price?.toString() || '0');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.paintingService.createPainting(formData).subscribe(
      (response) => {
        console.log('Painting created successfully', response);
        this.paintings.push({
          ...response,
          imageUrl: 'data:image/jpeg;base64,' + response.image
        }); // Add the new painting to the list with image URL
        form.reset(); // Reset the form
        this.selectedFile = undefined; // Reset the file input
      },
      (error) => {
        console.error('Failed to create painting', error);
      }
    );
  }
}
