import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';
import { ChartsModule } from 'ng2-charts';
import 'd3';
import 'nvd3';
import { NvD3Module } from 'ng2-nvd3';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ng2-validation';
import { DashboardRoutes } from './dashboard-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';

//Dashboard Component
import { DashboardComponent } from './dashboard.component';
import { AgmCoreModule } from '@agm/core';
@NgModule({
    imports: [
        RouterModule.forChild(DashboardRoutes),
        ChartsModule,
        NvD3Module,
        PerfectScrollbarModule, 
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        CustomFormsModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyC6pv4OwHeH0BULcOceGc8THUpa5YRs4YY'
        })
    ],
    declarations: [
        DashboardComponent
    ],
    providers: [
        ThemeConstants,
        ApiService 
    ],
    exports:[
        DashboardComponent
    ]
})
export class DashboardModule {
 }