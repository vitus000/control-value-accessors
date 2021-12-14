import {Component, forwardRef, OnInit} from '@angular/core';
import {
  AbstractControl, ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors, Validator, Validators
} from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressComponent),
      multi: true
    }
  ]
})
export class AddressComponent implements OnInit, ControlValueAccessor, Validator {
  addressForm: FormGroup;

  onTouched: () => void;
  onChanged: () => void;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.addressForm = this._formBuilder.group({
      country: [null, Validators.required],
      city: [null, Validators.required],
      street: [null, Validators.required]
    });
  }

  // use 'fn' callback to push value changes into parent form
  registerOnChange(fn): void {
    this.addressForm.valueChanges.subscribe(fn);
  }

  // use 'fn' callback to push touch changes into parent form
  registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  // set value from parent form to this form
  writeValue(value: any): void {
    if (value) {
      this.addressForm.patchValue(value)
    } else {
      this.addressForm.reset();
    }
  }

  // use it for disable this form when parent trigger it
  setDisabledState(isDisabled: boolean) {
    isDisabled
      ? this.addressForm.disable()
      : this.addressForm.enable();
  }

  // use it for sync validation of this form and show validation result in parent form
  validate(c: AbstractControl): ValidationErrors | null {
    return this.addressForm.valid ? null : { invalidForm: {valid: false, message: 'Address form is invalid'}};
  }

}
