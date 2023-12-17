import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IStore } from 'src/app/shared/interfaces/IStore';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  constructor(private router: Router,private cookieService:CookieService,private _snackBar:MatSnackBar,private route: ActivatedRoute, private apiService: ApiService){}
  product: IProduct = {
    id: 0,
    name: '',
    price: 0,
    rating: 0,
    review: '',
    pID: 0
  };
  user : IUser = {
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
  }

  amount = 0
  productNumber = 0

  productStores : IStore[] = []
  productWarehousesId : any[] = []

  wareHouses:any[] = []
  ngOnInit() {
    // getting the given product id in the params
    this.route.params.subscribe(params => {
      this.product.id = +params['id']
      this.user = JSON.parse(this.cookieService.get('user'))
    this.getProduct()
    
    
    }
    )
  }

  // increasing the number of product that user wants to buy
  increaseProductNumber(){
    if(this.productNumber<this.amount){
      this.productNumber+=1
    }
  }

  // decreasing the number of product that user wants to buy
  decreaseProductNumber(){
    if(this.productNumber>1){
      this.productNumber-=1
    }
  }


  getProduct(){
    // passing user location and product id to get the targeted product details
    this.apiService.getProduct(this.user.location, this.product.id.toString()).subscribe((res: any) => {
      if(res.stu==1){
        this.product = res.message
        this.getProductWarehouses()
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


  getProductWarehouses(){
    // passing user location and product id to get the warehouses of the product
    this.apiService.getProductWarehouses(this.user.location, this.product.id.toString()).subscribe((res: any) => {
      if(res.stu==1){
        this.productWarehousesId = res.message
        // setting the amount of existed product
        this.amount = this.productWarehousesId[0].productAmount
        this.productNumber = this.amount
        this.getProductStores()
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


  getProductStores(){
    for (let idObject of this.productWarehousesId){
    // passing user location and warehouse id to get the stores of the product
    this.apiService.getProductStores(this.user.location, idObject.warehouse_id.toString()).subscribe((res: any) => {
      
      if(res.stu==1){
        this.productStores.push(res.message[0])
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

// adding the product with its amount in the cart
addProductToCart(){
  var formData = new FormData()
    formData.append('productId',this.product.id.toString())
    formData.append('userId',this.user.id.toString())
    formData.append('amount',this.productNumber.toString())
    formData.append('location',this.user.location.toLowerCase())
    this.apiService.addProductToCart(formData).subscribe((res: any) => {
      if(res.stu==1){
        this.router.navigateByUrl('/shopping-cart')
      }
        this._snackBar.open(res.message, '', {
          duration: 2000,
          panelClass: ['red-snackbar']
        })
    },error=>{
        this._snackBar.open('Server Error', '', {
          duration: 2000,
          panelClass: ['red-snackbar']
        })
      
    })
}
  
}
