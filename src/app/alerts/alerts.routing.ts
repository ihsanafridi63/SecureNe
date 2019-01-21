import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Alerts Components
import { BasicTableComponent } from './basic-table.component';

export const AlertsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BasicTableComponent,
                data: {
                    title: 'Alert Data'
                }
            }
        ]
    }
];

