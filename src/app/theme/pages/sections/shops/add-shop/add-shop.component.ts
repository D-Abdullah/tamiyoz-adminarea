import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  NgModule,
  AfterViewInit,
} from "@angular/core";
// import { Http } from '@angular/http';
// import { HttpClient } from '@angular/common/http';
import { Helpers } from "../../../../../helpers";
import { ShopsService } from "../shops.service";
import { CommonService } from "../../../../../_services/common.service";
import { ScriptLoaderService } from "../../../../../_services/script-loader.service";
import { SweetAlertService } from "angular-sweetalert-service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { FormBuilder } from "@angular/forms";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-shop",
  templateUrl: "./add-shop.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AddShopComponent implements OnInit {
  filesImages = [];
  action: string;
  page_id: string;
  add_action: boolean;
  edit_action: boolean;
  stage_name_title: string = "";
  country_id: any;
  isDataAvailable: boolean = false;
  user_id;
  file;
  selectedFilePDF: any = null;
  success_Uploadfile: boolean = false;
  recivedfile: any;
  formData: FormData = null;
  selectedFile: any = null;
  successRemoveImg: boolean = false;
  success_file: boolean = false;
  successImg: boolean = true;
  disablebtn: boolean = false;
  lang_ar_name: string = "";
  lang_ar_code: string = "";
  lang_ar_image: string = "";

  lang_en_name: string = "";
  lang_en_code: string = "";
  lang_en_image: string = "";
  localUrl;
  defaultImg: string;
  langImgPath: string;
  loadingImgPath: string = "";
  page_title_lang_en: string = "";
  page_title_lang_ar: string = "";
  categore_parents: any[] = [];
  successfull_page_title_lang_ar: boolean = false;
  downloadFileFlage = false;
  successfull_page_title_lang_en: boolean = false;
  successfull_m_summernote_ar: boolean = false;
  successfull_m_summernote_en: boolean = false;
  shops_add: boolean;
  shops_edit: boolean;
  status: boolean = true;
  rented: boolean = true;
  page_name_title: string = "";
  page_title_lang_arErrorMsg: string = "يرجى إدخال عنوان المحل باللغة العربية";
  page_title_lang_enErrorMsg: string =
    "يرجى إدخال عنوان المحل باللغة الإنجليزية";
  m_summernote_arErrorMsg: string = "يرجى إدخال محتوى المحل باللغة العربية";
  m_summernote_enErrorMsg: string = "يرجى إدخال محتوى المحل باللغة الإنجليزية";

  successfull_stage_inputs: any = [];
  fileErrorMsg: string = "يرجى إدخال صورة المحل";
  requiredInputsErrorMsg: string = "يرجى إدخال البيانات المطلوبة";
  myArrayLangs = [];
  all_stations: any[] = [];
  // all_stations: any[] = [];
  images: any = [];
  url: string = "";

  selectedTab: number = 0;
  addEditLoader: boolean = false;
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
  constructor(
    public commService: CommonService,
    public stageService: ShopsService,
    private fb: FormBuilder,
    private alertService: SweetAlertService,
    private router: Router,
    private actRouter: ActivatedRoute,
    private _script: ScriptLoaderService
  ) {
    this.defaultImg = this.commService._hostName + "uploads/no_image.jpg";
    this.langImgPath = this.commService._hostName + "uploads/languages/";
    this.loadingImgPath = this.commService._hostName + "uploads/loading-1.gif";
    this.localUrl = this.defaultImg;
  }

  download(url) {
    // window.location.href=url;
    window.open(url, "_blank");
  }
  setNewImages(value) {
    console.log("setNewImages", value);
    this.images = value;
    this.success_file = false;
  }

  showPreviewImage(event: any) {
    this.selectedFile = event.target;

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
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

  removeImg() {
    this.file = null;
    this.file = "";
    this.file = undefined;
    this.localUrl = this.defaultImg;
    this.successRemoveImg = false;
    this.success_file = true;
  }

  onKeyUpPageTitleAr(event: any) {
    this.successfull_page_title_lang_ar =
      event.target.value.trim() === "" ? true : false;
  }

  // onKeyUpCategorySort(event: any) {
  //     this.successfull_category_sort = (event.target.value == '' || event.target.value == null) && event.target.value != '0' ? true : false;
  // }

  onKeyUpPageTitleEn(event: any) {
    this.successfull_page_title_lang_en =
      event.target.value.trim() === "" ? true : false;
  }

  changeFile(event: any) {
    this.selectedFilePDF = event.target;

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      this.success_Uploadfile = false;
    } else {
      // this.success_Uploadfile = true;
    }
  }

  addMoreImage(file) {
    // var newObjop = {
    //   "id": "",
    //   "phone": ""

    // }

    this.filesImages.push(file);

    console.log(this.filesImages);
  }

  addEditService() {
    //   console.log("done");

    this.disablebtn = true;
    // this.successfull_category_sort = (this.sort == '' || this.sort == null) && this.sort != '0' ? true : false;

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
    this.success_file = this.localUrl == this.defaultImg ? true : false;
    // this.success_service_id = this.service_id == '' ? true : false;
    let formData = new FormData();
    // if (this.selectedFile !== null) {
    //   if (this.selectedFile.files.length > 0) {
    //     formData.append("file", this.selectedFile.files[0]);
    //   }
    // }

    if (this.images.length >= 2) {
      formData.append("filesImages", JSON.stringify(this.images));
      this.success_file = false;
    } else {
      this.success_file = true;
    }
    if (this.selectedFilePDF !== null) {
      if (this.selectedFilePDF.files.length > 0) {
        formData.append("fileUpload", this.selectedFilePDF.files[0]);
      }
    } else {
      // console.log('else');
      //  console.log(this.recivedfile);

      if (this.recivedfile != null) {
        // console.log(this.recivedfile);
        formData.append("fileUpload", null);
        this.success_Uploadfile = false;
      } else {
        // this.success_Uploadfile=true;
      }
    }

    // console.log("1");
    if (
      this.page_title_lang_ar === "" ||
      this.page_title_lang_en === "" ||
      isEmptyDescription_ar === true ||
      isEmptyDescription_en === true ||
      this.success_file === true
    ) {
      this.disablebtn = false;
      return;
    } else {
      // console.log("1");

      let langs = [
        {
          lang_code: "ar",
          title: this.page_title_lang_ar,
          description: description_ar,
        },
        {
          lang_code: "en",
          title: this.page_title_lang_en,
          description: description_en,
        },
      ];
      formData.append("user_id", this.user_id);
      // formData.append('img', this.user_id);
      formData.append("status", this.status.toString());
      formData.append("rented", this.rented.toString());
      formData.append("langs", JSON.stringify(langs));
      formData.append("url", this.url);
      formData.append("id", this.page_id);
      formData.append("station_id", this.country_id);

      // let body = { "user_id": this.user_id, "status": this.status, "id": this.page_id, "sort": this.sort, "langs": langs,"service_id":this.service_id,"file": JSON.stringify(formData) };
      this.addEditLoader = true;
      // console.log(formData.values);

      this.stageService.addEditShop(formData).subscribe((data) => {
        this.addEditLoader = false;
        this.disablebtn = false;

        if (data) {
          // console.log  (data);

          this.disablebtn = false;

          if (this.action === "add" && this.page_id === null) {
            this.resetInputs();

            this.alertService.success({
              title: "حفظ بيانات المحل",
              text: "تم حفظ بيانات المحل بنجاح.",
            });
          } else {
            this.alertService.success({
              title: "تعديل بيانات المحل",
              text: "تم تعديل بيانات المحل بنجاح.",
            });
          }
        }
      });
    }
  }

  resetInputs() {
    this.url = "";
    this.page_title_lang_ar = "";
    this.page_title_lang_en = "";
    this.value = `<p></p>`;
    $("#m_summernote_ar").summernote("reset");
    $("#m_summernote_en").summernote("reset");
    for (let lang in this.myArrayLangs) {
      this.myArrayLangs[lang]["stage_name"] = "";
    }

    this.localUrl = this.defaultImg;
    this.successRemoveImg = false;
    if (this.all_stations.length > 0) {
      this.country_id = this.all_stations[0].id;
    } else {
      this.country_id = "";
    }
    this.file = null;
    this.file = "";
    this.file = undefined;
    this.disablebtn = false;
    this.selectedFilePDF = null;
    this.selectedFilePDF = "";
    this.selectedFilePDF = undefined;
    this.images = [];
  }

  getAllCountries() {
    this.stageService.getAllStations().subscribe((data) => {
      if (data) {
        this.all_stations = data;
        if (this.all_stations.length > 0) {
          this.country_id = this.all_stations[0].id;
        }
      } else {
        this.all_stations = [];
      }
    });
  }
  // getOneStage(id) {
  //     let stage_id = parseInt(id);

  //     this.stageService.getOneShop(stage_id).subscribe((data) => {
  //         if (data) {

  //             this.successImg = true;
  //             if (data.img === null || data.img === '') {
  //                 this.localUrl = this.commService._hostName + 'uploads/no_image.jpg';
  //                 this.success_file = true;
  //             }
  //             else {
  //                 this.localUrl = this.commService._hostName + 'uploads/stages/' + data.img;
  //             }

  //             this.status = data.status === "0" ? false : true;
  //             this.country_id = data.country_id;

  //             for (let lang in data['langs']) {
  //                 this.myArrayLangs[lang]['stage_name'] = data['langs'][lang]['name'];
  //             }

  //             this.isDataAvailable = true;

  //         }

  //     });

  // }

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
  goToTab(inx) {
    this.selectedTab = inx;
  }

  ngOnInit() {
    if (localStorage.getItem("currentUser") === null) {
      this.router.navigate(["/login"]);
    } else {
      var currentUser = localStorage.getItem("currentUser");
      var retrievedObject = JSON.parse(currentUser);
      this.user_id = retrievedObject.id;

      this.getAllLanguages();
      this.getAllCountries();

      let roles = ["shops_add", "shops_edit"];
      let userInfo = { user_id: this.user_id, roles: roles };

      this.commService.getUserLevel(userInfo).subscribe((res) => {
        if (res) {
          this.shops_add = res.shops_add === "1" ? true : false;
          this.shops_edit = res.shops_edit === "1" ? true : false;

          this.actRouter.paramMap.subscribe((params: ParamMap) => {
            this.page_id = params.get("id");

            if (this.page_id !== null) {
              this.commService.setTitle("تعديل بيانات المحل");

              this.edit_action = true;
              this.action = "edit";

              if (this.shops_edit === true) {
                this.getOneTrainingCourses(this.page_id);
              } else {
                this.isDataAvailable = true;
              }
            } else if (this.page_id === null) {
              this.commService.setTitle("إضافة محل جديد");

              this.isDataAvailable = true;
              this.add_action = true;
              this.action = "add";
            } else {
              this.router.navigate(["/404"]);
            }
          });
        }
      });
    }
  }

  getOneTrainingCourses(id) {
    $("#m_summernote_ar").summernote("reset");
    $("#m_summernote_en").summernote("reset");

    this.stageService.getOneShop(id).subscribe((data) => {
      if (data) {
        // console.log(':::: getOnePage :::: ', data);

        this.status = data.status === "0" ? false : true;
        this.rented = data.rented === "0" ? false : true;
        this.country_id = data.station_id;
        this.url = data.url;
        // this.sort = data.sort;
        // this.lon = data.lon;
        // this.lat = data.lat;
        // this.service_id = data.service_id;
        // if (data.img === null || data.img === '') {
        //     this.localUrl = this.commService._hostName + 'uploads/no_image.jpg';
        //     this.success_file = true;
        // }
        // else {
        //     this.localUrl = this.commService._hostName + 'uploads/shops/' + data.img;
        // }

        if (data.shop_file === null || data.shop_file === "") {
          this.downloadFileFlage = false;
        } else {
          this.recivedfile =
            this.commService._hostName +
            "uploads/shops/files/" +
            data.shop_file;
          this.downloadFileFlage = true;
        }
        if (data.images.length>0){
          for (let index = 0; index < data.images.length; index++) {
            let img = {
              img: data.images[index]['img'],
              localUrl: this.commService._hostName + 'uploads/shops/' + data.images[index]['img'],
              successRemoveImg: true,
              loader: false,
            }
            this.images.push(img)

          }
          // let file = {
          //   isUpload: false,
          //   localUrl: this.commonService._hostName + 'uploads/no_image.jpg',
          //   id: '',
          //   progress: 1

          // }

          console.log(this.images);

        }
        for (let lang of data["langs"]) {
          if (lang["lang_code"] === "ar") {
            this.page_name_title = lang["name"];
            this.page_title_lang_ar = lang["name"];
            // this.value=lang['description'];
            $("#m_summernote_ar").summernote("code", lang["description"]);
          } else if (lang["lang_code"] === "en") {
            this.page_name_title = lang["name"];
            this.page_title_lang_en = lang["name"];
            $("#m_summernote_en").summernote("code", lang["description"]);
          } else {
            return;
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    let roles = ["shops_add", "shops_edit"];
    let userInfo = { user_id: this.user_id, roles: roles };

    this.commService.getUserLevel(userInfo).subscribe((res) => {
      if (res) {
        this.shops_add = res.shops_add === "1" ? true : false;
        this.shops_edit = res.shops_edit === "1" ? true : false;

        if (this.shops_edit === true && this.page_id !== null) {
          // this.getOneTrainingCourses(this.page_id);
          this.isDataAvailable = true;
        } else {
          this.isDataAvailable = true;
        }

        Helpers.loadStyles(
          "app-add-shop",
          "assets/own-style/summernote-editor/edit-summernote.css"
        );

        this._script.loadScripts("app-add-shop", [
          "assets/demo/default/custom/components/forms/widgets/summernote.js",
          "assets/demo/default/custom/components/forms/widgets/summernote-ar-AR.js",
          "assets/own-style/js/uploadImg.js",
        ]);
      }
    });
  }
}
