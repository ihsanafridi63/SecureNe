
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ArchwizardModule } from 'angular-archwizard';
import { AssetsRoutes } from './assets.routing';
import { NgSelectizeModule } from 'ng-selectize';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ng2-validation';


//Forms Component
import { AssetsComponent } from './assets.component';

import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';
@NgModule({
    imports: [
        RouterModule.forChild(AssetsRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ArchwizardModule,
        NgSelectizeModule,
        NgbModule,
        CustomFormsModule,
        HttpClientModule
    ],
    providers: [
      ApiService
    ],
    declarations: [
        AssetsComponent,
    ],
    exports: [
        AssetsComponent
    ]
})
export class Assets_Module { }