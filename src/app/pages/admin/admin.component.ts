import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IStore } from 'src/app/shared/interfaces/IStore';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  constructor(private router: Router,private cookieService:CookieService,private _snackBar:MatSnackBar,private route: ActivatedRoute, private apiService: ApiService){}

  productList: IProduct[] = [];

  ngOnInit() {
    // get products from the default db
    this.getProductListAdmin()
  }


  getProductListAdmin(){
    this.apiService.getProductsListAdmin().subscribe((res: any) => {
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
  
}
