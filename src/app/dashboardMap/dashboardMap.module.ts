import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';
import { ChartsModule } from 'ng2-charts';
import 'd3';
import 'nvd3';
import { NvD3Module } from 'ng2-nvd3';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { DashboardRoutes } from './dashboardMap-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';

//Dashboard Component
import { DashboardMapComponent } from './dashboardMap.component';
import { AgmCoreModule } from '@agm/core';
@NgModule({
    imports: [
        RouterModule.forChild(DashboardRoutes),
        ChartsModule,
        NvD3Module,
        PerfectScrollbarModule, 
        HttpClientModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyC6pv4OwHeH0BULcOceGc8THUpa5YRs4YY'
        })
    ],
    declarations: [
        DashboardMapComponent
    ],
    providers: [
        ThemeConstants,
        ApiService 
    ],
    exports:[
        DashboardMapComponent
    ]
})
export class DashboardMapModule {
 }
