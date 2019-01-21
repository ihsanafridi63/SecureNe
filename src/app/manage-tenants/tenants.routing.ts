import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Tenants Components
import { TenantsComponent } from './tenants.component';

export const TenantsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: TenantsComponent,
                data: {
                    title: 'Manage Tenants'
                }
            }
        ]
    }
];

