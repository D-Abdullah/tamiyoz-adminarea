import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LevelsService } from "../levels.service";
import { CommonService } from "../../../../../_services/common.service";
import { ScriptLoaderService } from "../../../../../_services/script-loader.service";

import { SweetAlertService } from "angular-sweetalert-service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { FormBuilder } from "@angular/forms";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-level",
  templateUrl: "./add-level.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AddLevelComponent implements OnInit {
  action: string;
  page_id: string;
  add_action: boolean;
  edit_action: boolean;

  level_name_title: string = "";

  success_level_name: boolean = false;

  // /////////////////////////////////////////////////////////////

  disable_pages_edit = false;
  disable_levels_edit = false;
  // disable_members_edit = false;
  // disable_members_add_mony = false;
  // disable_members_details_view = false;
  disable_admins_edit = false;

  disable_languages_edit = false;
  disable_services_edit = false;
  disable_projects_edit = false;

  disable_sliders_edit = false;
  disable_home_section_edit = false;
  disable_stations_edit = false;
  disable_shops_edit = false;
  disable_chances_edit = false;
  disable_companies_edit = false;
  disable_correspondence_mails_edit = false;
  disable_partners_edit = false;

  disable_rentes_edit = false;
  // disable_books_edit = false;

  // disable_categories_edit = false;

  // disable_reasons_edit = false;
  // disable_cars_edit = false;
  disable_places_edit = false;
  disable_representative_edit = false;
  // disable_discount_code_edit = false;
  // disable_distance_time_edit = false;
  disable_order_details_view = false;
  // disable_cars_add_requists_details_view = false;

  disablebtn: boolean = false;
  // /////////////////////////////////////////////////////////////

  disable_pages_delete = false;
  disable_levels_delete = false;
  disable_members_delete = false;
  disable_admins_delete = false;

  disable_languages_delete = false;
  disable_services_delete = false;
  disable_projects_delete = false;

  disable_sliders_delete = false;
  disable_stations_delete = false;
  disable_shops_delete = false;
  disable_chances_delete = false;
  disable_partners_delete = false;
  disable_rentes_delete = false;

  disable_companies_delete = false;

  disable_correspondence_mails_delete = false;
  // disable_books_delete = false;

  // disable_categories_delete = false;
  // disable_reasons_delete = false;
  // disable_cars_delete = false;
  disable_places_delete = false;
  disable_representative_delete = false;
  // disable_discount_code_delete = false;
  // disable_distance_time_delete = false;
  disable_orders_delete = false;
  // disable_cars_add_requists_delete = false;
  // disable_cars_add_requists_edit = false;
  // disable_complaints_delete = false;

  ////////////////////////////////////////////////////////////////

  levelObj: any = {
    level_name: "",
    settings_view: true,
    main_view: true,
    pages_add: true,
    pages_edit: true,
    pages_delete: true,
    pages_view: true,
    levels_add: true,
    levels_edit: true,
    levels_delete: true,
    levels_view: true,
    // members_add: true,
    // members_edit: true,
    // members_add_mony: true,
    // members_details_view: true,
    // members_delete: true,
    // members_view: true,
    admins_add: true,
    admins_edit: true,
    admins_delete: true,
    admins_view: true,
    my_profile_view: true,

    languages_add: true,
    languages_edit: true,
    languages_delete: true,
    languages_view: true,

    companies_add: true,
    companies_edit: true,
    companies_delete: true,
    companies_view: true,

    correspondence_mails_add: true,
    correspondence_mails_edit: true,
    correspondence_mails_delete: true,
    correspondence_mails_view: true,

    services_add: true,
    services_edit: true,
    services_delete: true,
    services_view: true,

    projects_add: true,
    projects_edit: true,
    projects_delete: true,
    projects_view: true,

    sliders_add: true,
    sliders_edit: true,
    sliders_delete: true,
    sliders_view: true,

    home_section_view: true,
    home_section_edit: true,

    stations_add: true,
    stations_edit: true,
    stations_delete: true,
    stations_view: true,

    shops_add: true,
    shops_edit: true,
    shops_delete: true,
    shops_view: true,

    chances_add: true,
    chances_edit: true,
    chances_delete: true,
    chances_view: true,

    partners_add: true,
    partners_edit: true,
    partners_delete: true,
    partners_view: true,

    // rentes_add: true,
    // rentes_edit: true,
    rentes_delete: true,
    rentes_view: true,
    // books_add: true,
    // books_edit: true,
    // books_delete: true,
    // books_view: true,

    // categories_add: true,
    // categories_edit: true,
    // categories_delete: true,
    // categories_view: true,

    // reasons_add: true,
    // reasons_edit: true,
    // reasons_delete: true,
    // reasons_view: true,

    // cars_add: true,
    // cars_edit: true,
    // cars_delete: true,
    // cars_view: true,

    // places_add: true,
    // places_edit: true,
    // places_delete: true,
    // places_view: true,

    representative_add: true,
    assign_order_driver: true,
    representative_edit: true,
    representative_delete: true,
    representative_view: true,

    // discount_code_add: true,
    // discount_code_edit: true,
    // discount_code_delete: true,
    // discount_code_view: true,

    // distance_time_add: true,
    // distance_time_edit: true,
    // distance_time_delete: true,
    // distance_time_view: true,

    orders_view: true,
    orders_delete: true,
    order_details_view: true,

    // cars_add_requists_view: true,
    // cars_add_requists_delete: true,
    // cars_add_requists_edit: true,
    // cars_add_requists_details_view: true,

    // complaints_view: true,
    // complaints_delete: true,
  };

  user_id;
  levels_add: boolean;
  levels_edit: boolean;

  isDataAvailable: boolean = false;
  loadingImgPath: string = "";

  public levelNameErrorMsg: string = "يرجى إدخال اسم المستوى";

  constructor(
    public http: HttpClient,
    public commService: CommonService,
    public levelService: LevelsService,
    private fb: FormBuilder,
    private alertService: SweetAlertService,
    private router: Router,
    private actRouter: ActivatedRoute,
    private _script: ScriptLoaderService
  ) {
    this.loadingImgPath = this.commService._hostName + "uploads/loading-1.gif";
  }

  addEditPage() {
    this.disablebtn = true;

    this.levelObj["user_id"] = this.user_id;
    this.levelObj["id"] = this.page_id;
    // this.levelObj["level_name"] = 'admin';

    if (this.levelObj.level_name !== "") {
      this.levelService.addEditLevel(this.levelObj).subscribe((data) => {
        if (data) {
          this.disablebtn = false;
          if (this.action === "add" && this.page_id === null) {
            this.resetInputs();

            this.alertService.success({
              title: "حفظ المستوى",
              text: "تم حفظ بيانات المستوى بنجاح.",
            });
          } else {
            this.alertService.success({
              title: "تعديل المستوى",
              text: "تم تعديل بيانات المستوى بنجاح.",
            });
          }
        }
      });
    } else {
      this.success_level_name = true;
    }
  }

  backToAllpages() {
    this.router.navigate(["/levels/all-levels"]);
  }

  resetInputs() {
    this.success_level_name = false;

    this.levelObj.level_name = "";
    this.levelObj.settings_view = false;
    this.levelObj.main_view = false;
    this.levelObj.pages_add = false;
    this.levelObj.pages_edit = false;
    this.levelObj.pages_delete = false;
    this.levelObj.pages_view = false;
    this.levelObj.levels_add = false;
    this.levelObj.levels_edit = false;
    this.levelObj.levels_delete = false;
    this.levelObj.levels_view = false;
    // this.levelObj.members_add = false;
    // this.levelObj.members_edit = false;
    // this.levelObj.members_add_mony = false;
    // this.levelObj.members_details_view = false;
    // this.levelObj.members_delete = false;
    // this.levelObj.members_view = false;
    this.levelObj.admins_add = false;
    this.levelObj.admins_edit = false;
    this.levelObj.admins_delete = false;
    this.levelObj.admins_view = false;
    this.levelObj.my_profile_view = false;

    this.levelObj.languages_add = false;
    this.levelObj.languages_edit = false;
    this.levelObj.languages_delete = false;
    this.levelObj.languages_view = false;

    this.levelObj.companies_add = false;
    this.levelObj.companies_edit = false;
    this.levelObj.companies_delete = false;
    this.levelObj.companies_view = false;

    this.levelObj.correspondence_mails_add = false;
    this.levelObj.correspondence_mails_edit = false;
    this.levelObj.correspondence_mails_delete = false;
    this.levelObj.correspondence_mails_view = false;

    this.levelObj.services_add = false;
    this.levelObj.services_edit = false;
    this.levelObj.services_delete = false;
    this.levelObj.services_view = false;

    //projects
    this.levelObj.projects_add = false;
    this.levelObj.projects_edit = false;
    this.levelObj.projects_delete = false;
    this.levelObj.projects_view = false;

    //sliders
    this.levelObj.sliders_add = false;
    this.levelObj.sliders_edit = false;
    this.levelObj.sliders_delete = false;
    this.levelObj.sliders_view = false;

    //home_section
    this.levelObj.home_section_edit = false;
    this.levelObj.home_section_view = false;

    //stations
    this.levelObj.stations_add = false;
    this.levelObj.stations_edit = false;
    this.levelObj.stations_delete = false;
    this.levelObj.stations_view = false;

    //shops
    this.levelObj.shops_add = false;
    this.levelObj.shops_edit = false;
    this.levelObj.shops_delete = false;
    this.levelObj.shops_view = false;

    //chances
    this.levelObj.chances_add = false;
    this.levelObj.chances_edit = false;
    this.levelObj.chances_delete = false;
    this.levelObj.chances_view = false;

    //partners
    this.levelObj.partners_add = false;
    this.levelObj.partners_edit = false;
    this.levelObj.partners_delete = false;
    this.levelObj.partners_view = false;

    //rentes
    // this.levelObj.rentes_add = false;
    // this.levelObj.rentes_edit = false;
    this.levelObj.rentes_delete = false;
    this.levelObj.rentes_view = false;

    // this.levelObj.books_add = false;
    // this.levelObj.books_edit = false;
    // this.levelObj.books_delete = false;
    // this.levelObj.books_view = false;

    // this.levelObj.categories_add = false;
    // this.levelObj.categories_edit = false;
    // this.levelObj.categories_delete = false;
    // this.levelObj.categories_view = false;

    // this.levelObj.reasons_add = false;
    // this.levelObj.reasons_edit = false;
    // this.levelObj.reasons_delete = false;
    // this.levelObj.reasons_view = false;

    // this.levelObj.cars_add = false;
    // this.levelObj.cars_edit = false;
    // this.levelObj.cars_delete = false;
    // this.levelObj.cars_view = false;

    // this.levelObj.places_add = false;
    // this.levelObj.places_edit = false;
    // this.levelObj.places_delete = false;
    // this.levelObj.places_view = false;

    this.levelObj.representative_add = false;
    this.levelObj.assign_order_driver = false;
    this.levelObj.representative_edit = false;
    this.levelObj.representative_delete = false;
    this.levelObj.representative_view = false;

    // this.levelObj.discount_code_add = false;
    // this.levelObj.discount_code_edit = false;
    // this.levelObj.discount_code_delete = false;
    // this.levelObj.discount_code_view = false;

    // this.levelObj.distance_time_add = false;
    // this.levelObj.distance_time_edit = false;
    // this.levelObj.distance_time_delete = false;
    // this.levelObj.distance_time_view = false;

    this.levelObj.orders_view = false;
    this.levelObj.orders_delete = false;
    this.levelObj.order_details_view = false;

    // this.levelObj.cars_add_requists_view = false;
    // this.levelObj.cars_add_requists_delete = false;
    // this.levelObj.cars_add_requists_edit = false;
    // this.levelObj.cars_add_requists_details_view = false;

    // this.levelObj.complaints_view = false;
    // this.levelObj.complaints_delete = false;
  }

  getOneLevel(id) {
    let levelId = parseInt(id);

    this.levelService.getOneLevel(levelId).subscribe((data) => {
      if (data) {
        console.log(data);

        // Main Components

        this.level_name_title = data.level_name;
        this.levelObj.level_name = data.level_name;

        this.levelObj.settings_view = data.settings_view === "0" ? false : true;
        this.levelObj.main_view = data.main_view === "0" ? false : true;

        this.levelObj.pages_add = data.pages_add === "0" ? false : true;
        this.levelObj.pages_edit = data.pages_edit === "0" ? false : true;
        this.levelObj.pages_delete = data.pages_delete === "0" ? false : true;
        this.levelObj.pages_view = data.pages_view === "0" ? false : true;
        if (data.pages_view === "0") {
          this.disable_pages_edit = true;
          this.disable_pages_delete = true;
        }

        this.levelObj.levels_add = data.levels_add === "0" ? false : true;
        this.levelObj.levels_edit = data.levels_edit === "0" ? false : true;
        this.levelObj.levels_delete = data.levels_delete === "0" ? false : true;
        this.levelObj.levels_view = data.levels_view === "0" ? false : true;
        if (data.levels_view === "0") {
          this.disable_levels_edit = true;
          this.disable_levels_delete = true;
        }

        // this.levelObj.members_add = data.members_add === '0' ? false : true;
        // this.levelObj.members_edit = data.members_edit === '0' ? false : true;
        // this.levelObj.members_add_mony = data.members_add_mony === '0' ? false : true;
        // this.levelObj.members_details_view = data.members_details_view === '0' ? false : true;
        // this.levelObj.members_delete = data.members_delete === '0' ? false : true;
        // this.levelObj.members_view = data.members_view === '0' ? false : true;
        // if (data.members_view === '0') { this.disable_members_add_mony = true; this.disable_members_edit = true; this.disable_members_details_view = true; this.disable_members_delete = true; }

        this.levelObj.admins_add = data.admins_add === "0" ? false : true;
        this.levelObj.admins_edit = data.admins_edit === "0" ? false : true;
        this.levelObj.admins_delete = data.admins_delete === "0" ? false : true;
        this.levelObj.admins_view = data.admins_view === "0" ? false : true;
        if (data.admins_view === "0") {
          this.disable_admins_edit = true;
          this.disable_admins_delete = true;
        }

        this.levelObj.my_profile_view =
          data.my_profile_view === "0" ? false : true;

        // Main Sections

        this.levelObj.languages_add = data.languages_add === "0" ? false : true;
        this.levelObj.languages_edit =
          data.languages_edit === "0" ? false : true;
        this.levelObj.languages_delete =
          data.languages_delete === "0" ? false : true;
        this.levelObj.languages_view =
          data.languages_view === "0" ? false : true;
        if (data.languages_view === "0") {
          this.disable_languages_edit = true;
          this.disable_languages_delete = true;
        }

        //companies
        this.levelObj.companies_add = data.companies_add === "0" ? false : true;
        this.levelObj.companies_edit =
          data.companies_edit === "0" ? false : true;
        this.levelObj.companies_delete =
          data.companies_delete === "0" ? false : true;
        this.levelObj.companies_view =
          data.companies_view === "0" ? false : true;
        if (data.companies_view === "0") {
          this.disable_companies_edit = true;
          this.disable_companies_delete = true;
        }

        //correspondence_mails
        this.levelObj.correspondence_mails_add =
          data.correspondence_mails_add === "0" ? false : true;
        this.levelObj.correspondence_mails_edit =
          data.correspondence_mails_edit === "0" ? false : true;
        this.levelObj.correspondence_mails_delete =
          data.correspondence_mails_delete === "0" ? false : true;
        this.levelObj.correspondence_mails_view =
          data.correspondence_mails_view === "0" ? false : true;
        if (data.correspondence_mails_view === "0") {
          this.disable_correspondence_mails_edit = true;
          this.disable_correspondence_mails_delete = true;
        }

        //services

        this.levelObj.services_add = data.services_add === "0" ? false : true;
        this.levelObj.services_edit = data.services_edit === "0" ? false : true;
        this.levelObj.services_delete =
          data.services_delete === "0" ? false : true;
        this.levelObj.services_view = data.services_view === "0" ? false : true;
        if (data.services_view === "0") {
          this.disable_services_edit = true;
          this.disable_services_delete = true;
        }
        //projects
        this.levelObj.projects_add = data.projects_add === "0" ? false : true;
        this.levelObj.projects_edit = data.projects_edit === "0" ? false : true;
        this.levelObj.projects_delete =
          data.projects_delete === "0" ? false : true;
        this.levelObj.projects_view = data.projects_view === "0" ? false : true;
        if (data.projects_view === "0") {
          this.disable_projects_edit = true;
          this.disable_projects_delete = true;
        }

        //sliders
        this.levelObj.sliders_add = data.sliders_add === "0" ? false : true;
        this.levelObj.sliders_edit = data.sliders_edit === "0" ? false : true;
        this.levelObj.sliders_delete =
          data.sliders_delete === "0" ? false : true;
        this.levelObj.sliders_view = data.sliders_view === "0" ? false : true;
        if (data.sliders_view === "0") {
          this.disable_sliders_edit = true;
          this.disable_sliders_delete = true;
        }
        //home_section
        this.levelObj.home_section_edit =
          data.home_section_edit === "0" ? false : true;
        this.levelObj.home_section_view =
          data.home_section_view === "0" ? false : true;
        if (data.home_section_view === "0") {
          this.disable_home_section_edit = true;
        }

        //stations
        this.levelObj.stations_add = data.stations_add === "0" ? false : true;
        this.levelObj.stations_edit = data.stations_edit === "0" ? false : true;
        this.levelObj.stations_delete =
          data.stations_delete === "0" ? false : true;
        this.levelObj.stations_view = data.stations_view === "0" ? false : true;
        if (data.stations_view === "0") {
          this.disable_stations_edit = true;
          this.disable_stations_delete = true;
        }

        //shops
        this.levelObj.shops_add = data.shops_add === "0" ? false : true;
        this.levelObj.shops_edit = data.shops_edit === "0" ? false : true;
        this.levelObj.shops_delete = data.shops_delete === "0" ? false : true;
        this.levelObj.shops_view = data.shops_view === "0" ? false : true;
        if (data.shops_view === "0") {
          this.disable_shops_edit = true;
          this.disable_shops_delete = true;
        }

        //chances
        this.levelObj.chances_add = data.chances_add === "0" ? false : true;
        this.levelObj.chances_edit = data.chances_edit === "0" ? false : true;
        this.levelObj.chances_delete =
          data.chances_delete === "0" ? false : true;
        this.levelObj.chances_view = data.chances_view === "0" ? false : true;
        if (data.chances_view === "0") {
          this.disable_chances_edit = true;
          this.disable_chances_delete = true;
        }

        //partners
        this.levelObj.partners_add = data.partners_add === "0" ? false : true;
        this.levelObj.partners_edit = data.partners_edit === "0" ? false : true;
        this.levelObj.partners_delete =
          data.partners_delete === "0" ? false : true;
        this.levelObj.partners_view = data.partners_view === "0" ? false : true;
        if (data.partners_view === "0") {
          this.disable_partners_edit = true;
          this.disable_partners_delete = true;
        }

        //rentes
        // this.levelObj.rentes_add = data.rentes_add === '0' ? false : true;
        // this.levelObj.rentes_edit = data.rentes_edit === '0' ? false : true;
        this.levelObj.rentes_delete = data.rentes_delete === "0" ? false : true;
        this.levelObj.rentes_view = data.rentes_view === "0" ? false : true;
        if (data.rentes_view === "0") {
          this.disable_rentes_edit = true;
          this.disable_rentes_delete = true;
        }

        // this.levelObj.books_add = data.books_add === '0' ? false : true;
        // this.levelObj.books_edit = data.books_edit === '0' ? false : true;
        // this.levelObj.books_delete = data.books_delete === '0' ? false : true;
        // this.levelObj.books_view = data.books_view === '0' ? false : true;
        // if (data.books_view === '0') { this.disable_books_edit = true; this.disable_books_delete = true; }

        // this.levelObj.categories_add = data.categories_add === '0' ? false : true;
        // this.levelObj.categories_edit = data.categories_edit === '0' ? false : true;
        // this.levelObj.categories_delete = data.categories_delete === '0' ? false : true;
        // this.levelObj.categories_view = data.categories_view === '0' ? false : true;
        // if (data.categories_view === '0') { this.disable_categories_edit = true; this.disable_categories_delete = true; }

        // this.levelObj.reasons_add = data.reasons_add === '0' ? false : true;
        // this.levelObj.reasons_edit = data.reasons_edit === '0' ? false : true;
        // this.levelObj.reasons_delete = data.reasons_delete === '0' ? false : true;
        // this.levelObj.reasons_view = data.reasons_view === '0' ? false : true;
        // if (data.reasons_view === '0') { this.disable_reasons_edit = true; this.disable_reasons_delete = true; }

        // this.levelObj.cars_add = data.cars_add === '0' ? false : true;
        // this.levelObj.cars_edit = data.cars_edit === '0' ? false : true;
        // this.levelObj.cars_delete = data.cars_delete === '0' ? false : true;
        // this.levelObj.cars_view = data.cars_view === '0' ? false : true;
        // if (data.cars_view === '0') { this.disable_cars_edit = true; this.disable_cars_delete = true; }

        // this.levelObj.places_add = data.places_add === '0' ? false : true;
        // this.levelObj.places_edit = data.places_edit === '0' ? false : true;
        // this.levelObj.places_delete = data.places_delete === '0' ? false : true;
        // this.levelObj.places_view = data.places_view === '0' ? false : true;
        // if (data.places_view === '0') { this.disable_places_edit = true; this.disable_places_delete = true;

        // }

        // this.levelObj.representative_add = data.representative_add === '0' ? false : true;
        // this.levelObj.assign_order_driver = data.assign_order_driver === '0' ? false : true;
        // this.levelObj.representative_edit = data.representative_edit === '0' ? false : true;
        // this.levelObj.representative_delete = data.representative_delete === '0' ? false : true;
        // this.levelObj.representative_view = data.representative_view === '0' ? false : true;
        // if (data.representative_view === '0') { this.disable_representative_edit = true; this.disable_representative_delete = true; }

        // this.levelObj.discount_code_add = data.discount_code_add === '0' ? false : true;
        // this.levelObj.discount_code_edit = data.discount_code_edit === '0' ? false : true;
        // this.levelObj.discount_code_delete = data.discount_code_delete === '0' ? false : true;
        // this.levelObj.discount_code_view = data.discount_code_view === '0' ? false : true;
        // if (data.discount_code_view === '0') { this.disable_discount_code_edit = true; this.disable_discount_code_delete = true; }

        // this.levelObj.distance_time_add = data.distance_time_add === '0' ? false : true;
        // this.levelObj.distance_time_edit = data.distance_time_edit === '0' ? false : true;
        // this.levelObj.distance_time_delete = data.distance_time_delete === '0' ? false : true;
        // this.levelObj.distance_time_view = data.distance_time_view === '0' ? false : true;
        // if (data.distance_time_view === '0') { this.disable_distance_time_edit = true; this.disable_distance_time_delete = true; }

        // this.levelObj.orders_view = data.orders_view === '0' ? false : true;
        // this.levelObj.orders_delete = data.orders_delete === '0' ? false : true;
        // this.levelObj.order_details_view = data.order_details_view === '0' ? false : true;
        // if (data.orders_view === '0') { this.disable_order_details_view = true; this.disable_orders_delete = true; }

        // this.levelObj.cars_add_requists_view = data.cars_add_requists_view === '0' ? false : true;
        // this.levelObj.cars_add_requists_delete = data.cars_add_requists_delete === '0' ? false : true;
        // this.levelObj.cars_add_requists_edit = data.cars_add_requists_edit === '0' ? false : true;
        // this.levelObj.cars_add_requists_details_view = data.cars_add_requists_details_view === '0' ? false : true;
        // if (data.cars_add_requists_view === '0') { this.disable_cars_add_requists_details_view = true; this.disable_cars_add_requists_delete = true;this.disable_cars_add_requists_edit = true; }

        // this.levelObj.complaints_view = data.complaints_view === '0' ? false : true;
        // this.levelObj.complaints_delete = data.complaints_delete === '0' ? false : true;

        this.isDataAvailable = true;
      }
    });
  }

  changeEditAction(e, page) {
    // Main Components

    if (page === "pages") {
      if (e.target.checked) {
        this.disable_pages_edit = false;
        this.disable_pages_delete = false;
      } else {
        this.levelObj.pages_edit = false;
        this.levelObj.pages_delete = false;
        this.disable_pages_edit = true;
        this.disable_pages_delete = true;
      }
    }

    if (page === "levels") {
      if (e.target.checked) {
        this.disable_levels_edit = false;
        this.disable_levels_delete = false;
      } else {
        this.levelObj.levels_edit = false;
        this.levelObj.levels_delete = false;
        this.disable_levels_edit = true;
        this.disable_levels_delete = true;
      }
    }

    // if (page === 'members') {
    //     if (e.target.checked) { this.disable_members_edit = false; this.disable_members_add_mony = false; this.disable_members_details_view = false; this.disable_members_delete = false; }
    //     else { this.levelObj.members_edit = false; this.levelObj.members_add_mony = false; this.levelObj.members_details_view = false; this.levelObj.members_delete = false; this.disable_members_edit = true; this.disable_members_add_mony = true; this.disable_members_details_view = true; this.disable_members_delete = true; }
    // }

    if (page === "admins") {
      if (e.target.checked) {
        this.disable_admins_edit = false;
        this.disable_admins_delete = false;
      } else {
        this.levelObj.admins_edit = false;
        this.levelObj.admins_delete = false;
        this.disable_admins_edit = true;
        this.disable_admins_delete = true;
      }
    }

    // Main Sections

    if (page === "languages") {
      if (e.target.checked) {
        this.disable_languages_edit = false;
        this.disable_languages_delete = false;
      } else {
        this.levelObj.languages_edit = false;
        this.levelObj.languages_delete = false;
        this.disable_languages_edit = true;
        this.disable_languages_delete = true;
      }
    }

    if (page === "companies") {
      if (e.target.checked) {
        this.disable_companies_edit = false;
        this.disable_companies_delete = false;
      } else {
        this.levelObj.companies_edit = false;
        this.levelObj.companies_delete = false;
        this.disable_companies_edit = true;
        this.disable_companies_delete = true;
      }
    }

    if (page === "correspondence_mails") {
      if (e.target.checked) {
        this.disable_correspondence_mails_edit = false;
        this.disable_correspondence_mails_delete = false;
      } else {
        this.levelObj.correspondence_mails_edit = false;
        this.levelObj.correspondence_mails_delete = false;
        this.disable_correspondence_mails_edit = true;
        this.disable_correspondence_mails_delete = true;
      }
    }

    if (page === "services") {
      if (e.target.checked) {
        this.disable_services_edit = false;
        this.disable_services_delete = false;
      } else {
        this.levelObj.services_edit = false;
        this.levelObj.services_delete = false;
        this.disable_services_edit = true;
        this.disable_services_delete = true;
      }
    }

    if (page === "projects") {
      if (e.target.checked) {
        this.disable_projects_edit = false;
        this.disable_projects_delete = false;
      } else {
        this.levelObj.projects_edit = false;
        this.levelObj.projects_delete = false;
        this.disable_projects_edit = true;
        this.disable_projects_delete = true;
      }
    }

    if (page === "sliders") {
      if (e.target.checked) {
        this.disable_sliders_edit = false;
        this.disable_sliders_delete = false;
      } else {
        this.levelObj.sliders_edit = false;
        this.levelObj.sliders_delete = false;
        this.disable_sliders_edit = true;
        this.disable_sliders_delete = true;
      }
    }
    if (page === "home_section") {
      if (e.target.checked) {
        this.disable_home_section_edit = false;
      } else {
        this.levelObj.home_section_edit = false;
        this.disable_home_section_edit = true;
      }
    }

    if (page === "stations") {
      if (e.target.checked) {
        this.disable_stations_edit = false;
        this.disable_stations_delete = false;
      } else {
        this.levelObj.stations_edit = false;
        this.levelObj.stations_delete = false;
        this.disable_stations_edit = true;
        this.disable_stations_delete = true;
      }
    }

    if (page === "shops") {
      if (e.target.checked) {
        this.disable_shops_edit = false;
        this.disable_shops_delete = false;
      } else {
        this.levelObj.shops_edit = false;
        this.levelObj.shops_delete = false;
        this.disable_shops_edit = true;
        this.disable_shops_delete = true;
      }
    }

    if (page === "chances") {
      if (e.target.checked) {
        this.disable_chances_edit = false;
        this.disable_chances_delete = false;
      } else {
        this.levelObj.chances_edit = false;
        this.levelObj.chances_delete = false;
        this.disable_chances_edit = true;
        this.disable_chances_delete = true;
      }
    }

    if (page === "partners") {
      if (e.target.checked) {
        this.disable_partners_edit = false;
        this.disable_partners_delete = false;
      } else {
        this.levelObj.partners_edit = false;
        this.levelObj.partners_delete = false;
        this.disable_partners_edit = true;
        this.disable_partners_delete = true;
      }
    }

    if (page === "rentes") {
      if (e.target.checked) {
        this.disable_rentes_edit = false;
        this.disable_rentes_delete = false;
      } else {
        this.levelObj.rentes_edit = false;
        this.levelObj.rentes_delete = false;
        this.disable_rentes_edit = true;
        this.disable_rentes_delete = true;
      }
    }

    // if (page === 'books') {
    //     if (e.target.checked) { this.disable_books_edit = false; this.disable_books_delete = false; }
    //     else { this.levelObj.books_edit = false; this.levelObj.books_delete = false; this.disable_books_edit = true; this.disable_books_delete = true; }
    // }

    // if (page === 'categories') {
    //     if (e.target.checked) { this.disable_categories_edit = false; this.disable_categories_delete = false; }
    //     else { this.levelObj.categories_edit = false; this.levelObj.categories_delete = false; this.disable_categories_edit = true; this.disable_categories_delete = true; }
    // }

    // if (page === 'reasons') {
    //     if (e.target.checked) { this.disable_reasons_edit = false; this.disable_reasons_delete = false; }
    //     else { this.levelObj.reasons_edit = false; this.levelObj.reasons_delete = false; this.disable_reasons_edit = true; this.disable_reasons_delete = true; }
    // }

    // if (page === 'cars') {
    //     if (e.target.checked) { this.disable_cars_edit = false; this.disable_cars_delete = false; }
    //     else { this.levelObj.cars_edit = false; this.levelObj.cars_delete = false; this.disable_cars_edit = true; this.disable_cars_delete = true; }
    // }

    // if (page === 'places') {
    //     if (e.target.checked) { this.disable_places_edit = false; this.disable_places_delete = false; }
    //     else { this.levelObj.places_edit = false; this.levelObj.places_delete = false; this.disable_places_edit = true; this.disable_places_delete = true; }
    // }
    // if (page === 'representative') {
    //     if (e.target.checked) { this.disable_representative_edit = false; this.disable_representative_delete = false; }
    //     else { this.levelObj.representative_edit = false; this.levelObj.representative_delete = false; this.disable_representative_edit = true; this.disable_representative_delete = true; }
    // }

    // if (page === 'discount_code') {
    //     if (e.target.checked) { this.disable_discount_code_edit = false; this.disable_discount_code_delete = false; }
    //     else { this.levelObj.discount_code_edit = false; this.levelObj.discount_code_delete = false; this.disable_discount_code_edit = true; this.disable_discount_code_delete = true; }
    // }
    // if (page === 'distance_time') {
    //     if (e.target.checked) { this.disable_distance_time_edit = false; this.disable_distance_time_delete = false; }
    //     else { this.levelObj.distance_time_edit = false; this.levelObj.distance_time_delete = false; this.disable_distance_time_edit = true; this.disable_distance_time_delete = true; }
    // }

    // if (page === 'orders') {
    //     if (e.target.checked) { this.disable_order_details_view = false; this.disable_orders_delete = false; }
    //     else { this.levelObj.order_details_view = false; this.levelObj.orders_delete = false; this.disable_order_details_view = true; this.disable_orders_delete = true; }
    // }
    // if (page === 'cars_add_requists') {
    //     if (e.target.checked) { this.disable_cars_add_requists_details_view = false; this.disable_cars_add_requists_delete = false; this.disable_cars_add_requists_edit = false;}
    //     else { this.levelObj.cars_add_requists_details_view = false; this.levelObj.cars_add_requists_delete = false;this.levelObj.cars_add_requists_edit = false; this.disable_cars_add_requists_details_view = true; this.disable_cars_add_requists_delete = true;this.disable_cars_add_requists_edit = true; }
    // }
  }

  ngOnInit() {
    if (localStorage.getItem("currentUser") === null) {
      this.router.navigate(["/login"]);
    } else {
      var currentUser = localStorage.getItem("currentUser");
      var retrievedObject = JSON.parse(currentUser);
      this.user_id = retrievedObject.id;

      let roles = ["levels_add", "levels_edit"];
      let userInfo = { user_id: this.user_id, roles: roles };

      this.commService.getUserLevel(userInfo).subscribe((res) => {
        if (res) {
          this.levels_add = res.levels_add === "1" ? true : false;
          this.levels_edit = res.levels_edit === "1" ? true : false;

          this.actRouter.paramMap.subscribe((params: ParamMap) => {
            this.page_id = params.get("id");

            if (this.page_id !== null) {
              this.commService.setTitle("تعديل المستوى");

              this.edit_action = true;
              this.action = "edit";

              if (this.levels_edit === true) {
                this.getOneLevel(this.page_id);
              } else {
                this.isDataAvailable = true;
              }
            } else if (this.page_id === null) {
              this.commService.setTitle("إضافة مستوى جديد");

              this.add_action = true;
              this.action = "add";
              this.isDataAvailable = true;
            } else {
              this.router.navigate(["/404"]);
            }
          });
        }
      });
    }
  }
}
