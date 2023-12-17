import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminProductDetailComponent } from './pages/admin-product-detail/admin-product-detail.component';
import { AdminProductAddComponent } from './pages/admin-product-add/admin-product-add.component';





const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'admin-product-detail/:id', component: AdminProductDetailComponent},
  {path: 'admin-product-add', component: AdminProductAddComponent},
  {path: 'product/:id', component: ProductComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
