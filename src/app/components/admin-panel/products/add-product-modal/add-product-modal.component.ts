import {Component, EventEmitter, Input, Output, HostListener, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaintingService, CreatePaintingRequest, PaintingDetailsDto, PaintingType } from 'src/app/services/painting.service';

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
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() editModel?: PaintingDetailsDto;

  img = (u: string) => this.paintingService.imageUrl(u) ?? u;

  productForm: FormGroup;
  primaryFile: File | null = null;
  additionalFiles: File[] = [];

  types: PaintingType[] = ['MONOTYPE','PRINT','OIL','ACRYLIC','WATERCOLOR','DIGITAL'];

  busy = false;
  errorMsg: string | null = null;

  previewUrl: string | null = null;
  additionalPreviews: string[] = [];
  selectedPrimaryIndex = 0;

  constructor(private fb: FormBuilder, private paintingService: PaintingService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      state: ['AVAILABLE'],
      descriptionPl: [''],
      descriptionEn: [''],
    });
  }

  get allFiles(): File[] {
    const list: File[] = [];
    if (this.primaryFile) list.push(this.primaryFile);
    if (this.additionalFiles.length) list.push(...this.additionalFiles);
    return list;
  }
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

  @HostListener('document:keydown.escape')
  onEsc() { if (this.isOpen) this.close(); }

  onDragOver(e: DragEvent) { e.preventDefault(); }
  onDrop(e: DragEvent) {
    e.preventDefault();
    if (!e.dataTransfer) return;
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;

    // pierwszy plik traktujemy jako primary jeśli nie wybrano
    if (!this.primaryFile) {
      const [first, ...rest] = files;
      this.primaryFile = first;
      this.readPreview(first, true);
      this.additionalFiles.push(...rest);
      rest.forEach(f => this.readPreview(f, false));
      this.selectedPrimaryIndex = 0;
    } else {
      this.additionalFiles.push(...files);
      files.forEach(f => this.readPreview(f, false));
    }
  }

  private readPreview(file: File, isPrimary: boolean) {
    const reader = new FileReader();
    reader.onload = () => {
      if (isPrimary) this.previewUrl = reader.result as string;
      else this.additionalPreviews.push(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onPrimaryImageChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.primaryFile = file;
    if (file) {
      this.readPreview(file, true);
      this.selectedPrimaryIndex = 0;
    } else {
      this.previewUrl = null;
      this.selectedPrimaryIndex = 0;
    }
  }

  onAdditionalImagesChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    this.additionalFiles = files;
    this.additionalPreviews = [];
    files.forEach(f => this.readPreview(f, false));
    if (!this.primaryFile && files.length > 0) {
      this.selectedPrimaryIndex = 0;
    }
  }

  ngOnChanges(ch: SimpleChanges) {
    if (ch['editModel'] && this.mode === 'edit' && this.editModel) {
      // wypełnij formularz
      this.productForm.patchValue({
        name: this.editModel.name,
        type: this.editModel.type,
        price: this.editModel.price,
        state: this.editModel.state ?? 'AVAILABLE',
        descriptionPl: this.editModel.description ?? '',
        descriptionEn: '' // jeśli trzymasz rozdzielnie — dostosuj
      });

      // wyczyść ewentualne nowe pliki/preview (bo na start pokazujemy istniejące)
      this.primaryFile = null;
      this.additionalFiles = [];
      this.previewUrl = null;
      this.additionalPreviews = [];
      this.selectedPrimaryIndex = 0;
    }
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const dto: CreatePaintingRequest = {
      name: this.productForm.value.name!,
      type: this.productForm.value.type!,
      state: this.productForm.value.state || 'AVAILABLE',
      price: Number(this.productForm.value.price),
      descriptionPl: this.productForm.value.descriptionPl || null,
      descriptionEn: this.productForm.value.descriptionEn || null,
    };

    const files = this.allFiles;
    let primaryIndex = this.selectedPrimaryIndex;

    this.busy = true; this.errorMsg = null;

    this.paintingService.createWithMedia(dto, files, primaryIndex).subscribe({
      next: (created) => { this.busy = false; this.productAdded.emit(created); this.close(); },
      error: (e) => { this.busy = false; this.errorMsg = 'Nie udało się zapisać produktu.'; console.error(e); }
    });
  }

  private resetForm() {
    this.productForm.reset({
      name: '', type: '', price: 0, state: 'AVAILABLE', descriptionPl: '', descriptionEn: '',
    });
    this.primaryFile = null;
    this.additionalFiles = [];
    this.previewUrl = null;
    this.additionalPreviews = [];
    this.selectedPrimaryIndex = 0;
    this.errorMsg = null;
  }
}
