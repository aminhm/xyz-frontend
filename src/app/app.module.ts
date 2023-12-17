import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './shared/services/api.service';
import {HttpClientModule} from '@angular/common/http';
import { SignupComponent } from './pages/signup/signup.component';
import {MatRadioModule} from '@angular/material/radio';
import { NavbarComponent } from './components/navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './components/search/search.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {InternalService} from './shared/services/internal.service';
import { ProductComponent } from './pages/product/product.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminProductDetailComponent } from './pages/admin-product-detail/admin-product-detail.component';
import { AdminProductAddComponent } from './pages/admin-product-add/admin-product-add.component';
import {MatSelectModule} from '@angular/material/select';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    HomeComponent,
    SearchComponent,
    ProductComponent,
    ShoppingCartComponent,
    AdminComponent,
    AdminProductDetailComponent,
    AdminProductAddComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatRadioModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: [InternalService,ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
