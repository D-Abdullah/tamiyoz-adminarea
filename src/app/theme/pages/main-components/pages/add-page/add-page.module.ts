import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddPageComponent } from './add-page.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
// import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';



const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": AddPageComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // RichTextEditorAllModule,
        FormsModule, ReactiveFormsModule, RouterModule.forChild(routes), LayoutModule
    ], exports: [
       
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        // RichTextEditorAllModule
    ], declarations: [
        AddPageComponent
    ]
})
export class AddPageModule {



}