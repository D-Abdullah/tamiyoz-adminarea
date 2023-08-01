import { NgModule } from "@angular/core";
import { ThemeComponent } from "./theme.component";
import { LoginComponent } from "./pages/main-components/profile/login/login.component";
import { Routes, RouterModule } from "@angular/router";
import { LoginModule } from "./pages/main-components/profile/login/login.module";
//import { AuthGuard } from "../auth/_guards/auth.guard";
import { AuthGuard } from "../auth.guard";

const routes: Routes = [
  {
    path: "",
    component: ThemeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "index",
        loadChildren: "./pages/index/index.module#IndexModule",
      },

      // Main Sections
      // Languages
      {
        path: "languages/all-languages",
        loadChildren:
          "./pages/sections/languages/all-languages/all-languages.module#AllLanguagesModule",
      },
      {
        path: "languages/language",
        loadChildren:
          "./pages/sections/languages/add-language/add-language.module#AddLanguageModule",
      },
      {
        path: "languages/language/:id",
        loadChildren:
          "./pages/sections/languages/add-language/add-language.module#AddLanguageModule",
      },
      // partners
      {
        path: "partners/all-partners",
        loadChildren:
          "./pages/sections/partners/all-partners/all-partners.module#AllPartnersModule",
      },
      {
        path: "partners/partner",
        loadChildren:
          "./pages/sections/partners/add-partner/add-partner.module#AddPartnerModule",
      },
      {
        path: "partners/partner/:id",
        loadChildren:
          "./pages/sections/partners/add-partner/add-partner.module#AddPartnerModule",
      },

      // sliders
      {
        path: "sliders/all-sliders",
        loadChildren:
          "./pages/sections/sliders/all-sliders/all-sliders.module#AllslidersModule",
      },

      {
        path: "sliders/slider",
        loadChildren:
          "./pages/sections/sliders/add-slider/add-slider.module#AddSliderModule",
      },
      {
        path: "sliders/slider/:id",
        loadChildren:
          "./pages/sections/sliders/add-slider/add-slider.module#AddSliderModule",
      },

      // correspondenceMails
      {
        path: "correspondenceMails/all-correspondenceMails",
        loadChildren:
          "./pages/sections/correspondenceMails/all-correspondenceMails/all-correspondenceMails.module#AllcorrespondenceMailsModule",
      },

      {
        path: "correspondenceMails/add-correspondenceMail",
        loadChildren:
          "./pages/sections/correspondenceMails/add-correspondenceMail/add-correspondenceMail.module#AddcorrespondenceMailModule",
      },
      {
        path: "correspondenceMails/add-correspondenceMail/:id",
        loadChildren:
          "./pages/sections/correspondenceMails/add-correspondenceMail/add-correspondenceMail.module#AddcorrespondenceMailModule",
      },

      // services
      {
        path: "services/all-services",
        loadChildren:
          "./pages/sections/services/all-services/all-services.module#AllServicesModule",
      },
      {
        path: "services/service",
        loadChildren:
          "./pages/sections/services/add-service/add-service.module#AddServiceModule",
      },
      {
        path: "services/service/:id",
        loadChildren:
          "./pages/sections/services/add-service/add-service.module#AddServiceModule",
      },

      // chances
      {
        path: "chances/all-chances",
        loadChildren:
          "./pages/sections/chances/all-chances/all-chances.module#AllChancesModule",
      },
      {
        path: "chances/chance",
        loadChildren:
          "./pages/sections/chances/add-chance/add-chance.module#AddChanceModule",
      },
      {
        path: "chances/chance/:id",
        loadChildren:
          "./pages/sections/chances/add-chance/add-chance.module#AddChanceModule",
      },

      //home section
      {
        path: "home-section/all-sections",
        loadChildren:
          "./pages/sections/homeSection/all-sections/all-sections.module#AllHomeSectionModule",
      },
      {
        path: "home-section/edit-section/:id",
        loadChildren:
          "./pages/sections/homeSection/add-section/add-section.module#AddHomeSectionModule",
      },

      // projects
      {
        path: "projects/all-projects",
        loadChildren:
          "./pages/sections/projects/all-projects/all-projects.module#AllProjectsModule",
      },
      {
        path: "projects/project",
        loadChildren:
          "./pages/sections/projects/add-project/add-project.module#AddProjectModule",
      },
      {
        path: "projects/project/:id",
        loadChildren:
          "./pages/sections/projects/add-project/add-project.module#AddProjectModule",
      },

      // marketing
      {
        // /companies/all-companies
        path: "marketing/all-companies",
        loadChildren:
          "./pages/sections/companies/all-companies/all-companies.module#AllCompaniesModule",
      },
      {
        path: "marketing/company",
        loadChildren:
          "./pages/sections/companies/add-company/add-company.module#AddCompanyModule",
      },
      {
        path: "marketing/company/:id",
        loadChildren:
          "./pages/sections/companies/add-company/add-company.module#AddCompanyModule",
      },
      // rentes
      {
        path: "rentes/all-rentes",
        loadChildren:
          "./pages/sections/rentes/all-rentes/all-rentes.module#AllRentesModule",
      },
      {
        path: "rentes/rente/:id",
        loadChildren:
          "./pages/sections/rentes/show-rente/show-rente.module#ShowRenteModule",
      },

      // stations
      {
        path: "stations/all-stations",
        loadChildren:
          "./pages/sections/stations/all-stations/all-stations.module#AllstationsModule",
      },
      {
        path: "stations/station",
        loadChildren:
          "./pages/sections/stations/add-station/add-station.module#AddStationModule",
      },
      {
        path: "stations/station/:id",
        loadChildren:
          "./pages/sections/stations/add-station/add-station.module#AddStationModule",
      },

      // shops
      {
        path: "shops/all-shops",
        loadChildren:
          "./pages/sections/shops/all-shops/all-shops.module#AllShopsModule",
      },
      {
        path: "shops/shop",
        loadChildren:
          "./pages/sections/shops/add-shop/add-shop.module#AddShopModule",
      },
      {
        path: "shops/shop/:id",
        loadChildren:
          "./pages/sections/shops/add-shop/add-shop.module#AddShopModule",
      },

      {
        path: "shops/shop-show/:id",
        loadChildren:
          "./pages/sections/shops/show-shop/show-shop.module#ShowShopModule",
      },

      // Start My Own Pathes
      // Main Components
      //pages
      {
        path: "pages/all-pages",
        loadChildren:
          "./pages/main-components/pages/all-pages/all-pages.module#AllPagesModule",
      },
      {
        path: "pages/page",
        loadChildren:
          "./pages/main-components/pages/add-page/add-page.module#AddPageModule",
      },
      {
        path: "pages/page/:id",
        loadChildren:
          "./pages/main-components/pages/add-page/add-page.module#AddPageModule",
      },

      //levels
      {
        path: "levels/all-levels",
        loadChildren:
          "./pages/main-components/levels/all-levels/all-levels.module#AllLevelsModule",
      },
      {
        path: "levels/level",
        loadChildren:
          "./pages/main-components/levels/add-level/add-level.module#AddLevelModule",
      },
      {
        path: "levels/level/:id",
        loadChildren:
          "./pages/main-components/levels/add-level/add-level.module#AddLevelModule",
      },

      //management
      {
        path: "management/all-admins",
        loadChildren:
          "./pages/main-components/managements/all-admins/all-admins.module#AllAdminsModule",
      },
      {
        path: "management/admin",
        loadChildren:
          "./pages/main-components/managements/add-admin/add-admin.module#AddAdminModule",
      },
      {
        path: "management/admin/:id",
        loadChildren:
          "./pages/main-components/managements/add-admin/add-admin.module#AddAdminModule",
      },

      //members
      {
        path: "members/all-members",
        loadChildren:
          "./pages/main-components/members/all-members/all-members.module#AllMembersModule",
      },
      {
        path: "members/member",
        loadChildren:
          "./pages/main-components/members/add-member/add-member.module#AddMemberModule",
      },
      {
        path: "members/member/:id",
        loadChildren:
          "./pages/main-components/members/add-member/add-member.module#AddMemberModule",
      },
      {
        path: "members/show-member/:id",
        loadChildren:
          "./pages/main-components/members/show-member/show-member.module#ShowMemberModule",
      },

      //settings
      {
        path: "settings",
        loadChildren:
          "./pages/main-components/settings/all-settings/all-settings.module#AllSettingsModule",
      },

      //my-profile
      {
        path: "my-profile",
        loadChildren:
          "./pages/main-components/profile/my-profile/my-profile.module#MyProfileModule",
      },

      // End My Own Pathes

      {
        path: "404",
        loadChildren: "./pages/not-found/not-found.module#NotFoundModule",
      },
      {
        path: "",
        redirectTo: "index",
        pathMatch: "full",
      },
    ],
  },

  {
    path: "login",
    component: LoginComponent,
  },

  {
    path: "**",
    redirectTo: "404",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, LoginModule],
})
export class ThemeRoutingModule {}
