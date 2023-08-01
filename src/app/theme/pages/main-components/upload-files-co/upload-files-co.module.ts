import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { UploadFilesComponentComp } from './upload-files-co.component';



@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule
    ], exports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        UploadFilesComponentComp
    ], declarations: [
        UploadFilesComponentComp
    ]
})
export class UploadFilesModuleComp {



}