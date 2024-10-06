import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractModalComponent} from "../../../abstract/AbstractModal";
import {NgClass, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DiscountCodeDto, DiscountCodeService} from "../../../../services/discount-code.service";
import {Painting} from "../../../../services/painting.service";

@Component({
  selector: 'app-add-code-modal',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './add-code-modal.component.html',
  styleUrl: './add-code-modal.component.css'
})
export class AddCodeModalComponent extends AbstractModalComponent implements OnInit {

  discountCodeForm!: FormGroup;

  @Output() discountCodeAdded = new EventEmitter<DiscountCodeDto>();

  constructor(private fb: FormBuilder, private discountCodeService: DiscountCodeService) {
    super();
  }

  ngOnInit(): void {
    this.discountCodeForm = this.fb.group({
      code: ['', [Validators.required]],
      discountValue: [0, [Validators.required, Validators.min(1)]],
      discountType: ['PERCENTAGE', [Validators.required]],
      minimumOrderValue: [0, [Validators.required, Validators.min(0)]],
      usageLimit: [0, [Validators.required, Validators.min(1)]],
      validFrom: [new Date(), [Validators.required]],
      validTo: [new Date(), [Validators.required]],
      active: [true],
    });
  }

  onSubmit() {
    if (this.discountCodeForm.valid) {
      const discountCode = {
        code: this.discountCodeForm.get('code')?.value || '',
        description: this.discountCodeForm.get('description')?.value || '',
        type: this.discountCodeForm.get('type')?.value || '',
        discountValue: this.discountCodeForm.get('discountValue')?.value.toString() || '0',
        minimumOrderValue: this.discountCodeForm.get('minimumOrderValue')?.value.toString() || '0',
        usageLimit: this.discountCodeForm.get('usageLimit')?.value.toString() || '0',
        validFrom: this.discountCodeForm.get('validFrom')?.value || '',
        validTo: this.discountCodeForm.get('validTo')?.value || '',
        active: this.discountCodeForm.get('active')?.value || false
      };

      this.discountCodeService.createDiscountCode(discountCode).subscribe(
        (newDiscountCode) => {
          this.discountCodeAdded.emit(newDiscountCode);
          this.close();
        },
        (error) => {
          console.error('Failed to create discount code', error);
        }
      );
    }
  }


}
