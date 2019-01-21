import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
// Layouts
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'authentication/login',
        pathMatch: 'full',
        
    },
    {
        path: '',
        component: CommonLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule',
               canActivate:[AuthGuard]
            },
            {
                path: 'dashboard/:id',
                loadChildren: './dashboard/dashboard.module#DashboardModule',
                canActivate:[AuthGuard]
            },
            {
                path: 'dashboardMap',
                loadChildren: './dashboardMap/dashboardMap.module#DashboardMapModule',
                canActivate:[AuthGuard]
            },
            {
                path: 'dashboardMap/:id',
                loadChildren: './dashboardMap/dashboardMap.module#DashboardMapModule',
                canActivate:[AuthGuard]
            },
            
            {
                path: 'apps',
                loadChildren: './apps/apps.modules#AppsModule',
                canActivate:[AuthGuard]
            },
            {
                path: 'ui-elements',
                loadChildren: './ui-elements/ui-elements.modules#UiElementsModule',
                canActivate:[AuthGuard]
            },
            
            {
                path: 'manage-assets',
                loadChildren: './manage-assets/assets.modules#Assets_Module',
                canActivate:[AuthGuard]
            },
            {
                path: 'alerts',
                loadChildren: './alerts/alerts.modules#AlertsModule',
                canActivate:[AuthGuard]
            },
            {
                path: 'asset-history',
                loadChildren: './asset-history/history.modules#HistoryModule',
                canActivate:[AuthGuard]
            },
            {
                path: 'charts',
                loadChildren: './charts/charts.modules#Charts_Module',
                canActivate:[AuthGuard]
            },
            {
                path: 'maps',
                loadChildren: './maps/maps.modules#MapsModule',
                canActivate:[AuthGuard]
            },
            {
                path: 'extras',
                loadChildren: './extras/extras.modules#ExtrasModule',
                canActivate:[AuthGuard]
            },
            {
                path: 'reports',
                loadChildren: './reports/dashboard.module#DashboardModule',
                canActivate:[AuthGuard]
            },
            {
                path: 'battery',
                loadChildren: './battery/battery.modules#BatteryModule',
                canActivate:[AuthGuard]
            },
            {
                path: 'manage-tenants',
                loadChildren: './manage-tenants/tenants.modules#TenantsModule',
                canActivate:[AuthGuard]
            },
            {
                path: 'manage-users',
                loadChildren: './manage-users/users.modules#UsersModule',
                canActivate:[AuthGuard]
            },
            {
                path: 'manage-devices',
                loadChildren: './manage-devices/devices.modules#DevicesModule',
                canActivate:[AuthGuard]
            },
            {
                path: '',
                loadChildren: './extras/authentication.modules#AuthenticationModule',
                canActivate:[AuthGuard]
            }
        ]
    },
    {
        path: '',
        component: AuthenticationLayoutComponent,
        children: [
            {
                path: 'authentication',
                loadChildren: './extras/authentication.modules#AuthenticationModule'
                
            }
        ]
    }
];

