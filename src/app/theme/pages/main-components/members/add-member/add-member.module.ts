import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddMemberComponent } from './add-member.component';
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
                "component": AddMemberComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes), LayoutModule
    ], exports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ], declarations: [
        AddMemberComponent
    ]
})
export class AddMemberModule {



}