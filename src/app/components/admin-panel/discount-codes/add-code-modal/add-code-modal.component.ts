import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DiscountCodeCreateRequest, DiscountCodeDto, DiscountCodeService } from '../../../../services/discount-code.service';

@Component({
  selector: 'app-add-code-modal',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgClass],
  templateUrl: './add-code-modal.component.html',
  styleUrl: './add-code-modal.component.css',
})
export class AddCodeModalComponent implements OnInit {
  @Output() discountCodeAdded = new EventEmitter<DiscountCodeDto>();
  @Output() closeModal = new EventEmitter<void>();

  isOpen = false;
  form!: FormGroup;
  busy = false;
  errorMsg: string | null = null;

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        code: ['', [Validators.required]],
        discountType: ['PERCENTAGE', [Validators.required]],
        discountValue: [0, [Validators.required, Validators.min(1)]],
        minimumOrderValue: [0, [Validators.required, Validators.min(0)]],
        usageLimit: [1, [Validators.required, Validators.min(1)]],
        validFrom: [this.nowLocalString(), [Validators.required]],
        validTo:   [this.nowLocalString(), [Validators.required]]
      },
      { validators: [this.dateRangeValidator] }
    );

    // Dynamiczna walidacja dla procentu (1–100)
    this.form.get('discountType')!.valueChanges.subscribe(() => this.updateDiscountValidators());
    this.updateDiscountValidators();
  }

  constructor(private fb: FormBuilder, private discountCodeService: DiscountCodeService) {}

  open()  { this.isOpen = true; }
  close() {
    if (!this.busy) {
      this.isOpen = false;
      this.form.reset(this.defaultValues());
      this.closeModal.emit();
    }
  }

  private updateDiscountValidators() {
    const ctrl = this.form.get('discountValue')!;
    const isPercentage = this.form.get('discountType')!.value === 'PERCENTAGE';
    ctrl.clearValidators();
    ctrl.addValidators([Validators.required, Validators.min(1)]);
    if (isPercentage) ctrl.addValidators([Validators.max(100)]);
    ctrl.updateValueAndValidity();
  }

  private dateRangeValidator = (group: AbstractControl): ValidationErrors | null => {
    const from = group.get('validFrom')?.value;
    const to   = group.get('validTo')?.value;
    if (!from || !to) return null;
    return new Date(to).getTime() >= new Date(from).getTime() ? null : { range: true };
  };

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.busy = true; this.errorMsg = null;

    const v = this.form.value;
    const payload: DiscountCodeCreateRequest = {
      code: String(v.code).trim(),
      discountType: v.discountType,
      discountValue: Number(v.discountValue),
      minimumOrderValue: Number(v.minimumOrderValue),
      isActive: true,
      validFrom: v.validFrom,
      validTo: v.validTo
    };

    this.discountCodeService.createDiscountCode(payload).subscribe({
      next: (created) => { this.busy = false; this.discountCodeAdded.emit(created); this.close(); },
      error: (e) => { this.busy = false; this.errorMsg = 'Nie udało się utworzyć kodu rabatowego.'; console.error(e); }
    });
  }

  // Helpers
  nowLocalString(): string {
    const d = new Date();
    d.setSeconds(0, 0);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  private defaultValues() {
    const now = this.nowLocalString();
    return {
      code: '', discountType: 'PERCENTAGE', discountValue: 0,
      minimumOrderValue: 0, validFrom: now, validTo: now
    };
  }

  get f() { return this.form.controls; }
  get isPercentage() { return this.form.get('discountType')!.value === 'PERCENTAGE'; }

}
