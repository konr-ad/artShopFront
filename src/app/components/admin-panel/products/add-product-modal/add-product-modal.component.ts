import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  PaintingService,
  CreatePaintingRequest,
  PaintingDetailsDto,
  PaintingType
} from 'src/app/services/painting.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product-modal.component.html'
})
export class AddProductModalComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() productAdded = new EventEmitter<PaintingDetailsDto>();

  productForm: FormGroup;
  primaryFile: File | null = null;
  additionalFiles: File[] = [];

  // Upewnij się, że wartości są spójne z backendowym EPaintingType
  types: PaintingType[] = ['MONOTYPE','PRINT','OIL','ACRYLIC','WATERCOLOR','DIGITAL'];

  busy = false;
  errorMsg: string | null = null;
  previewUrl: string | null = null;

  constructor(private fb: FormBuilder, private paintingService: PaintingService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  close() {
    if (this.busy) return;
    this.resetForm();
    this.isOpen = false;
    this.closed.emit();
  }

  onPrimaryImageChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.primaryFile = file;

    // podgląd
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    } else {
      this.previewUrl = null;
    }
  }

  onAdditionalImagesChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    this.additionalFiles = input.files ? Array.from(input.files) : [];
  }

  onSubmit() {
    this.errorMsg = null;
    if (this.productForm.invalid) {
      this.errorMsg = 'Uzupełnij wymagane pola.';
      return;
    }
    if (!this.primaryFile) {
      this.errorMsg = 'Dodaj zdjęcie główne.';
      return;
    }

    const dto: CreatePaintingRequest = {
      name: this.productForm.value.name,
      description: this.productForm.value.description || undefined,
      type: this.productForm.value.type,
      price: Number(this.productForm.value.price),
      // state pomijamy — backend ma domyślne/optional
    };

    this.busy = true;

    // 1) create
    this.paintingService.adminCreate(dto).pipe(
      // 2) upload media (primary jako pierwszy, potem dodatkowe)
      switchMap(created => {
        const files: File[] = [this.primaryFile!, ...this.additionalFiles];
        const primaryIndex = 0; // pierwszy jest główny
        if (files.length === 0) return of(created);
        return this.paintingService.adminUploadMedia(created.id, files, primaryIndex)
          .pipe(switchMap(() => this.paintingService.details(created.id)));
      })
    ).subscribe({
      next: (details) => {
        this.productAdded.emit(details);
        this.busy = false;
        this.close();
      },
      error: (err) => {
        this.busy = false;
        this.errorMsg = 'Nie udało się dodać produktu. Sprawdź logi i połączenie.';
        console.error(err);
      }
    });
  }

  private resetForm() {
    this.productForm.reset({ name: '', description: '', type: '', price: 0 });
    this.primaryFile = null;
    this.additionalFiles = [];
    this.previewUrl = null;
    this.errorMsg = null;
  }
}
