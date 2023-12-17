
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent {
  constructor(private router: Router,private cookieService:CookieService,private _snackBar:MatSnackBar,private route: ActivatedRoute, private apiService: ApiService){}
  products: any[] = []
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

  cartItems : any[] =[]

  amount = 0

  productWarehousesId : any[] = []

  ngOnInit() {
    // get user from the cookie at the initial stage
    this.user = JSON.parse(this.cookieService.get('user'))
    this.getCart()
  }

  getProduct(productId:number,index:number){
    // passing user location and product id to get desired product details
    this.apiService.getProduct(this.user.location, productId.toString()).subscribe((res: any) => {
      if(res.stu==1){
        // add the recieved product to the products list var
        this.products.push(res.message)
        // get all the warehouses that this product exists
        this.getProductWarehouses(productId,index)
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

  getProductWarehouses(productId:number,index:number){
    // passing user location and product id to get the products with their warehouses
    this.apiService.getProductWarehouses(this.user.location, productId.toString()).subscribe((res: any) => {
      if(res.stu==1){
        // add the warehouse ids to the product list
        this.products[index]['productWarehousesId'] = res.message
        // get all the stores that each product belongs to them
        this.getProductStores(index)
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


  getCart(){
    // passing user id and location to get the cart detail
    this.apiService.getCart(this.user.location, this.user.id.toString()).subscribe((res: any) => {
      if(res.stu==1){
        this.cartItems = res.message
        // get all the products of the cart
        for(let i=0 ; i < this.cartItems.length; i++){
          this.getProduct(this.cartItems[i].product_id,i)
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


  getProductStores(index:number){
    this.products[index]['productStores'] = []
    for (let idObject of this.products[index].productWarehousesId){
    // passing user location and warehouse id to get the stores of the products
    this.apiService.getProductStores(this.user.location, idObject.warehouse_id.toString()).subscribe((res: any) => {
      if(res.stu==1){
        this.products[index]['productStores'].push(res.message[0])
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

// submitting order
submitOrder(){
  var productsHelper :any[] = []
  var amountHelper :any[] = []
  for (let i = 0; i < this.products.length;i++){
    productsHelper.push(this.products[i].id)
    amountHelper.push(this.cartItems[i].amount)
  }
  var formData = new FormData()
    formData.append('userId',this.user.id.toString())
    formData.append('productIds',productsHelper.toString())
    formData.append('amounts',amountHelper.toString())
    formData.append('location',this.user.location.toLowerCase())
    this.apiService.addOrder(formData).subscribe((res: any) => {
      if(res.stu==1){
        this.deleteCart()
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

// delete whole shopping cart list
deleteCart(){
    this.apiService.deleteCart(this.user.location.toLowerCase(),this.user.id.toString()).subscribe((res: any) => {
      if(res.stu==1){
        this.router.navigateByUrl('')
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
