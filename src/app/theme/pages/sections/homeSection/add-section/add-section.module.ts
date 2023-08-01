import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AddHomeSectionComponent } from "./add-section.component";
import { LayoutModule } from "../../../../layouts/layout.module";
import { DefaultComponent } from "../../../default.component";
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
// import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { sectionService } from "../sections.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: AddHomeSectionComponent,
      },
    ],
  },
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // RichTextEditorAllModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    LayoutModule,
  ],
  providers: [sectionService],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // RichTextEditorAllModule
  ],
  declarations: [AddHomeSectionComponent],
})
export class AddHomeSectionModule {}
