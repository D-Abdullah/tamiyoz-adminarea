import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { AddcorrespondenceMailComponet } from './add-correspondenceMail.component';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
            "component": AddcorrespondenceMailComponet
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
    AddcorrespondenceMailComponet
    ]
})
export class AddcorrespondenceMailModule {



}
