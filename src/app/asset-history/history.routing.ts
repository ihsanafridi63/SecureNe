import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Alerts Components
import { AssetHistoryComponent } from './asset-history.component';

export const HistoryRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AssetHistoryComponent,
                data: {
                    title: 'Asset History'
                }
            }
        ]
    }
];

