import { CompanyService } from './../companies.service';
import { Component, OnInit, ViewEncapsulation, Input, NgModule, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';

import { CommonService } from '../../../../../_services/common.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NgForm, FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-add-company",
    templateUrl: "./add-company.component.html",
    // providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService],
    encapsulation: ViewEncapsulation.None,
})
export class AddCompanyComponent implements OnInit, AfterViewInit {
    public tools: object = {
        items: [
            'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
            'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
            'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
            'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
            'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
    };
    value: any = `<p></p>`;

    public insertImageSettings = {


    };
    action: string;
    page_id: string;
    add_action: boolean;
    edit_action: boolean;
    disablebtn: boolean = false;
    pagename='companies'

    page_name_title: string = '';
    isDataAvailable: boolean = false;
    loadingImgPath: string = '';

    user_id;
    localUrl;
    defaultImg;

    // news_add: boolean;
    // news_edit: boolean;
    companies_add: boolean;
    companies_edit: boolean;
    langImgPath: string;

    lang_ar_name: string = '';
    lang_ar_code: string = '';
    lang_ar_image: string = '';
    lon:string='';
    websiteUrl:string='';
   email:string='';
    lat:string='';
    status: boolean = true;

    lang_en_name: string = '';
    lang_en_code: string = '';
    lang_en_image: string = '';

    page_title_lang_en: string = '';
    page_title_lang_ar: string = '';

    page_address_lang_en: string = '';

page_address_lang_ar: string = '';

    categore_parents: any[] = [];
    successfull_page_title_lang_ar: boolean = false;

    successfull_page_title_lang_en: boolean = false;


    successfull_page_address_lang_ar: boolean = false;

    successfull_page_address_lang_en: boolean = false;
    successfull_Email: boolean = false;



  images: any = [];


    successfull_m_summernote_ar: boolean = false;
    successfull_m_summernote_en: boolean = false;
    addEditLoader: boolean = false;
    file;
    formData: FormData = null;
    selectedFile: any = null;
    successRemoveImg: boolean = false;
    success_file: boolean = false;
    // success_service_id: boolean = false;
    successImg: boolean = true;

    sort: string = '0';
    service_id: string = '';
    successfull_category_sort: boolean = false;
    category_sortErrorMsg: string = 'يرجى إدخال ترتيب الشركه';
    categoryIDErrorMsg: string = 'يرجى إدخال قسم الشركه';
    phones=[{
      "id": "",
      "phone": ""

  }];

    page_address_lang_arErrorMsg: string = 'يرجى إدخال عنوان الشركه باللغة العربية';
    page_address_lang_enErrorMsg: string = 'يرجى إدخال عنوان الشركه باللغة الإنجليزية';
    EmailErrorMsg: string = 'يرجى إدخال بريد الالكتروني للشركه';
    page_title_lang_arErrorMsg: string = 'يرجى إدخال اسم الشركه باللغة العربية';
    page_title_lang_enErrorMsg: string = 'يرجى إدخال اسم الشركه باللغة الإنجليزية';
    m_summernote_arErrorMsg: string = 'يرجى إدخال محتوى الشركه باللغة العربية';
    m_summernote_enErrorMsg: string = 'يرجى إدخال محتوى الشركه باللغة الإنجليزية';
    fileErrorMsg: string = 'يرجى إدخال صورة الشركه  ';

    constructor(public http: HttpClient,
        public commService: CommonService,
        public proService: CompanyService,
        private fb: FormBuilder,
        private alertService: SweetAlertService,
        private router: Router,
        private actRouter: ActivatedRoute,
        private _script: ScriptLoaderService) {

        this.langImgPath = this.commService._hostName + 'uploads/languages/';
        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
        this.defaultImg = this.commService._hostName + 'uploads/no_image.jpg';
        this.localUrl = this.defaultImg;

        // this.insertImageSettings.saveUrl=this.commService._hostName + 'uploads/languages/';
        // this.insertImageSettings.path=this.commService._hostName + 'uploads/languages/';
    }

    ////important 1
    showPreviewImage(event: any) {

        this.selectedFile = event.target;

        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.localUrl = event.target.result;
                // console.log(event.target.result);

            }
            reader.readAsDataURL(event.target.files[0]);
            this.successRemoveImg = true;
            this.success_file = false;
        }
        else {
            this.localUrl = this.defaultImg;
            this.successRemoveImg = false;
            this.success_file = true;
        }
    }

    removeImg() {
        this.file = null;
        this.file = '';
        this.file = undefined;
        this.localUrl = this.defaultImg;
        this.successRemoveImg = false;
        this.success_file = true;
    }

    onKeyUpPageTitleAr(event: any) {
        this.successfull_page_title_lang_ar = event.target.value.trim() === '' ? true : false;
    }



  setNewImages(value) {
    console.log("setNewImages", value)
    this.images = value;
    this.success_file = false;
  }



    addMoreNumber() {

      var newObjop = {
          "id": "",
          "phone": ""

      }

       this.phones.push(newObjop);

      //  console.log(this.phones);

  }







    onKeyUpPageAddresAr(event: any) {
      this.successfull_page_address_lang_ar = event.target.value.trim() === '' ? true : false;
  }
  onKeyUpPageAddresEn(event: any) {
    this.successfull_page_address_lang_en = event.target.value.trim() === '' ? true : false;
}



onKeyUpEmail(event: any) {
  // console.log(event.target.value.trim().includes());
  let value=event.target.value.trim().includes('@');


  this.successfull_Email = !value? true : false;
}

    onKeyUpCategorySort(event: any) {
        this.successfull_category_sort = (event.target.value == '' || event.target.value == null) && event.target.value != '0' ? true : false;
    }

    onKeyUpPageTitleEn(event: any) {
        this.successfull_page_title_lang_en = event.target.value.trim() === '' ? true : false;
    }

    addEditService() {
    //   console.log("done");


        this.disablebtn = true;
        this.successfull_category_sort = (this.sort == '' || this.sort == null) && this.sort != '0' ? true : false;

        var description_ar = $('#m_summernote_ar').summernote('code');
        // var description_ar = this.value;
        var description_en = $('#m_summernote_en').summernote('code');

        var isEmptyDescription_ar = $('#m_summernote_ar').summernote('isEmpty');
        // var isEmptyDescription_ar = this.value != '' && this.value != '<p></p>' ?false:true;
        var isEmptyDescription_en = $('#m_summernote_en').summernote('isEmpty');

        this.successfull_page_address_lang_ar = this.page_address_lang_ar.trim() === '' ? true : false;

        this.successfull_page_address_lang_en = this.page_address_lang_en.trim() === '' ? true : false;
        let value=this.email.trim().includes('@');
        this.successfull_Email = !value? true : false;



        this.successfull_page_title_lang_ar = this.page_title_lang_ar.trim() === '' ? true : false;

        this.successfull_page_title_lang_en = this.page_title_lang_en.trim() === '' ? true : false;




        this.successfull_m_summernote_ar = isEmptyDescription_ar === true ? true : false;
        this.successfull_m_summernote_en = isEmptyDescription_en === true ? true : false;
        // this.success_file = this.localUrl == this.defaultImg ? true : false;
        // this.success_service_id = this.service_id == '' ? true : false;
        let formData = new FormData();
        if (this.selectedFile !== null) {
            if (this.selectedFile.files.length > 0) {
                formData.append('file', this.selectedFile.files[0]);

            }
        }

      if (this.images.length>=2) {
        this.success_file = false;
        formData.append('filesImages', JSON.stringify(this.images));


      }else{
        this.success_file = true;
      }
        // console.log("1");
        if (this.page_title_lang_ar === '' || this.page_title_lang_en === '' ||   this.page_address_lang_ar === '' || this.page_address_lang_en === '' ||  isEmptyDescription_ar === true || isEmptyDescription_en === true  || this.successfull_category_sort === true ) {
            this.disablebtn = false;
            return;
        }
        else {
            // console.log("1");

            let langs = [
                {
                    "lang_code": "ar",
                    "title": this.page_title_lang_ar,
                    "address": this.page_address_lang_ar,
                    "description": description_ar,
                },
                {
                    "lang_code": "en",
                    "title": this.page_title_lang_en,
                    "address": this.page_address_lang_en,
                    "description": description_en,
                }
            ];
            formData.append('user_id', this.user_id);
            // formData.append('img', this.user_id);
            formData.append('status', this.status.toString());
            formData.append('langs', JSON.stringify(langs));
            formData.append('phones',JSON.stringify(this.phones));
            formData.append('id', this.page_id);
            formData.append('lon', this.lon);
            formData.append('websiteUrl', this.websiteUrl);
            formData.append('email', this.email);
            formData.append('lat', this.lat);
            formData.append('pagename', this.pagename);
            // formData.append('service_id', this.service_id);
            formData.append('sort', this.sort);
             console.log(this.sort);

            // let body = { "user_id": this.user_id, "status": this.status, "id": this.page_id, "sort": this.sort, "langs": langs,"service_id":this.service_id,"file": JSON.stringify(formData) };
            this.addEditLoader = true;
            // console.log(formData.values);

            this.proService.addEditProject(formData).subscribe((data) => {
                this.addEditLoader = false;
                this.disablebtn = false;

                if (data) {

                    // console.log  (data);

                    this.disablebtn = false;

                    if (this.action === 'add' && this.page_id === null) {

                        this.resetInputs();

                        this.alertService.success({
                            title: 'حفظ بيانات الشركه',
                            text: "تم حفظ بيانات الشركه بنجاح."
                        });

                    }
                    else {
                        this.alertService.success({
                            title: 'تعديل بيانات الشركه',
                            text: "تم تعديل بيانات الشركه بنجاح."
                        });
                    }
                }

            });
        }

    }



    resetInputs() {
        this.page_title_lang_ar = '';
        this.page_title_lang_en = '';

        this.page_address_lang_ar = '';
        this.page_address_lang_en = '';
        this.value = `<p></p>`;
        $('#m_summernote_ar').summernote('reset');
        $('#m_summernote_en').summernote('reset');
        // this.service_id = '';
        this.status = true;
        this.sort = "0";
        this.localUrl = this.defaultImg;
        this.successRemoveImg = false;
        this.file = null;
        this.file = '';
        this.file = undefined;
        this.disablebtn = false;
        this.lon = '';
        this.websiteUrl = '';
        this.email = '';
        this.lat = '';
        this.phones=[];
        this.email='';
      this.images = [];

    }

    getOneTrainingCourses(id,pagename) {
        $('#m_summernote_ar').summernote('reset');
        $('#m_summernote_en').summernote('reset');

        this.proService.getOneProject(id,pagename).subscribe((data) => {
            if (data) {

              if(data.phones){
                this.phones=data.phones;
              }else{
                this.phones=[];
              }
                // console.log(':::: getOnePage :::: ', data);

                this.status = data.status === "0" ? false : true;
                this.sort = data.sort;
                this.lon = data.lon;
                this.websiteUrl = data.websiteUrl;
                this.email = data.email;
                this.lat = data.lat;
                this.service_id = data.service_id;
                // if (data.img === null || data.img === '') {
                //     this.localUrl = this.commService._hostName + 'uploads/no_image.jpg';
                //     this.success_file = true;
                // }
                // else {
                //     this.localUrl = this.commService._hostName + 'uploads/projects/' + data.img;
                // }



              if (data.images.length > 0) {
                for (let index = 0; index < data.images.length; index++) {
                  let img = {
                    img: data.images[index]['img'],
                    localUrl: this.commService._hostName + 'uploads/projects/' + data.images[index]['img'],
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









                for (let lang of data['langs']) {

                    if (lang['lang_code'] === 'ar') {
                        this.page_name_title = lang['name'];
                        this.page_title_lang_ar = lang['name'];

                        this.page_address_lang_ar = lang['address'];
                        // this.value=lang['description'];
                        $('#m_summernote_ar').summernote('code', lang['description']);
                    }
                    else if (lang['lang_code'] === 'en') {
                        this.page_name_title = lang['name'];
                        this.page_title_lang_en = lang['name'];
                        this.page_address_lang_en = lang['address'];

                        $('#m_summernote_en').summernote('code', lang['description']);
                    }
                    else {
                        return;
                    }

                }

            }

        });

    }
    getAllCategoryParent() {
        // this.proService.getTrainingCategories().subscribe((data) => {
        //     if (data) {
        //         this.categore_parents = data;
        //     }
        //     else {
        //         this.categore_parents = [];
        //     }
        // });


    }
    getAllLanguages() {

        this.commService.getAllLanguages().subscribe((data) => {
            if (data) {
                // console.log('allLanguages: ', data);

                for (let lang of data) {

                    if (lang['code'] === 'ar') {
                        this.lang_ar_name = lang['name'];
                        this.lang_ar_code = lang['code'];
                        this.lang_ar_image = lang['lang_image'];
                    }
                    else if (lang['code'] === 'en') {
                        this.lang_en_name = lang['name'];
                        this.lang_en_code = lang['code'];
                        this.lang_en_image = lang['lang_image'];
                    }
                    else {
                        return;
                    }

                }
            }

        },
            err => {

                if (err.error instanceof Error) {
                    console.warn('client side error', err)
                } else {
                    console.warn('server side error', err);
                }
            },
            () => { }
        );

    }

    ngOnInit() {

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;

            this.getAllLanguages();
            this.getAllCategoryParent();

            this.actRouter.paramMap.subscribe((params: ParamMap) => {
                this.page_id = params.get('id');

                if (this.page_id !== null) {
                    this.commService.setTitle("تعديل بيانات الشركه");

                    this.edit_action = true;
                    this.action = 'edit';
                }
                else if (this.page_id === null) {
                    this.commService.setTitle("إضافة شركه جديدة");
                    this.isDataAvailable = true;
                    this.add_action = true;
                    this.action = 'add';

                } else {
                    this.router.navigate(['/404']);
                }
            });

        }

    }

    ngAfterViewInit() {

        let roles = ["companies_add", "companies_edit"];
        let userInfo = { "user_id": this.user_id, "roles": roles };

        this.commService.getUserLevel(userInfo).subscribe((res) => {
            if (res) {

                this.companies_add = res.companies_add === '1' ? true : false;
                this.companies_edit = res.companies_edit === '1' ? true : false;

                if (this.companies_edit === true && this.page_id !== null) {
                    this.getOneTrainingCourses(this.page_id,this.pagename);
                    this.isDataAvailable = true;
                }
                else {
                    this.isDataAvailable = true;
                }

                Helpers.loadStyles('app-add-company', 'assets/own-style/summernote-editor/edit-summernote.css');

                this._script.loadScripts('app-add-company',
                    ['assets/demo/default/custom/components/forms/widgets/summernote.js',
                        'assets/demo/default/custom/components/forms/widgets/summernote-ar-AR.js', 'assets/own-style/js/uploadImg.js']);

            }
        });

    }

}
