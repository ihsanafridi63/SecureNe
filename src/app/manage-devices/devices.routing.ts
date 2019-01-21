import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Devices Components
import { DevicesComponent } from './devices.component';

export const DevicesRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: DevicesComponent,
                data: {
                    title: 'Manage Devices'
                }
            }
        ]
    }
];

