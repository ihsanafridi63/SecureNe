import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

import { HistoryRoutes } from './history.routing';

//Alerts Component
import { AssetHistoryComponent } from './asset-history.component';


import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';

@NgModule({
    imports: [
        RouterModule.forChild(HistoryRoutes),
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
        AssetHistoryComponent
    ],
    exports: [
        AssetHistoryComponent
    ]
})
export class HistoryModule { }