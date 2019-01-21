import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';

import { TenantsRoutes } from './tenants.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { NgSelectizeModule } from 'ng-selectize';
import { CustomFormsModule } from 'ng2-validation';

//tenants Component
import { TenantsComponent } from './tenants.component';


@NgModule({
    imports: [
        RouterModule.forChild(TenantsRoutes),
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
        TenantsComponent
    ],
    exports: [
        TenantsComponent
    ]
})
export class TenantsModule { }