import { Component, OnInit } from '@angular/core';
import { IUser } from '../../shared/interfaces/IUser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  // registration forms
  reactiveForm = new FormGroup({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
    email : new FormControl('',[Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
  })

  user: IUser = {
    role: 0,
    location: '',
    first_name: '',
    id: 0,
    is_active: false,
    is_staff: false,
    is_superuser: false,
    last_name: '',
    password: '',
    username: '',
    email: ''
  };

  // locations for radio button
  location = ''
  locations = ['Finland','Sweden']

  constructor(public apiService:ApiService,private _snackBar: MatSnackBar,private router: Router,private cookieService:CookieService) { }

  ngOnInit() {
    // check if user cookie existed, go to the home page at the initial stage
    // of the component
    var userCookie = this.cookieService.get('user')
    if(userCookie!=''){
      this.router.navigateByUrl('')
    }
  }

  // changing radio button value
  radioChange(event: MatRadioChange) {
    this.location = event.value;
  }

  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }

  // submitting the form and using api service to send registration request
  // and also check that fields are valid and not empty
  onSubmit(){
    if(this.reactiveForm.value.email==''){
      this._snackBar.open('Please enter your email', '', {
        duration: 2000,
        panelClass: ['red-snackbar']
      })
    }
    else if(this.reactiveFormControl.email.invalid){
      this._snackBar.open('Please enter a valid email', '', {
        duration: 2000,
        panelClass: ['red-snackbar']
      })
    }
    else if(this.reactiveForm.value.username==''){
      this._snackBar.open('Please enter your username', '', {
        duration: 2000,
        panelClass: ['red-snackbar']
      })
    }
    else if(this.reactiveForm.value.password==''){
      this._snackBar.open('Please enter a valid email', '', {
        duration: 2000,
        panelClass: ['red-snackbar']
      })
    }
    else if(this.reactiveForm.value.password!.length<8){
      this._snackBar.open('The password length should be at least 8', '', {
        duration: 2000,
        panelClass: ['red-snackbar']
      })
    }
    else if(this.location==''){
      this._snackBar.open('Please specify your location', '', {
        duration: 2000,
        panelClass: ['red-snackbar']
      })
    }
    else{
    var formData = new FormData()
    formData.append('username',this.reactiveForm.value.username!)
    formData.append('password1',this.reactiveForm.value.password!)
    formData.append('password2',this.reactiveForm.value.password!)
    formData.append('location',this.location.toLowerCase())
    formData.append('email',this.reactiveForm.value.email!)
    this.apiService.signup(formData).subscribe((res: any) => {
      if(res.stu==1){
        // if everuthing was ok, the user object will be saved in cookies
        this.user = res.message
        this.user.password = this.reactiveForm.value.password!
        this.cookieService.set('user',JSON.stringify(this.user))
        this.router.navigateByUrl('')
      }
      else{
        this._snackBar.open(res.message, '', {
          duration: 2000,
          panelClass: ['red-snackbar']
        })
      }
    },error=>{
        this._snackBar.open('Server Error', '', {
          duration: 2000,
          panelClass: ['red-snackbar']
        })
      
    })
  }
}
}
