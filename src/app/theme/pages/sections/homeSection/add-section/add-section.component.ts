import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  NgModule,
  AfterViewInit,
} from "@angular/core";
// import { Http } from '@angular/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../../../../helpers";
import { sectionService } from "../sections.service";
import { CommonService } from "../../../../../_services/common.service";
import { ScriptLoaderService } from "../../../../../_services/script-loader.service";
// import { CategoriesService } from '../../../sections/categories/categories.service';
import { SweetAlertService } from "angular-sweetalert-service";

import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import {
  NgForm,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
// import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-home-section",
  templateUrl: "./add-section.component.html",
  // providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService],
  encapsulation: ViewEncapsulation.None,
})
export class AddHomeSectionComponent implements OnInit, AfterViewInit {
  public tools: object = {
    items: [
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "|",
      "FontName",
      "FontSize",
      "FontColor",
      "BackgroundColor",
      "|",
      "LowerCase",
      "UpperCase",
      "|",
      "Undo",
      "Redo",
      "|",
      "Formats",
      "Alignments",
      "|",
      "OrderedList",
      "UnorderedList",
      "|",
      "Indent",
      "Outdent",
      "|",
      "CreateLink",
      "CreateTable",
      "Image",
      "|",
      "ClearFormat",
      "Print",
      "SourceCode",
      "|",
      "FullScreen",
    ],
  };
  value: any = `<p></p>`;

  public insertImageSettings = {};
  action: string;
  page_id: string;
  add_action: boolean;
  edit_action: boolean;
  disablebtn: boolean = false;

  page_name_title: string = "";
  isDataAvailable: boolean = false;
  loadingImgPath: string = "";

  user_id;

  pages_add: boolean;
  pages_edit: boolean;

  langImgPath: string;

  lang_ar_name: string = "";
  lang_ar_code: string = "";
  lang_ar_image: string = "";

  status: boolean = true;

  lang_en_name: string = "";
  lang_en_code: string = "";
  lang_en_image: string = "";

  page_title_lang_en: string = "";
  page_sub_title_lang_en: string = "";
  page_title_lang_ar: string = "";
  page_sub_title_lang_ar: string = "";
  categore_parents: any[] = [];
  successfull_page_title_lang_ar: boolean = false;

  successfull_page_title_lang_en: boolean = false;
  successfull_m_summernote_ar: boolean = false;
  successfull_m_summernote_en: boolean = false;
  addEditLoader: boolean = false;

  page_title_lang_arErrorMsg: string = "يرجى إدخال عنوان العنصر باللغة العربية";

  page_title_lang_enErrorMsg: string =
    "يرجى إدخال عنوان العنصر باللغة الإنجليزية";
  m_summernote_arErrorMsg: string = "يرجى إدخال محتوى العنصر باللغة العربية";
  m_summernote_enErrorMsg: string = "يرجى إدخال محتوى العنصر باللغة الإنجليزية";

  file;
  Ico;
  formData: FormData = null;
  selectedFile: any = null;
  selectedIco: any = null;
  successRemoveImg: boolean = false;
  successRemoveIco: boolean = false;
  success_file: boolean = false;
  success_Ico: boolean = false;
  successImg: boolean = true;
  successIco: boolean = true;

  localUrl;
  localUrlIco;
  defaultImg: string;
  defaultIco: string;
  fileErrorMsg: string = "يرجى إدخال صورة العنصر  ";
  IcoErrorMsg: string = "يرجى إدخال ايقونه العنصر  ";

  constructor(
    public http: HttpClient,
    public commService: CommonService,
    public homeSectionService: sectionService,
    private fb: FormBuilder,
    private alertService: SweetAlertService,
    private router: Router,
    private actRouter: ActivatedRoute,
    private _script: ScriptLoaderService
  ) {
    this.langImgPath = this.commService._hostName + "uploads/languages/";
    this.loadingImgPath = this.commService._hostName + "uploads/loading-1.gif";
    this.defaultImg = this.commService._hostName + "uploads/no_image.jpg";
    this.localUrl = this.defaultImg;
    this.defaultIco = this.commService._hostName + "uploads/no_image.jpg";
    this.localUrlIco = this.defaultIco;
    // this.insertImageSettings.saveUrl=this.commService._hostName + 'uploads/languages/';
    // this.insertImageSettings.path=this.commService._hostName + 'uploads/languages/';
  }

  onKeyUpPageTitleAr(event: any) {
    this.successfull_page_title_lang_ar =
      event.target.value.trim() === "" ? true : false;
  }

  onKeyUpPageTitleEn(event: any) {
    this.successfull_page_title_lang_en =
      event.target.value.trim() === "" ? true : false;
  }

  showPreviewImage(event: any) {
    this.selectedFile = event.target;

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        // console.log(event.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
      this.successRemoveImg = true;
      this.success_file = false;
    } else {
      this.localUrl = this.defaultImg;
      this.successRemoveImg = false;
      this.success_file = true;
    }
  }

  showPreviewIco(event: any) {
    this.selectedIco = event.target;

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrlIco = event.target.result;
        // console.log(event.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
      this.successRemoveIco = true;
      this.success_Ico = false;
    } else {
      this.localUrlIco = this.defaultIco;
      this.successRemoveIco = false;
      this.success_Ico = true;
    }
  }

  removeImg() {
    this.file = null;
    this.file = "";
    this.file = undefined;
    this.localUrl = this.defaultImg;
    this.successRemoveImg = false;
    this.success_file = true;
  }
  removeIco() {
    this.Ico = null;
    this.Ico = "";
    this.Ico = undefined;
    this.localUrlIco = this.defaultIco;
    this.successRemoveIco = false;
    this.success_Ico = true;
  }

  addEditPage() {
    this.disablebtn = true;
    this.success_file = this.localUrl === this.defaultImg ? true : false;
    this.success_Ico = this.localUrlIco === this.defaultIco ? true : false;
    var description_ar = $("#m_summernote_ar").summernote("code");
    // var description_ar = this.value;
    var description_en = $("#m_summernote_en").summernote("code");

    var isEmptyDescription_ar = $("#m_summernote_ar").summernote("isEmpty");
    // var isEmptyDescription_ar = this.value != '' && this.value != '<p></p>' ?false:true;
    var isEmptyDescription_en = $("#m_summernote_en").summernote("isEmpty");

    this.successfull_page_title_lang_ar =
      this.page_title_lang_ar.trim() === "" ? true : false;

    this.successfull_page_title_lang_en =
      this.page_title_lang_en.trim() === "" ? true : false;

    this.successfull_m_summernote_ar =
      isEmptyDescription_ar === true ? true : false;
    this.successfull_m_summernote_en =
      isEmptyDescription_en === true ? true : false;
    if (
      this.page_title_lang_ar === "" ||
      this.page_title_lang_en === "" ||
      isEmptyDescription_ar === true ||
      isEmptyDescription_en === true ||
      this.success_file === true ||
      this.success_Ico === true
    ) {
      this.disablebtn = false;

      return;
    } else {
      let langs = [
        {
          lang_code: "ar",
          title: this.page_title_lang_ar,
          sub_title: this.page_sub_title_lang_ar,
          description: description_ar,
        },
        {
          lang_code: "en",
          title: this.page_title_lang_en,
          sub_title: this.page_sub_title_lang_en,
          description: description_en,
        },
      ];

      let formData = new FormData();

      formData.append("user_id", this.user_id);
      formData.append("id", this.page_id);
      formData.append("status", this.status.toString());
      formData.append("langs", JSON.stringify(langs));

      if (this.selectedFile !== null) {
        if (this.selectedFile.files.length > 0) {
          formData.append("file", this.selectedFile.files[0]);
        }
      }
      if (this.selectedIco !== null) {
        if (this.selectedIco.files.length > 0) {
          formData.append("ico", this.selectedIco.files[0]);
        }
      }

      // let body = { "user_id": this.user_id, "status": this.status, "id": this.page_id, "langs": langs };

      this.addEditLoader = true;
      this.homeSectionService.addEditPage(formData).subscribe((data) => {
        this.addEditLoader = false;
        if (data) {
          this.disablebtn = false;

          if (this.action === "add" && this.page_id === null) {
            this.resetInputs();

            this.alertService.success({
              title: "حفظ بيانات العنصر",
              text: "تم حفظ بيانات العنصر بنجاح.",
            });
          } else {
            this.alertService.success({
              title: "تعديل بيانات العنصر",
              text: "تم تعديل بيانات العنصر بنجاح.",
            });
          }
        }
      });
    }
  }

  backToAllpages() {
    this.router.navigate(["/home-section/all-sections"]);
  }

  resetInputs() {
    this.page_title_lang_ar = "";
    this.page_sub_title_lang_ar = "";
    this.page_sub_title_lang_en = "";
    this.page_title_lang_en = "";
    this.value = `<p></p>`;
    $("#m_summernote_ar").summernote("reset");
    $("#m_summernote_en").summernote("reset");

    this.file = null;
    this.file = "";
    this.file = undefined;
    this.Ico = null;
    this.Ico = "";
    this.Ico = undefined;
    this.disablebtn = false;
    this.localUrl = this.defaultImg;
    this.localUrlIco = this.defaultIco;
    this.successRemoveImg = false;
    this.successRemoveIco = false;
  }

  getOnePage(id) {
    $("#m_summernote_ar").summernote("reset");
    $("#m_summernote_en").summernote("reset");

    this.homeSectionService.getOnePage(id).subscribe((data) => {
      if (data) {
        // console.log(':::: getOnePage :::: ', data);

        this.status = data.status === "0" ? false : true;
        if (data.img === null || data.img === "") {
          this.localUrl = this.commService._hostName + "uploads/no_image.jpg";
          this.success_file = true;
          this.success_file = true;
        } else {
          this.localUrl =
            this.commService._hostName + "uploads/home_section/" + data.img;
        }
        if (data.ico === null || data.ico === "") {
          this.localUrlIco =
            this.commService._hostName + "uploads/no_image.jpg";
          this.success_Ico = true;
          this.success_Ico = true;
        } else {
          this.localUrlIco =
            this.commService._hostName + "uploads/home_section/" + data.ico;
        }
        for (let lang of data["langs"]) {
          if (lang["lang_code"] === "ar") {
            this.page_name_title = lang["title"];
            this.page_title_lang_ar = lang["title"];
            // this.value=lang['description'];
            $("#m_summernote_ar").summernote("code", lang["description"]);
          } else if (lang["lang_code"] === "en") {
            this.page_name_title = lang["title"];
            this.page_title_lang_en = lang["title"];
            $("#m_summernote_en").summernote("code", lang["description"]);
          } else {
            return;
          }
        }
      }
    });
  }
  getAllCategoryParent() {}
  getAllLanguages() {
    this.commService.getAllLanguages().subscribe(
      (data) => {
        if (data) {
          // console.log('allLanguages: ', data);

          for (let lang of data) {
            if (lang["code"] === "ar") {
              this.lang_ar_name = lang["name"];
              this.lang_ar_code = lang["code"];
              this.lang_ar_image = lang["lang_image"];
            } else if (lang["code"] === "en") {
              this.lang_en_name = lang["name"];
              this.lang_en_code = lang["code"];
              this.lang_en_image = lang["lang_image"];
            } else {
              return;
            }
          }
        }
      },
      (err) => {
        if (err.error instanceof Error) {
          console.warn("client side error", err);
        } else {
          console.warn("server side error", err);
        }
      },
      () => {}
    );
  }

  ngOnInit() {
    if (localStorage.getItem("currentUser") === null) {
      this.router.navigate(["/login"]);
    } else {
      var currentUser = localStorage.getItem("currentUser");
      var retrievedObject = JSON.parse(currentUser);
      this.user_id = retrievedObject.id;

      this.getAllLanguages();
      this.getAllCategoryParent();

      this.actRouter.paramMap.subscribe((params: ParamMap) => {
        this.page_id = params.get("id");

        if (this.page_id !== null) {
          this.commService.setTitle("تعديل بيانات العنصر");

          this.edit_action = true;
          this.action = "edit";
        } else if (this.page_id === null) {
          this.commService.setTitle("إضافة صفحة جديدة");
          this.isDataAvailable = true;
          this.add_action = true;
          this.action = "add";
        } else {
          this.router.navigate(["/404"]);
        }
      });
    }
  }

  ngAfterViewInit() {
    let roles = ["pages_add", "pages_edit"];
    let userInfo = { user_id: this.user_id, roles: roles };

    this.commService.getUserLevel(userInfo).subscribe((res) => {
      if (res) {
        this.pages_add = res.pages_add === "1" ? true : false;
        this.pages_edit = res.pages_edit === "1" ? true : false;

        if (this.pages_edit === true) {
          this.getOnePage(this.page_id);
          this.isDataAvailable = true;
        } else {
          this.isDataAvailable = true;
        }

        Helpers.loadStyles(
          "app-add-page",
          "assets/own-style/summernote-editor/edit-summernote.css"
        );

        this._script.loadScripts("app-add-page", [
          "assets/demo/default/custom/components/forms/widgets/summernote.js",
          "assets/demo/default/custom/components/forms/widgets/summernote-ar-AR.js",
          "assets/own-style/js/uploadImg.js",
        ]);
      }
    });
  }
}
