import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cva-app';
  userForm: FormGroup;

  readonly DEFAULT_USER_DATA = {
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
    },
    address: {
      country: 'Ukraine',
      city: 'Lviv',
      street: 'Zelena',
    }
  }

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.userForm = this._formBuilder.group({
      personalInfo: [null],
      address: [null],
    });
  }

  disableAddress() {
    this.userForm.get('address').disable();
  }

  enableAddress() {
    this.userForm.get('address').enable();
  }

  setDefaultData() {
    this.userForm.patchValue(this.DEFAULT_USER_DATA);
  }

  submit() {
    console.log(this.userForm);
  }
}
