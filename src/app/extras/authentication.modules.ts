import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthenticationRoutes } from './authentication.routing';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';
//Authentication Component
import { SignInComponent } from './sign-in/sign-in.component';
import { SignIn2Component } from './login/sign-in2.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { Page500Component } from './500/500.component';
import { Page404Component } from './404/404.component';
//import {AuthenticationRoutes} from "@angular/router";

@NgModule({
    imports: [
        RouterModule.forChild(AuthenticationRoutes),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule

    ],
    providers: [
      ApiService
    ],
    declarations: [
        SignInComponent,
        SignIn2Component,
        SignUpComponent,
        Page500Component,
        Page404Component,
    ],
    exports: [
        SignIn2Component
    ]
})
export class AuthenticationModule { }