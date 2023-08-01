import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ShowRenteComponent } from './show-rente.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": ShowRenteComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,

        FormsModule, ReactiveFormsModule, RouterModule.forChild(routes
            ), LayoutModule
    ], exports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ], declarations: [
      ShowRenteComponent
    ]
})
export class ShowRenteModule {



}
