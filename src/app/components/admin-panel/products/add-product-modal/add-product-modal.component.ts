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

  @Output() productAdded = new EventEmitter<Painting>();

  constructor(private fb: FormBuilder, private paintingService: PaintingService) {
    super();
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      state: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      image: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();

      // Safely append each field to FormData
      Object.entries(this.productForm.value).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Check for the image field and ensure it's a File type
          if (key === 'image' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value as string); // Cast as string if not a File
          }
        }
      });

      this.paintingService.createPainting(formData).subscribe((newPainting) => {
        this.productAdded.emit(newPainting);
        this.close();
      });
    }
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.productForm.patchValue({ image: input.files[0] });
    }
  }
}
