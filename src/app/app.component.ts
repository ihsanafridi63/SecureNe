import { Component } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { CookieService } from 'ngx-cookie-service';
import {Router} from "@angular/router";
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls:['./app.component.css']
})
export class AppComponent {
   
     constructor(private cookieService: CookieService, private router: Router){
        
     }
  


  ngOnInit() {
          
    }


}
