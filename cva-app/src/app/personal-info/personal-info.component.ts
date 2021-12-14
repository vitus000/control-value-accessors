import {Component, forwardRef, OnInit} from '@angular/core';
import {
  AbstractControl, AsyncValidator, ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors, Validators
} from '@angular/forms';
import {delay, map, Observable, of} from 'rxjs';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersonalInfoComponent),
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => PersonalInfoComponent),
      multi: true
    }
  ]
})
export class PersonalInfoComponent implements OnInit, ControlValueAccessor, AsyncValidator {
  personalInfoForm: FormGroup;

  onTouched: () => void;
  onChanged: () => void;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.personalInfoForm = this._formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]]
    });
  }

  // use 'fn' callback to push value changes into parent form
  registerOnChange(fn): void {
    this.personalInfoForm.valueChanges.subscribe(fn);
  }

  // use 'fn' callback to push touch changes into parent form
  registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  // set value from parent form to this form
  writeValue(value: any): void {
    if (value) {
      this.personalInfoForm.patchValue(value)
    } else {
      this.personalInfoForm.reset();
    }
  }

  // use it for disable this form when parent trigger it
  setDisabledState(isDisabled: boolean) {
    isDisabled
      ? this.personalInfoForm.disable()
      : this.personalInfoForm.enable();
  }

  // use it for async validation of this form and show validation result in parent form
  validate(c: AbstractControl): Observable<ValidationErrors | null> {
    const nameControl = this.personalInfoForm.get('email');
    const errorPropName = 'emailExists';

    return this.asyncValidate(nameControl).pipe(map(asyncResult => {
      if (asyncResult.exists) {
        nameControl.setErrors({[errorPropName]: true});
      } else if (nameControl.hasError(errorPropName)) {
        delete nameControl.errors[errorPropName];
      }

      return this.personalInfoForm.valid ? null : { invalidForm: {valid: false, message: 'Company info fields are invalid'}};
    }));
  }

  asyncValidate(control: AbstractControl): Observable<{exists: boolean}> {
    if (control?.value) {
      return of(null)
        .pipe(
          delay(1000),
          map(() => {return {exists: control.value === 'test@gmail.com'}})
        );
    } else {
      return of({exists: false});
    }
  }

}
