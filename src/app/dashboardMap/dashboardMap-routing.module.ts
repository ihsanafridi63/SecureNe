import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Dashboard Components
import { DashboardMapComponent } from './dashboardMap.component';

export const DashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardMapComponent,
        data: {
           title: 'DashboardMap'
        }
    }
];

