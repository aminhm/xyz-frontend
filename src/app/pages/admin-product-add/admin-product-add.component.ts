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
  selector: 'app-admin-product-add',
  templateUrl: './admin-product-add.component.html',
  styleUrls: ['./admin-product-add.component.scss']
})
export class AdminProductAddComponent {
  constructor(private router: Router,private cookieService:CookieService,private _snackBar:MatSnackBar,private route: ActivatedRoute, private apiService: ApiService){}

  finlandStores : IStore[]=[]
  swedenStores : IStore[]=[]

  selectedFinlandStore=''
  selectedSwedenStore = ''

  pID = 0

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
    // get finland and sweden stores
    this.getStores('finland')
    this.getStores('sweden')
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

  // submitting the form
  onSubmit(){
    this.createInMainDB()
}

// create the product in the default db
createInMainDB(){
  var formData = new FormData()
    formData.append('name',this.reactiveForm.value.name!)
    formData.append('price',this.reactiveForm.value.price!)
    formData.append('amount',this.amount.toString())
    formData.append('location','default')
    this.apiService.createProduct(formData).subscribe((res: any) => {
      if(res.stu==1){
        this.pID=res.message
        // if it was successfull, then create it in the finland and sweden db
        this.createInFinlaandOrSwedenDB('finland')
        this.createInFinlaandOrSwedenDB('sweden')
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

  // create the product in the finland or sweden db
  createInFinlaandOrSwedenDB(location:string){
    var formData = new FormData()
      formData.append('name',this.reactiveForm.value.name!)
      formData.append('price',this.reactiveForm.value.price!)
      formData.append('amount',location == 'finland' ? this.finlandProductNumber.toString(): this.swedenProductNumber.toString())
      formData.append('pID',this.pID.toString())
      formData.append('location',location)
      formData.append('warehouseId',location == 'finland' ? this.selectedFinlandStore : this.selectedSwedenStore)
      this.apiService.createProduct(formData).subscribe((res: any) => {
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
