import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddStationComponent } from './add-station.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { UploadFilesModuleComp } from '../../../main-components/upload-files-co/upload-files-co.module';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": AddStationComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes),
    LayoutModule,
    UploadFilesModuleComp
  ], exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ], declarations: [
    AddStationComponent
  ]
})
export class AddStationModule {



}
