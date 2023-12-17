import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router,private cookieService:CookieService) { }
  // after clicking sign out button, everything in the cookies will be deleted
  // and we will conduct to the login component
  signOut(){
    this.cookieService.deleteAll()
    this.router.navigateByUrl('/login')
  }
}
