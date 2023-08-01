import { Component, OnInit, ViewEncapsulation, Input, NgModule, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { LanguagesService } from '../languages.service';
import { CommonService } from '../../../../../_services/common.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NgForm, FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-add-language",
    templateUrl: "./add-language.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AddLanguageComponent implements OnInit {

    action: string;
    page_id: string;
    add_action: boolean;
    edit_action: boolean;

    language_name_title: string = '';
    name: string = '';
    code: string = '';

    isDataAvailable: boolean = false;
    loadingImgPath: string = '';
    disablebtn:boolean=false;

    user_id;

    success_name: boolean = false;
    success_code: boolean = false;

    file;
    formData: FormData = null;
    selectedFile: any = null;
    successRemoveImg: boolean = false;
    success_file: boolean = false;
    successImg: boolean = true;

    localUrl;
    defaultImg: string;

    public nameErrorMsg: string = 'يرجى إدخال اسم اللغة';
    public codeErrorMsg: string = 'يرجى إدخال كود اللغة';
    public fileErrorMsg: string = 'يرجى إختيار صورة اللغة';

    languages_add: boolean;
    languages_edit: boolean;

    constructor(public commService: CommonService, public langService: LanguagesService, private fb: FormBuilder, private alertService: SweetAlertService, private router: Router, private actRouter: ActivatedRoute, private _script: ScriptLoaderService) {

        this.defaultImg = this.commService._hostName + 'uploads/no_image.jpg';
        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
        this.localUrl = this.defaultImg;

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

    onKeyUpName(event: any) {
        this.success_name = event.target.value === '' ? true : false;
    }

    onKeyUpCode(event: any) {
        this.success_code = event.target.value === '' ? true : false;
    }

    addEditLanguage() {

        this.disablebtn=true;
        let formData = new FormData();
        formData.append('name', this.name);
        formData.append('code', this.code);
        formData.append('user_id', this.user_id);

        if (this.add_action === true) {
            formData.append('operation', this.action);
        }

        if (this.edit_action === true) {
            formData.append('lang_id', this.page_id);
            formData.append('operation', this.action);
        }

        if (this.selectedFile !== null) {
            if (this.selectedFile.files.length > 0) {

                formData.append('file', this.selectedFile.files[0]);

            }
        }

        if (this.name === '') { this.success_name = true; }
        if (this.code === '') { this.success_code = true; }


        if (this.action === 'add' && this.page_id === null) {

            if (this.file === undefined || this.file === '' || this.file === null) {
                this.success_file = true;
            }

        }

        if (this.action === 'add' && this.page_id === null) {

            if (this.name === '' || this.code === '' || this.localUrl === this.defaultImg) {
                this.disablebtn=false;
                return;
            }
            else {

                // console.log('name: ', this.name);
                // console.log('code: ', this.code);
                // console.log('success_file', this.selectedFile.files[0]);

                this.langService.addEditLanguage(formData).subscribe((data) => {
                    if (data) {

                        this.disablebtn=false;
                        this.resetInputs();

                        this.alertService.success({
                            title: 'حفظ اللغة',
                            text: "تم حفظ بيانات اللغة بنجاح."
                        });


                    }

                });

            }

        }
        else {

            if (this.name === '' || this.code === '' || this.localUrl === this.defaultImg) {
                this.disablebtn=false;
                return;
            }
            else {

                this.langService.addEditLanguage(formData).subscribe((data) => {
                    if (data) {

                        this.disablebtn=false;
                        if (data === 403) {
                            this.alertService.error({
                                title: 'خطأ !!!',
                                text: "هذه اللغة غير موجودة !!"
                            });
                        }
                        else {
                            this.alertService.success({
                                title: 'تعديل اللغة',
                                text: "تم تعديل بيانات اللغة بنجاح."
                            });
                        }
                    }

                });

            }

        }


    }

    backToAllLanguages() {
        this.router.navigate(['/languages/all-languages']);
    }

    resetInputs() {
        this.name = '';
        this.code = '';
        this.disablebtn=false;
        this.localUrl = this.defaultImg;
        this.successRemoveImg = false;
        this.file = null;
        this.file = '';
        this.file = undefined;
    }

    getOneLanguage(id) {
        let langId = parseInt(id);

        this.langService.getOneLanguage(langId).subscribe((data) => {
            if (data) {

                this.language_name_title = data.name;
                this.name = data.name;
                this.code = data.code;

                this.successImg = true;
                if (data.lang_image === null || data.lang_image === '') {
                    this.localUrl = this.commService._hostName + 'uploads/no_image.jpg';
                    this.success_file = true;
                }
                else {
                    this.localUrl = this.commService._hostName + 'uploads/languages/' + data.lang_image;
                }

                this.isDataAvailable = true;

            }

        });

    }

    ngOnInit() {

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;

            let roles = ["languages_add", "languages_edit"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.languages_add = res.languages_add === '1' ? true : false;
                    this.languages_edit = res.languages_edit === '1' ? true : false;

                    this.actRouter.paramMap.subscribe((params: ParamMap) => {
                        this.page_id = params.get('id');

                        if (this.page_id !== null) {
                            this.commService.setTitle("تعديل بيانات اللغة");

                            this.edit_action = true;
                            this.action = 'edit';

                            if (this.languages_edit === true) {
                                this.getOneLanguage(this.page_id);
                            }
                            else {
                                this.isDataAvailable = true;
                            }
                        }
                        else if (this.page_id === null) {
                            this.commService.setTitle("إضافة لغة جديدة");

                            this.isDataAvailable = true;
                            this.add_action = true;
                            this.action = 'add';

                        } else {
                            this.router.navigate(['/404']);
                        }

                    });

                }
            });

        }


    }

}