import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Router} from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

@Component ({
    templateUrl: 'sign-in.html'
})

export class SignInComponent {
    constructor(private router: Router,  private cookieService: CookieService) {
       
        

     }
}