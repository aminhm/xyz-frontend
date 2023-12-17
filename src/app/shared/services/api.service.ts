import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

// using http client to send request to the backend
@Injectable()
export class ApiService {
  api = 'http://127.0.0.1:8000/';
  
  constructor(private http: HttpClient,private cookieService : CookieService) {
  }

  login(body:any) {
    return this.http.post(this.api + 'login/'  ,body, {
      
    });
  }
  signup(body:any) {
    return this.http.post(this.api + 'register/'  ,body, {
      
    });
  }

  getProductsList(location:string,search:string) {
    return this.http.get(this.api + 'product_list/?location='  + location+'&search='+search , {
      
    });
  }

  getProductsListAdmin() {
    return this.http.get(this.api + 'product-list-admin/' , {
      
    });
  }

  getProduct(location:string,id:string) {
    return this.http.get(this.api + 'product/?location='  + location+'&id='+id , {
      
    });
  }

  updateProduct(body:any) {
    return this.http.post(this.api + 'update-product/',body , {
      
    });
  }

  createProduct(body:any) {
    return this.http.post(this.api + 'create-product/',body , {
      
    });
  }

  getStores(location:string){
    return this.http.get(this.api + 'get-stores/?location='  + location, {
      
    });
  }

  getProductWarehouses(location:string,productId:string){
    return this.http.get(this.api + 'product-warehouse/?location='  + location+'&id='+productId , {
      
    });
  }

  getProductStores(location:string,warehouseId:string){
    return this.http.get(this.api + 'product-store/?location='  + location+'&id='+warehouseId , {
      
    });
  }

    addProductToCart(body:any){
    return this.http.post(this.api + 'add-product-to-cart/',body, {
      
    });
  }

  addOrder(body:any){
    return this.http.post(this.api + 'add-order/',body, {
      
    });
  }

  getCart(location:string,userId:string){
    return this.http.get(this.api + 'get-cart/?location='  + location+'&userId='+userId, {
      
    });
  }

  deleteCart(location:string,userId:string){
    return this.http.get(this.api + 'delete-cart/?location='  + location+'&userId='+userId, {
      
    });
  }

}