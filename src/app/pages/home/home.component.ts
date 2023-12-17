import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { ApiService } from 'src/app/shared/services/api.service';
import { InternalService } from 'src/app/shared/services/internal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(public internalService:InternalService,public apiService:ApiService,private _snackBar: MatSnackBar,private router: Router,private cookieService:CookieService) {
   }

  user! : IUser
  productList: IProduct[] = [];

  // a method to divide price number with ','
  priceToString(price:number){
    var priceHelper = price.toString().split('').reverse();
    var res = ''
    for(let i = 0 ; i < priceHelper.length; i++){
      if(i!=0 && (priceHelper.length-i)%3==0){
        res+=','
      }
      res+=priceHelper[priceHelper.length-i-1]
    }
    return res;
  }

  ngOnInit() {
    // if user is not existed in the cookies, go to login component, otherwise 
    // do the login by yourself
    // if it was not successful, clear the cookies and go to login page
    var userCookie = this.cookieService.get('user')
    if(userCookie!=''){
      this.user = JSON.parse(this.cookieService.get('user'))
    var formData = new FormData()
    formData.append('username',this.user.username)
    formData.append('password',this.user.password)
    this.apiService.login(formData).subscribe((res: any) => {
      if(res.stu!=1){
        this.cookieService.deleteAll()
        this.router.navigateByUrl('/login')
      }
    },error=>{
        this._snackBar.open('Server Error', '', {
          duration: 2000,
          panelClass: ['red-snackbar']
        })
      
    })
    }
    else{
      this.router.navigateByUrl('/login')
    }

    // listening to searched data and whenever new data comes,
    // we will get the product list again from the database based on
    // the searched data
      this.internalService.searchResultItems$.subscribe(
        searchRes => {
            this.getProductList(searchRes)
        }
      )
    
  }

  getProductList(search:string){
    // passing user location and the searched data to get the products of this location
    this.apiService.getProductsList(this.user.location,search).subscribe((res: any) => {
      if(res.stu==1){
        this.productList = res.message
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
