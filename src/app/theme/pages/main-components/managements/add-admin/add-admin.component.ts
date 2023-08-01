import { Component, OnInit, ViewEncapsulation, Input, NgModule } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { UserService } from '../../../../../_services/user.service';
import { CommonService } from '../../../../../_services/common.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NgForm, FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-add-admin",
    templateUrl: "./add-admin.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AddAdminComponent implements OnInit {

    action: string;
    page_id: string;
    add_action: boolean;
    edit_action: boolean;

    full_name_title: string = '';
    full_name: string = '';
    email: string = '';
    mobile: string = '';
    password: string = '';
    confirm_password: string = '';
    notes: string = '';
    user_level: string = '';
    emailValue:string;

    successfull_name: boolean = false;
    successEmail: boolean = false;
    errorEmailErrorExsistMsg = false;
    errorMobileErrorExsistMsg=false;
    successMobile:boolean=false;
    successPassword: boolean = false;
    successConfirmPassword: boolean = false;
    successUserLevel: boolean = false;
    misMatchConfirm: boolean = false;

    user_id;
    added_by;
    file;
    userLevels;

    formData: FormData = null;
    selectedFile: any = null;
    successRemoveImg: boolean = false;
    success_file: boolean = false;
    successImg: boolean = true;

    admins_add: boolean;
    admins_edit: boolean;
    isDataAvailable: boolean = false;
    disablebtn:boolean=false;
    errorPlaceAddress: boolean = false;
    cities: any = [];
    // city_id='';
    districts: any = [];
    // district_id='';
    // area='';
    // lon='';
    // lat='';

    localUrl;
    defaultImg: string;
    loadingImgPath: string = '';

    public full_nameErrorMsg: string = 'يرجى إدخال الاسم الكامل';
    public emailErrorMsg: string = 'يرجى إدخال البريد الإلكترونى';
    public mobileErrorMsg:string ='يرجى إدخال رقم الهاتف ';
    public mobileErrorExsistMsg: string = 'هذا الموبايل موجود من قبل';
    public emailErrorExsistMsg: string = 'هذا البريد الإلكترونى موجود من قبل';
    public passwordErrorMsg: string = 'يرجى إدخال كلمة المرور';
    public confirmPasswordErrorMsg: string = 'يرجى تأكيد كلمة المرور';
    public misMatchConfirmErrorMsg: string = 'كلمة المرور وتأكيدها غير متطابقتين !!';
    public userLevelErrorMsg: string = 'يرجى إختيار مستوى الإدارة';
    public fileErrorMsg: string = 'يرجى إختيار صورة الإدارة';
    public adderssplacemsgerror: string = 'يرجى إختيار المدينة والمنطقة';

    constructor(public http: HttpClient, public commService: CommonService, public adminService: UserService, private fb: FormBuilder, private alertService: SweetAlertService, private router: Router, private actRouter: ActivatedRoute) {

        this.defaultImg = this.commService._hostName + 'uploads/no_image.jpg';
        this.localUrl = this.defaultImg;
        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';

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

    onKeyUpfull_name(event: any) {
        this.successfull_name = event.target.value === '' ? true : false;
    }

    onKeyUpMobile(event: any) {
        this.successMobile = event.target.value.trim() === '' ? true : false;
        this.errorMobileErrorExsistMsg=false;
    }
    onBlurMobile(event: any) {

        let mobile = event.target.value;
        this.adminService.chickMobile(mobile).subscribe((data) => {
            if (data) {
                this.errorMobileErrorExsistMsg=true;
            }
            else{
                console.log("the mobile not exist");
            }
        });
    }

    onKeyUpEmail(event: any) {
        this.successEmail = event.target.value === '' ? true : false;
        this.errorEmailErrorExsistMsg=false;
    }
    onBlurEmail(event: any) {

        this.emailValue = event.target.value;
        this.adminService.chickEmail(this.emailValue).subscribe((data) => {
            if (data) {
                this.errorEmailErrorExsistMsg=true;
            }
            else{
                console.log("the email not exist");
            }
        });
    }

    onKeyUpPassword(event: any) {
        if (this.action === 'add' && this.page_id === null) {
            this.successPassword = event.target.value === '' ? true : false;
        }
    }

    onKeyUpConfirmPassword(event: any) {
        if (this.action === 'add' && this.page_id === null) {
            this.successConfirmPassword = event.target.value === '' ? true : false;
        }
    }

    getUsersLevels() {

        this.adminService.getUsersLevels().subscribe((data) => {
            if (data) {
                this.userLevels = data;
            }
        });

    }

    addEditUser() {

        this.disablebtn=true;
        let formData = new FormData();
        formData.append('full_name', this.full_name);
        formData.append('added_by', this.added_by);
        formData.append('email', this.email);
        formData.append('mobile', this.mobile);
        // formData.append('area', this.area);
        // formData.append('lon', this.lon);
        // formData.append('lat', this.lat);
        // formData.append('city_id', this.city_id);
        // formData.append('district_id', this.district_id);
        formData.append('password', this.password);
        formData.append('notes', this.notes);
        formData.append('status', 'true');
        formData.append('user_level', this.user_level);
        formData.append('level_type', 'admin');

        formData.append('userType', 'admins');

        if (this.add_action === true) {
            formData.append('operation', this.action);
        }

        if (this.edit_action === true) {
            formData.append('user_id', this.page_id);
            formData.append('operation', this.action);
        }

        if (this.selectedFile !== null) {
            if (this.selectedFile.files.length > 0) {
                formData.append('file', this.selectedFile.files[0]);
            }
        }

        if (this.full_name === '') { this.successfull_name = true; }
        if (this.email === '') { this.successEmail = true; }
        if (this.user_level == '' || this.user_level == null) { this.successUserLevel = true; }


        if (this.action === 'add' && this.page_id === null) {

            if (this.password === '') { this.successPassword = true; }
            if (this.confirm_password === '') { this.successConfirmPassword = true; }

            // if (this.file === undefined || this.file === '' || this.file === null) {
            //     this.success_file = true;
            // }

        }

        this.misMatchConfirm = this.password !== this.confirm_password ? true : false;

        if (this.action === 'add' && this.page_id === null) {

            if (this.full_name === '' ||this.errorEmailErrorExsistMsg===true || this.email === '' || this.password === '' || this.confirm_password === '' || this.user_level === '' || this.misMatchConfirm === true) {
                this.disablebtn=false;
                return;
            }
            else {

                this.adminService.addEditUser(formData).subscribe((data) => {
                    if (data) {
                        this.disablebtn=false;
                        this.resetInputs();
                        this.alertService.success({
                            title: 'حفظ الإدارة',
                            text: "تم حفظ الإدارة بنجاح."
                        });
                    }
                });
            }
        }
        else {

            if (this.full_name === '' || this.email === '' || this.user_level === '' || this.misMatchConfirm === true) {
                this.disablebtn=false;
                return;
            }
            else {

                this.adminService.addEditUser(formData).subscribe((data) => {
                    if (data) {
                        this.disablebtn=false;
                        if (data === 403) {
                            this.alertService.error({
                                title: 'خطأ !!!',
                                text: "هذا المستخدم غير موجود."
                            });
                        }
                        else {
                            this.alertService.success({
                                title: 'تعديل الإدارة',
                                text: "تم تعديل الإدارة بنجاح."
                            });
                        }
                    }

                });

            }

        }


    }

    backToAllTags() {
        this.router.navigate(['/management/all-admins']);
    }

    getAllCities() {
        this.cities = null;
        this.districts=null;
        this.adminService.getAllCities().subscribe((data) => {
            if (data) {
                this.cities = data;
            }
            else {
                this.cities = null;
            }
        });
    }
    // getDistrictsByCityId() {
    //     this.districts=null;
    //     this.district_id='';
    //     if(this.city_id !=''){
    //         this.adminService.getDistrictsByCityId(this.city_id).subscribe((data) => {
    //             if (data) {
    //                 this.districts = data;
    //             }
    //             else {
    //                 this.districts = null;
    //             }
    //         });
    //     }

    // }
    resetInputs() {
        this.full_name = '';
        this.email = '';
        this.mobile = '';
        this.password = '';
        this.confirm_password = '';
        this.notes = '';
        // this.area = '';
        // this.lon = '';
        // this.lat = '';
        // this.city_id = '';
        // this.district_id = '';
        this.user_level = '';
        this.localUrl = this.defaultImg;
        this.successRemoveImg = false;
        this.successUserLevel = false;
        this.file = null;
        this.file = '';
        this.file = undefined;
    }

    getOneUser(id) {
        let adminId = parseInt(id);
        this.adminService.getOneUser('admins', adminId).subscribe((data) => {
            if (data) {
                this.full_name_title = data.full_name;

                this.full_name = data.full_name;
                this.email = data.email;
                this.mobile = data.mobile;
                // this.password = data.password;
                this.notes = data.notes;
                // this.area = data.location.area;
                // this.lon = data.location.lon;
                // this.lat = data.location.lat;
                this.user_level = data.user_level;
                // this.city_id=data.city_id;
                // if(this.city_id !='' && this.city_id !='0'){
                //     this.getDistrictsByCityId();
                // }
                // this.district_id=data.district_id;
                this.successImg = true;
                if (data.img === null || data.img === '') {
                    this.localUrl = this.commService._hostName + 'uploads/no_image.jpg';
                    this.success_file = true;
                }
                else {
                    this.successRemoveImg = true;
                    this.localUrl = this.commService._hostName + 'uploads/users/' + data.img;
                }
                this.isDataAvailable = true;
            }
        });
    }

    removeImg() {
        this.file = null;
        this.file = '';
        this.file = undefined;
        this.localUrl = this.defaultImg;
        this.successRemoveImg = false;
        this.success_file = true;
    }

    ngOnInit() {

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;
            this.added_by = retrievedObject.id;
            this.getUsersLevels();
            this.getAllCities();
            let roles = ["admins_add", "admins_edit"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.admins_add = res.admins_add === '1' ? true : false;
                    this.admins_edit = res.admins_edit === '1' ? true : false;
                    this.actRouter.paramMap.subscribe((params: ParamMap) => {
                        this.page_id = params.get('id');
                        if (this.page_id !== null) {
                            this.commService.setTitle("تعديل الإدارة");
                            this.edit_action = true;
                            this.action = 'edit';
                            this.successImg = false;
                            if (this.admins_edit === true) {
                                this.getOneUser(this.page_id);
                            }
                            else {
                                this.isDataAvailable = true;
                            }
                        }
                        else if (this.page_id === null) {
                            this.commService.setTitle("إضافة إدارة جديدة");
                            this.add_action = true;
                            this.action = 'add';
                            this.isDataAvailable = true;
                        } else {
                            this.router.navigate(['/404']);
                        }
                    });
                }
            });
        }
    }
}
