import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';

import { DevicesRoutes } from './devices.routing';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { NgSelectizeModule } from 'ng-selectize';
import { CustomFormsModule } from 'ng2-validation';

//users Component
import { DevicesComponent } from './devices.component';


@NgModule({
    imports: [
        RouterModule.forChild(DevicesRoutes),
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
        DevicesComponent
    ],
    exports: [
        DevicesComponent
    ]
})
export class DevicesModule { }