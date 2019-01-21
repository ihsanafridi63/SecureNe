import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';

import { UsersRoutes } from './users.routing';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { NgSelectizeModule } from 'ng-selectize';
import { CustomFormsModule } from 'ng2-validation';

//users Component
import { UsersComponent } from './users.component';


@NgModule({
    imports: [
        RouterModule.forChild(UsersRoutes),
        DataTablesModule,
        CommonModule,
        HttpModule,
        NgbModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        ArchwizardModule,
        NgSelectizeModule,
        CustomFormsModule
    ],
    providers: [
      ApiService
    ],
    declarations: [
        UsersComponent
    ],
    exports: [
        UsersComponent
    ]
})
export class UsersModule { }