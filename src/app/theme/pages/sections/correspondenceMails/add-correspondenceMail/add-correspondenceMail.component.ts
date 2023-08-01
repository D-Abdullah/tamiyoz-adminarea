import { Component, OnInit, ViewEncapsulation, Input, NgModule, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { CorrespondenceMailsService } from '../correspondenceMails.service';
import { CommonService } from '../../../../../_services/common.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NgForm, FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-add-correspondenceMail",
    templateUrl: "./add-correspondenceMail.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AddcorrespondenceMailComponet implements OnInit {

    action: string;
    page_id: string;
    add_action: boolean;
    edit_action: boolean;
  status:boolean=false;
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

    public nameErrorMsg: string = 'يرجى إدخال ايميل المراسله';
    public codeErrorMsg: string = 'يرجى إدخال كود ايميل المراسله';
    public fileErrorMsg: string = 'يرجى إختيار صورة ايميل المراسله';

    correspondence_mails_add: boolean;
    correspondence_mails_edit: boolean;

  constructor(public commService: CommonService, public langService: CorrespondenceMailsService, private fb: FormBuilder, private alertService: SweetAlertService, private router: Router, private actRouter: ActivatedRoute, private _script: ScriptLoaderService) {

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
      // console.log(event.target.value);

      this.success_name = event.target.value.toLowerCase().match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)? false :true;
    }



    addEditLanguage() {

        this.disablebtn=true;
        let formData = new FormData();
        formData.append('email', this.name);
      formData.append('status',JSON.stringify(this.status));
        formData.append('added_by', this.user_id);

        if (this.add_action === true) {
            formData.append('operation', this.action);
        }

        if (this.edit_action === true) {
            formData.append('lang_id', this.page_id);
            formData.append('operation', this.action);
        }

        if (this.name === '') { this.success_name = true; }




        if (this.action === 'add' && this.page_id === null) {

            if (this.name === '' ) {
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
                            title: 'حفظ ايميل المراسله',
                            text: "تم حفظ بيانات ايميل المراسله بنجاح."
                        });


                    }

                });

            }

        }
        else {

            if (this.name === '' ) {
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
                                text: "هذه ايميل المراسله غير موجودة !!"
                            });
                        }
                        else {
                            this.alertService.success({
                                title: 'تعديل ايميل المراسله',
                                text: "تم تعديل بيانات ايميل المراسله بنجاح."
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
        this.disablebtn=false;
      this.status=false;

    }

    getOneLanguage(id) {
        let langId = parseInt(id);

        this.langService.getOneLanguage(langId).subscribe((data) => {
            if (data) {


                this.name = data.email;
              this.status = data.status === "0" ? false : true;
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

            let roles = ["correspondence_mails_add", "correspondence_mails_edit"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.correspondence_mails_add = res.correspondence_mails_add === '1' ? true : false;
                    this.correspondence_mails_edit = res.correspondence_mails_edit === '1' ? true : false;

                    this.actRouter.paramMap.subscribe((params: ParamMap) => {
                        this.page_id = params.get('id');

                        if (this.page_id !== null) {
                            this.commService.setTitle("تعديل بيانات ايميل المراسله");

                            this.edit_action = true;
                            this.action = 'edit';

                            if (this.correspondence_mails_edit === true) {
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
