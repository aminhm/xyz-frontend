import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IStore } from 'src/app/shared/interfaces/IStore';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-admin-product-detail',
  templateUrl: './admin-product-detail.component.html',
  styleUrls: ['./admin-product-detail.component.scss']
})
export class AdminProductDetailComponent {
  constructor(private router: Router,private cookieService:CookieService,private _snackBar:MatSnackBar,private route: ActivatedRoute, private apiService: ApiService){}
  product: IProduct = {
    id: 0,
    name: '',
    price: 0,
    rating: 0,
    review: '',
    pID: 0
  };

  finlandStores : IStore[]=[]
  swedenStores : IStore[]=[]

  selectedFinlandStore=''
  selectedSwedenStore = ''

  // detail forms
  reactiveForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    price: new FormControl('',[Validators.required]),
  })

  amount = 0
  productNumber = 0
  finlandProductNumber = 0
  swedenProductNumber = 0

  productStores : IStore[] = []
  productWarehousesId : any[] = []

  wareHouses:any[] = []
  ngOnInit() {
    // getting the given product id in the params
    this.route.params.subscribe(params => {
      this.product.id = +params['id']
    this.getProduct()
    // get finland and sweden stores
    this.getStores('finland')
    this.getStores('sweden')
    
    }
    )
  }

  // increasing the number of product for default db
  increaseProductNumber(){
    this.productNumber+=1
    this.amount+=1
  }

  // decreasing the number of product for default db
  decreaseProductNumber(){
    if(this.productNumber>0){
      this.productNumber-=1
      this.amount-=1
    }
  }

  // increasing the number of product for finland db
  increaseFinlandProductNumber(){
    if(this.amount!=0){
    this.finlandProductNumber+=1
    this.amount-=1
    this.productNumber-=1
    }
  }

  // decreasing the number of product for finland db
  decreaseFinlandProductNumber(){
    if(this.finlandProductNumber>0){
      this.finlandProductNumber-=1
      this.amount+=1
    }
  }

  // increasing the number of product for sweden db
  increaseSwedenProductNumber(){
    if(this.amount!=0){
      this.swedenProductNumber+=1
      this.amount-=1
      this.productNumber-=1
      }
  }

  // decreasing the number of product for sweden db
  decreaseSwedenProductNumber(){
    if(this.swedenProductNumber>0){
      this.swedenProductNumber-=1
      this.amount+=1
      this.productNumber+=1
    }
  }


  getProduct(){
    // passing location and product id to get the targeted product details
    this.apiService.getProduct('default', this.product.id.toString()).subscribe((res: any) => {
      if(res.stu==1){
        this.product = res.message
        this.reactiveForm.controls['name'].setValue(this.product.name)
        this.reactiveForm.controls['price'].setValue(this.product.price.toString())
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

  getStores(location:string){
    // passing finland or sweden location and product id to get the stores of them
    this.apiService.getStores(location).subscribe((res: any) => {
      if(res.stu==1){
        if(location=='finland'){
          // setting finland stores
          this.finlandStores = res.message
        }
        else{
          // setting sweden stores
          this.swedenStores = res.message
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

  getProductWarehouses(){
    // passing location and product id to get the warehouses of the product
    this.apiService.getProductWarehouses('default', this.product.id.toString()).subscribe((res: any) => {
      if(res.stu==1){
        this.productWarehousesId = res.message
        // setting the amount of existed product
        this.amount = this.productWarehousesId[0].productAmount
        this.productNumber = this.amount
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

  // submitting the form
  onSubmit(){
    this.updateMainDB()
}


// update the product in the default db
updateMainDB(){
  var formData = new FormData()
    formData.append('name',this.reactiveForm.value.name!)
    formData.append('price',this.reactiveForm.value.price!)
    formData.append('amount',this.amount.toString())
    formData.append('id',this.product.id.toString())
    formData.append('location','default')
    this.apiService.updateProduct(formData).subscribe((res: any) => {
      if(res.stu==1){
        // if it was successfull, then update it in the finland and sweden db
        this.updateFinlandAndSwedenDB('finland')
        this.updateFinlandAndSwedenDB('sweden')
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

  // update or create the product in the finland or sweden db
  updateFinlandAndSwedenDB(location:string){
    var formData = new FormData()
      formData.append('name',this.reactiveForm.value.name!)
      formData.append('price',this.reactiveForm.value.price!)
      formData.append('amount',location == 'finland' ? this.finlandProductNumber.toString(): this.swedenProductNumber.toString())
      formData.append('pID',this.product.pID.toString())
      formData.append('id',this.product.id.toString())
      formData.append('location',location)
      formData.append('warehouseId',location == 'finland' ? this.selectedFinlandStore : this.selectedSwedenStore)
      this.apiService.updateProduct(formData).subscribe((res: any) => {
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

