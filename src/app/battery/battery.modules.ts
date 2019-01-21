import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

import { AlertsRoutes } from './battery.routing';

//Alerts Component
import { BasicTableComponent } from './battery.component';


import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';

@NgModule({
    imports: [
        RouterModule.forChild(AlertsRoutes),
        DataTablesModule,
        CommonModule,
        HttpModule,
        NgbModule,
        HttpClientModule
    ],
    providers: [
      ApiService
    ],
    declarations: [
        BasicTableComponent
    ],
    exports: [
        BasicTableComponent
    ]
})
export class BatteryModule { }