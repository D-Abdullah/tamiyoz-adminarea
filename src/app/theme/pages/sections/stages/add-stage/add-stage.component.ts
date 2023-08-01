import { Component, OnInit, ViewEncapsulation, Input, NgModule, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
// import { HttpClient } from '@angular/common/http';
// import { Helpers } from '../../../../../helpers';
import { StagesService } from '../stages.service';
import { CommonService } from '../../../../../_services/common.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { SweetAlertService } from 'angular-sweetalert-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-add-stage",
    templateUrl: "./add-stage.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AddStageComponent implements OnInit {

    action: string;
    page_id: string;
    add_action: boolean;
    edit_action: boolean;
    stage_name_title: string = '';
    country_id: string = '';
    isDataAvailable: boolean = false;
    user_id;
    file;
    formData: FormData = null;
    selectedFile: any = null;
    successRemoveImg: boolean = false;
    success_file: boolean = false;
    successImg: boolean = true;
    disablebtn: boolean = false;

    localUrl;
    defaultImg: string;
    langImgPath: string;
    loadingImgPath: string = '';

    stages_add: boolean;
    stages_edit: boolean;
    status: boolean = true;

    successfull_stage_inputs: any = [];
    fileErrorMsg: string = 'يرجى إدخال صورة المراحلة';
    requiredInputsErrorMsg: string = 'يرجى إدخال البيانات المطلوبة';
    myArrayLangs = [];
    all_countries: any[] = [];


    selectedTab: number = 0;
    addEditLoader: boolean = false;


    constructor(public commService: CommonService, public stageService: StagesService, private fb: FormBuilder, private alertService: SweetAlertService, private router: Router, private actRouter: ActivatedRoute, private _script: ScriptLoaderService) {

        this.defaultImg = this.commService._hostName + 'uploads/no_image.jpg';
        this.langImgPath = this.commService._hostName + 'uploads/languages/';
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



    addEditStage() {
        this.disablebtn = true;

        // this.success_file = this.localUrl === this.defaultImg ? true : false;

        if (this.localUrl === this.defaultImg) {
            this.disablebtn = false;
            return;
        }
        else {

            for (let lang in this.myArrayLangs) {
                if (this.myArrayLangs[lang]['stage_name'] === '') {
                    this.successfull_stage_inputs[lang] = false;
                }
                else {
                    this.successfull_stage_inputs[lang] = true;
                }
            }

            for (let err of this.successfull_stage_inputs) {
                if (err === false) {
                    this.disablebtn = false;
                    return;
                }
            }

            let formData = new FormData();
            formData.append('added_by', this.user_id);
            formData.append('country_id', this.country_id);
            formData.append('status', this.status.toString());
            formData.append('stageLangObj', JSON.stringify(this.myArrayLangs));
            if (this.add_action === true) {
                formData.append('operation', this.action);
            }

            if (this.edit_action === true) {
                formData.append('stage_id', this.page_id);
                formData.append('operation', this.action);
            }

            if (this.selectedFile !== null) {
                if (this.selectedFile.files.length > 0) {

                    formData.append('file', this.selectedFile.files[0]);

                }
            }

            if (this.action === 'add' && this.page_id === null) {

                // if (this.file === undefined || this.file === '' || this.file === null) {
                //     this.success_file = true;
                // }
                this.addEditLoader = true;
                this.stageService.addEditStage(formData).subscribe((data) => {
                    this.addEditLoader = false;
                    if (data) {

                        this.disablebtn = false;
                        this.resetInputs();

                        this.alertService.success({
                            title: 'حفظ المراحلة',
                            text: "تم حفظ بيانات المراحلة بنجاح."
                        });


                    }

                });

            }
            else {
                this.addEditLoader = true;
                this.stageService.addEditStage(formData).subscribe((data) => {
                    this.addEditLoader = false;
                    this.disablebtn = false;
                    if (data) {

                        if (data === 403) {
                            this.alertService.error({
                                title: 'خطأ !!!',
                                text: "هذا المراحلة غير موجودة !!"
                            });
                        }
                        else {
                            this.alertService.success({
                                title: 'تعديل المراحلة',
                                text: "تم تعديل بيانات المراحلة بنجاح."
                            });
                        }
                    }

                });

            }

        }

    }

    resetInputs() {

        for (let lang in this.myArrayLangs) {
            this.myArrayLangs[lang]['stage_name'] = '';
        }

        this.localUrl = this.defaultImg;
        this.successRemoveImg = false;
        if (this.all_countries.length > 0) {
            this.country_id = this.all_countries[0].id;
        }else{
            this.country_id='';
        }
        this.file = null;
        this.file = '';
        this.file = undefined;
        this.disablebtn = false;
    }

    getAllCountries() {
        this.stageService.getAllCountries().subscribe((data) => {
            if (data) {
                this.all_countries = data;
                if (this.all_countries.length > 0) {
                    this.country_id = this.all_countries[0].id;
                }
            } else {
                this.all_countries = [];
            }
        });
    }
    getOneStage(id) {
        let stage_id = parseInt(id);

        this.stageService.getOneStage(stage_id).subscribe((data) => {
            if (data) {

                this.successImg = true;
                if (data.img === null || data.img === '') {
                    this.localUrl = this.commService._hostName + 'uploads/no_image.jpg';
                    this.success_file = true;
                }
                else {
                    this.localUrl = this.commService._hostName + 'uploads/stages/' + data.img;
                }

                this.status = data.status === "0" ? false : true;
                this.country_id = data.country_id;

                for (let lang in data['langs']) {
                    this.myArrayLangs[lang]['stage_name'] = data['langs'][lang]['name'];
                }

                this.isDataAvailable = true;

            }

        });

    }

    getAllLanguages() {

        this.commService.getAllLanguages().subscribe((data) => {
            if (data) {

                for (let lang in data) {
                    let myLangObj = {
                        'lang_code': data[lang]['code'],
                        'lang_name': data[lang]['name'],
                        'lang_img': this.langImgPath + data[lang]['lang_image'],
                        'stage_name': '',
                    };
                    this.myArrayLangs.push(myLangObj);

                    this.successfull_stage_inputs[lang] = true;
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

    goToTab(inx) {
        this.selectedTab = inx;
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
            this.getAllCountries();

            let roles = ["stages_add", "stages_edit"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.stages_add = res.stages_add === '1' ? true : false;
                    this.stages_edit = res.stages_edit === '1' ? true : false;

                    this.actRouter.paramMap.subscribe((params: ParamMap) => {
                        this.page_id = params.get('id');

                        if (this.page_id !== null) {
                            this.commService.setTitle("تعديل بيانات المراحلة");

                            this.edit_action = true;
                            this.action = 'edit';

                            if (this.stages_edit === true) {
                                this.getOneStage(this.page_id);
                            }
                            else {
                                this.isDataAvailable = true;
                            }
                        }
                        else if (this.page_id === null) {
                            this.commService.setTitle("إضافة دولة جديدة");

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