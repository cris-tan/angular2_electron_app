import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';
import {RegisterService}       from './register.service';

import 'style-loader!./register.scss';

@Component({
  selector: 'register',
  templateUrl: './register.html',
  providers: [RegisterService]
})
export class Register {

  public form:FormGroup;
  public name:AbstractControl;
  public email:AbstractControl;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;
  public company:AbstractControl;
  public jobTitle:AbstractControl;

  public statusMsg: string;
  public submitted:boolean = false;

  constructor(fb:FormBuilder, private registerService: RegisterService) {

    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')}),
      'company': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'jobTitle': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.name = this.form.controls['name'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
    this.company = this.form.controls['company'];
    this.jobTitle = this.form.controls['jobTitle'];
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    console.log(JSON.stringify(values));
    if (this.form.valid) {
      this.registerService.regist({
          fullName: this.name.value, 
          email: this.email.value, 
          password: this.password.value, 
          company: this.company.value,
          jobTitle: this.jobTitle.value
          })
      .subscribe(
        success  => console.log(success),
        err => {             
            if(err.code == "400")
              this.statusMsg = err.data.msg;
            if(err.code == "409") {
              if(err.data.UserRegisteredBefore == true)
                this.statusMsg = "Already Register User Error";
              if(err.data.CompanyRegisteredBefore == true)
                this.statusMsg = "Already Existed Company Error";
            }
            if(err.code == "200") {
              this.statusMsg = "Success Registration"
            }
            console.log(this.statusMsg);
          }
        );
      // your code goes here
      console.log(values);
    }
  }
}
