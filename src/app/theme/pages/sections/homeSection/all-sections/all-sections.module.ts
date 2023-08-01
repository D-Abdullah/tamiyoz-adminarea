import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AllHomeSectionsComponent } from "./all-sections.component";
import { LayoutModule } from "../../../../layouts/layout.module";
import { DefaultComponent } from "../../../default.component";

import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { sectionService } from "../sections.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: AllHomeSectionsComponent,
      },
    ],
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    LayoutModule,
  ],
  providers: [sectionService],
  exports: [RouterModule, FormsModule, ReactiveFormsModule],
  declarations: [AllHomeSectionsComponent],
})
export class AllHomeSectionModule {}
