import { Component, OnInit } from '@angular/core';
import { IUser } from '../../shared/interfaces/IUser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // login forms
  reactiveForm = new FormGroup({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
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


  constructor(public apiService:ApiService,private _snackBar: MatSnackBar,private router: Router,private cookieService:CookieService) { }
  ngOnInit() {
    var userCookie = this.cookieService.get('user')
    // if the user existed in the cookie, just go to the home component
    if(userCookie!=''){
      this.router.navigateByUrl('')
    }
  }


  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  

  // submitting the form to login the user
  onSubmit(){
    var formData = new FormData()
    formData.append('username',this.reactiveForm.value.username!)
    formData.append('password',this.reactiveForm.value.password!)
    this.apiService.login(formData).subscribe((res: any) => {
      if(res.stu==1){
        // if everuthing was ok, the user object will be saved in cookies
        this.user = JSON.parse(res.message)   
        this.user.password = this.reactiveForm.value.password!
        this.cookieService.set('user',JSON.stringify(this.user))
        if(this.user.role==1){
          this.router.navigateByUrl('/admin')
        }
        else{
          this.router.navigateByUrl('')
        }
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
