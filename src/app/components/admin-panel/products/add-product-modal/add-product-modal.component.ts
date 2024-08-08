import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaintingService, Painting } from 'src/app/services/painting.service';
import { AbstractModalComponent } from "../../../abstract/AbstractModal";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.css']
})
export class AddProductModalComponent extends AbstractModalComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;
  additionalFiles: File[] = []

  @Output() productAdded = new EventEmitter<Painting>();

  constructor(private fb: FormBuilder, private paintingService: PaintingService) {
    super();
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      price: [0, [Validators.required, Validators.min(0)]],
      image: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value || '');
      formData.append('description', this.productForm.get('description')?.value || '');
      formData.append('type', this.productForm.get('type')?.value || '');
      formData.append('price', this.productForm.get('price')?.value.toString() || '0');

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.additionalFiles.forEach((file, index) => {
        formData.append(`additionalImages`, file); // Append each additional image
      });

      this.paintingService.createPainting(formData).subscribe(
        (newPainting) => {
          this.productAdded.emit(newPainting);
          this.close();
        },
        (error) => {
          console.error('Failed to create product', error);
        }
      );
    }
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.productForm.patchValue({ image: this.selectedFile });
    }
  }

  onAdditionalImagesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.additionalFiles = Array.from(input.files);
    }
  }
}
