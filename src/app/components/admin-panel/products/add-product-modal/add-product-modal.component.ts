import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  PaintingService,
  CreatePaintingRequest,
  PaintingDetailsDto,
  PaintingType
} from 'src/app/services/painting.service';

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

  // Zgodne z EPaintingType w backendzie
  types: PaintingType[] = ['MONOTYPE','PRINT','OIL','ACRYLIC','WATERCOLOR','DIGITAL'];

  busy = false;
  errorMsg: string | null = null;

  // podglądy
  previewUrl: string | null = null;              // dla primary
  additionalPreviews: string[] = [];             // dla additional
  selectedPrimaryIndex = 0;                      // domyślnie 0 = primaryFile

  constructor(private fb: FormBuilder, private paintingService: PaintingService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      // state nieobowiązkowe – domyślnie AVAILABLE
      state: ['AVAILABLE'],
      descriptionPl: [''],
      descriptionEn: [''],
    });
  }

  /** Zbiór plików w kolejności: primary, ...additional */
  get allFiles(): File[] {
    const list: File[] = [];
    if (this.primaryFile) list.push(this.primaryFile);
    if (this.additionalFiles.length) list.push(...this.additionalFiles);
    return list;
  }

  /** Podglądy w tej samej kolejności co allFiles */
  get allPreviews(): string[] {
    const list: string[] = [];
    if (this.previewUrl) list.push(this.previewUrl);
    if (this.additionalPreviews.length) list.push(...this.additionalPreviews);
    return list;
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
      // jeżeli nie było primary — ustaw wybór na 0
      this.selectedPrimaryIndex = 0;
    } else {
      this.previewUrl = null;
      // jeśli nie ma primary, a są dodatkowe, niech primary będzie pierwszym z dodatkowych (index 0)
      this.selectedPrimaryIndex = 0;
    }
  }

  onAdditionalImagesChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    this.additionalFiles = input.files ? Array.from(input.files) : [];
    // podglądy
    this.additionalPreviews = [];
    this.additionalFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.additionalPreviews.push(reader.result as string);
      reader.readAsDataURL(file);
    });
    // jeśli nie ma primaryFile i wybrano dodatkowe – primaryIndex = 0 (pierwsze dodatkowe)
    if (!this.primaryFile && this.additionalFiles.length > 0) {
      this.selectedPrimaryIndex = 0;
    }
  }

  onSubmit() {
    if (this.productForm.invalid) return;
    if (this.allFiles.length === 0) {
      this.errorMsg = 'Dodaj przynajmniej jedno zdjęcie.';
      return;
    }

    const dto: CreatePaintingRequest = {
      name: this.productForm.value.name!,
      type: this.productForm.value.type!,
      state: this.productForm.value.state || 'AVAILABLE',
      price: Number(this.productForm.value.price),
      descriptionPl: this.productForm.value.descriptionPl || null,
      descriptionEn: this.productForm.value.descriptionEn || null,
    };

    // primaryIndex liczymy względem tablicy [primaryFile?, ...additionalFiles]
    // jeżeli nie ma primaryFile, wybrane radio odnosi się do pierwszego dodatkowego (index 0)
    const files = this.allFiles;
    let primaryIndex = this.selectedPrimaryIndex;

    this.busy = true;
    this.errorMsg = null;

    this.paintingService.createWithMedia(dto, files, primaryIndex).subscribe({
      next: (created) => {
        this.busy = false;
        this.productAdded.emit(created);
        this.close();
      },
      error: (e) => {
        this.busy = false;
        this.errorMsg = 'Nie udało się zapisać produktu.';
        console.error(e);
      }
    });
  }

  private resetForm() {
    this.productForm.reset({
      name: '',
      type: '',
      price: 0,
      state: 'AVAILABLE',
      descriptionPl: '',
      descriptionEn: '',
    });
    this.primaryFile = null;
    this.additionalFiles = [];
    this.previewUrl = null;
    this.additionalPreviews = [];
    this.selectedPrimaryIndex = 0;
    this.errorMsg = null;
  }
}
