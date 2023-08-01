import { Component, OnInit, ViewEncapsulation, Input, NgModule, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { PagesService } from '../pages.service';
import { CommonService } from '../../../../../_services/common.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
// import { CategoriesService } from '../../../sections/categories/categories.service';
import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NgForm, FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-add-page",
    templateUrl: "./add-page.component.html",
    // providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService],
    encapsulation: ViewEncapsulation.None,
})
export class AddPageComponent implements OnInit, AfterViewInit {
    public tools: object = {
        items: [
               'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
               'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
               'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
               'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
               'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
               'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
       };
       value:any=`<p></p>`;

       public insertImageSettings = {


    };
    action: string;
    page_id: string;
    add_action: boolean;
    edit_action: boolean;
    disablebtn:boolean=false;


    page_name_title: string = '';
    isDataAvailable: boolean = false;
    loadingImgPath: string = '';

    user_id;


    pages_add: boolean;
    pages_edit: boolean;

    langImgPath: string;

    lang_ar_name: string = '';
    lang_ar_code: string = '';
    lang_ar_image: string = '';

    status: boolean = true;

    lang_en_name: string = '';
    lang_en_code: string = '';
    lang_en_image: string = '';

    page_title_lang_en: string = '';
    page_sub_title_lang_en: string = '';
    page_title_lang_ar: string = '';
    page_sub_title_lang_ar: string = '';
    categore_parents:any[]=[];
    successfull_page_title_lang_ar: boolean = false;

    successfull_page_title_lang_en: boolean = false;
    successfull_m_summernote_ar: boolean = false;
    successfull_m_summernote_en: boolean = false;
    addEditLoader:boolean =false;

    page_title_lang_arErrorMsg: string = 'يرجى إدخال عنوان الصفحة باللغة العربية';

    page_title_lang_enErrorMsg: string = 'يرجى إدخال عنوان الصفحة باللغة الإنجليزية';
    m_summernote_arErrorMsg: string = 'يرجى إدخال محتوى الصفحة باللغة العربية';
    m_summernote_enErrorMsg: string = 'يرجى إدخال محتوى الصفحة باللغة الإنجليزية';


    file;
    formData: FormData = null;
    selectedFile: any = null;
    successRemoveImg: boolean = false;
    success_file: boolean = false;
    successImg: boolean = true;

    localUrl;
    defaultImg: string;



    constructor(public http: HttpClient, public commService: CommonService, public pageService: PagesService, private fb: FormBuilder, private alertService: SweetAlertService, private router: Router, private actRouter: ActivatedRoute, private _script: ScriptLoaderService) {

        this.langImgPath = this.commService._hostName + 'uploads/languages/';
        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
        this.defaultImg = this.commService._hostName + 'uploads/no_image.jpg';
        this.localUrl = this.defaultImg;
        // this.insertImageSettings.saveUrl=this.commService._hostName + 'uploads/languages/';
        // this.insertImageSettings.path=this.commService._hostName + 'uploads/languages/';
    }







    onKeyUpPageTitleAr(event: any) {
        this.successfull_page_title_lang_ar = event.target.value.trim() === '' ? true : false;
    }

    onKeyUpPageTitleEn(event: any) {
        this.successfull_page_title_lang_en = event.target.value.trim() === '' ? true : false;
    }


    showPreviewImage(event: any) {

        this.selectedFile = event.target;

        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.localUrl = event.target.result;
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


    addEditPage() {

        this.disablebtn=true;
         this.success_file = this.localUrl === this.defaultImg ? true : false;
        var description_ar = $('#m_summernote_ar').summernote('code');
        // var description_ar = this.value;
        var description_en = $('#m_summernote_en').summernote('code');

        var isEmptyDescription_ar = $('#m_summernote_ar').summernote('isEmpty');
        // var isEmptyDescription_ar = this.value != '' && this.value != '<p></p>' ?false:true;
        var isEmptyDescription_en = $('#m_summernote_en').summernote('isEmpty');

        this.successfull_page_title_lang_ar = this.page_title_lang_ar.trim() === '' ? true : false;

        this.successfull_page_title_lang_en = this.page_title_lang_en.trim() === '' ? true : false;

         this.successfull_m_summernote_ar = isEmptyDescription_ar === true ? true : false;
        this.successfull_m_summernote_en = isEmptyDescription_en === true ? true : false;

        if (this.page_title_lang_ar === '' || this.page_title_lang_en === '' || isEmptyDescription_ar === true || isEmptyDescription_en === true ) {
            this.disablebtn=false;

            return;
        }
        else {

            let langs = [
                {
                    "lang_code": "ar",
                    "title": this.page_title_lang_ar,
                    "sub_title": this.page_sub_title_lang_ar,
                    "description": description_ar,
                },
                {
                    "lang_code": "en",
                    "title": this.page_title_lang_en,
                    "sub_title": this.page_sub_title_lang_en,
                    "description": description_en,
                }
            ];

            let formData = new FormData();

            formData.append('user_id', this.user_id);
            formData.append('id', this.page_id);
            formData.append('status', this.status.toString());
            formData.append('langs', JSON.stringify(langs));

            if (this.selectedFile !== null) {
                if (this.selectedFile.files.length > 0) {
                    formData.append('file', this.selectedFile.files[0]);
                }
            }




            // let body = { "user_id": this.user_id, "status": this.status, "id": this.page_id, "langs": langs };


            this.addEditLoader = true;
            this.pageService.addEditPage(formData).subscribe((data) => {
                this.addEditLoader = false;
                if (data) {

                    this.disablebtn=false;

                    if (this.action === 'add' && this.page_id === null) {

                        this.resetInputs();

                        this.alertService.success({
                            title: 'حفظ بيانات الصفحة',
                            text: "تم حفظ بيانات الصفحة بنجاح."
                        });

                    }
                    else {
                        this.alertService.success({
                            title: 'تعديل بيانات الصفحة',
                            text: "تم تعديل بيانات الصفحة بنجاح."
                        });
                    }
                }

            });
        }

    }

    backToAllpages() {
        this.router.navigate(['/pages/all-pages']);
    }

    resetInputs() {
        this.page_title_lang_ar = '';
        this.page_sub_title_lang_ar = '';
        this.page_sub_title_lang_en = '';
        this.page_title_lang_en = '';
        this.value=`<p></p>`;
        $('#m_summernote_ar').summernote('reset');
        $('#m_summernote_en').summernote('reset');

        this.file = null;
        this.file = '';
        this.file = undefined;
        this.disablebtn = false;
        this.localUrl = this.defaultImg;
        this.successRemoveImg = false;
    }

    getOnePage(id) {
        $('#m_summernote_ar').summernote('reset');
        $('#m_summernote_en').summernote('reset');

        this.pageService.getOnePage(id).subscribe((data) => {
            if (data) {

                // console.log(':::: getOnePage :::: ', data);

                this.status = data.status === "0" ? false : true;


                for (let lang of data['langs']) {

                    if (lang['lang_code'] === 'ar') {
                        this.page_name_title = lang['title'];
                        this.page_sub_title_lang_ar = lang['sub_title'];
                        this.page_title_lang_ar = lang['title'];
                        // this.value=lang['description'];
                        $('#m_summernote_ar').summernote('code', lang['description']);
                    }
                    else if (lang['lang_code'] === 'en') {
                        this.page_name_title = lang['title'];
                        this.page_title_lang_en = lang['title'];
                        this.page_sub_title_lang_en = lang['sub_title'];
                        $('#m_summernote_en').summernote('code', lang['description']);
                    }
                    else {
                        return;
                    }

                }

            }

        });

    }
    getAllCategoryParent(){



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
                    this.commService.setTitle("تعديل بيانات الصفحة");

                    this.edit_action = true;
                    this.action = 'edit';
                }
                else if (this.page_id === null) {
                    this.commService.setTitle("إضافة صفحة جديدة");
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

        let roles = ["pages_add", "pages_edit"];
        let userInfo = { "user_id": this.user_id, "roles": roles };

        this.commService.getUserLevel(userInfo).subscribe((res) => {
            if (res) {

                this.pages_add = res.pages_add === '1' ? true : false;
                this.pages_edit = res.pages_edit === '1' ? true : false;

                if (this.pages_edit === true) {
                    this.getOnePage(this.page_id);
                    this.isDataAvailable = true;
                }
                else {
                    this.isDataAvailable = true;
                }

                Helpers.loadStyles('app-add-page', 'assets/own-style/summernote-editor/edit-summernote.css');

                this._script.loadScripts('app-add-page',
                    ['assets/demo/default/custom/components/forms/widgets/summernote.js',
                        'assets/demo/default/custom/components/forms/widgets/summernote-ar-AR.js', 'assets/own-style/js/uploadImg.js']);

            }
        });

    }

}
