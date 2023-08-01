import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthGuard } from './auth.guard';

import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';

// Start Main Components
import { UserService } from "./_services/user.service";
import { CommonService } from "./_services/common.service";

import { SettingsService } from "./theme/pages/main-components/settings/settings.service";
import { PagesService } from "./theme/pages/main-components/pages/pages.service";

import { LevelsService } from "./theme/pages/main-components/levels/levels.service";

import { TokenInterceptorService } from './token-interceptor.service';
// End Main Components

// Start Main Sections

import { LanguagesService } from "./theme/pages/sections/languages/languages.service";

import { PartnersService } from "./theme/pages/sections/partners/partners.service";
import {ServicesService} from "./theme/pages/sections/services/services.service";
import {ChancesService} from "./theme/pages/sections/chances/chances.service";
import {ProjectService} from "./theme/pages/sections/projects/projects.service";
import {RanteService} from "./theme/pages/sections/rentes/rentes.service";
import {StationService} from "./theme/pages/sections/stations/stations.service"
import {ShopsService} from "./theme/pages/sections/shops/shops.service"
// End Main Sections
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { RouterModule } from '@angular/router';

import { SweetAlertService } from 'angular-sweetalert-service';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CompanyService } from './theme/pages/sections/companies/companies.service';
import { slidersService } from './theme/pages/sections/sliders/sliders.service';
import { CorrespondenceMailsService } from './theme/pages/sections/correspondenceMails/correspondenceMails.service';
// import { UploadFilesComponentComp } from './theme/pages/main-components/upload-files-co/upload-files-co.component';

@NgModule({
    declarations: [
        ThemeComponent,
        AppComponent,

    ],
    imports: [
        RouterModule,
        LayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ThemeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,


        // NgbModule,
      NgbModule ,
    ],
    providers: [
        ScriptLoaderService,
        CommonService,
        UserService,
        SettingsService,
        PagesService,
        LevelsService,
        LanguagesService,
        ShopsService,
        slidersService
        ,
        RanteService,
        ServicesService,
        ChancesService,
        ProjectService,
        CompanyService,
        PartnersService,
        StationService,
      CorrespondenceMailsService,
        SweetAlertService,
        Title,
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
