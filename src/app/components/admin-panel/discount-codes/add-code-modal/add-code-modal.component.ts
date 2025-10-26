import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractModalComponent } from '../../../abstract/AbstractModal';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DiscountCodeCreateRequest,
  DiscountCodeDto,
  DiscountCodeService
} from '../../../../services/discount-code.service';
import { Painting } from '../../../../services/painting.service';

@Component({
  selector: 'app-add-code-modal',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgClass],
  templateUrl: './add-code-modal.component.html',
  styleUrl: './add-code-modal.component.css',
})
export class AddCodeModalComponent extends AbstractModalComponent implements OnInit {
  discountCodeForm!: FormGroup;

  @Output() discountCodeAdded = new EventEmitter<DiscountCodeDto>();

  constructor(
    private fb: FormBuilder,
    private discountCodeService: DiscountCodeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.discountCodeForm = this.fb.group({
      code: ['', [Validators.required]],
      discountValue: [0, [Validators.required, Validators.min(1)]],
      discountType: ['PERCENTAGE', [Validators.required]],
      minimumOrderValue: [0, [Validators.required, Validators.min(0)]],
      usageLimit: [1, [Validators.required, Validators.min(1)]],
      validFrom: [this.todayString()], // helper do 'YYYY-MM-DD'
      validTo: [this.todayString()],
      isActive: [true],
    });
  }

  onSubmit() {
    if (this.discountCodeForm.invalid) return;

    const v = this.discountCodeForm.value;
    const payload: DiscountCodeCreateRequest = {
      code: v.code,
      discountType: v.discountType, // 'PERCENTAGE' | 'FIXED'
      discountValue: Number(v.discountValue),
      minimumOrderValue: Number(v.minimumOrderValue),
      isActive: !!v.isActive,
      usageLimit: Number(v.usageLimit),
      validFrom: v.validFrom, // 'YYYY-MM-DD'
      validTo: v.validTo
    };

    this.discountCodeService.createDiscountCode(payload).subscribe({
      next: (created) => {
        this.discountCodeAdded.emit(created);
        this.close();
      },
      error: (e) => console.error('Failed to create discount code', e)
    });
  }

  private todayString(): string {
    const d = new Date();
    return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  }

}
