import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

//Layout Modules
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';

import { DashboardMapModule } from './dashboardMap/dashboardMap.module';

//Directives
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Sidebar_Directives } from './shared/directives/side-nav.directive';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// Routing Module
import { AppRoutes } from './app.routing';

// App Component
import { GlobalsService } from './globals/globals.service';
import { AppComponent } from './app.component';
import { Assets_Module } from './manage-assets/assets.modules';
import { AlertsModule } from './alerts/alerts.modules';
import { HistoryModule } from './asset-history/history.modules';
import { CookieService } from 'ngx-cookie-service';
import { BatteryModule } from './battery/battery.modules';
import { TenantsModule } from './manage-tenants/tenants.modules';
import { UsersModule } from './manage-users/users.modules';
import { DevicesModule } from './manage-devices/devices.modules';
@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(AppRoutes, { useHash: true }),
        NgbModule.forRoot(),
        FormsModule,
        PerfectScrollbarModule,
        Assets_Module,
        AlertsModule,
        HistoryModule,
        BatteryModule,
        TenantsModule,
        UsersModule,
        DevicesModule,
        DashboardMapModule
    ],
   
    declarations: [
        AppComponent,
        CommonLayoutComponent,
        AuthenticationLayoutComponent,
        Sidebar_Directives
    ],
    providers: [
      GlobalsService,
      CookieService,
      AuthGuard
    ],

    bootstrap: [AppComponent]
})


export class AppModule { }
