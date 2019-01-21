import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Forms Component

import { AssetsComponent } from './assets.component';

export const AssetsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AssetsComponent,
                data: {
                    title: 'Manage Assets'
                }
            }
        ]
    }
];

