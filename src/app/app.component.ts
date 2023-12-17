import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IUser } from './shared/interfaces/IUser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'xyz';
  isNavBarEnabled = true;
  user:IUser = {
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
  constructor(private router: Router,private cookieService:CookieService) {
    var userCookie = this.cookieService.get('user')
    if(userCookie!=''){
      this.user = JSON.parse(this.cookieService.get('user'))
      if(this.user.role==1){
        router.navigateByUrl('/admin')
      }
    }
    // check if the route is '/login' or '/signup' and if that is, 
    // we do not need to have a navbar in those pages
    // so isNavbarEnabled flag will be false and vise-versa
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          if(this.router.url.includes('/login') || this.router.url=='/signup' || this.router.url.includes('admin')){
            this.isNavBarEnabled = false;
          }
          else{
            this.isNavBarEnabled = true;
          }
        }
      }
    )
    
   }
  
}
