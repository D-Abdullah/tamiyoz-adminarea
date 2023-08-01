import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../../_services/user.service';
import { CommonService } from '../../../../../_services/common.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

import { SweetAlertService } from 'angular-sweetalert-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { FormBuilder } from '@angular/forms';
import { fail } from 'assert';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-add-member",
    templateUrl: "./add-member.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AddMemberComponent implements OnInit {

    action: string;
    page_id: string;
    add_action: boolean;
    edit_action: boolean;

    full_name_title: string = '';
    full_name: string = '';

    mobile: string = '';
    email: string = '';
    password: string = '';
    confirm_password: string = '';
    notes: string = '';
    parentIDs: any[] = [];
    studentIDs: any[] = [];
    searchstudentIds: any[] = [];
    searchparentIds: any[] = [];

    user_level;
    user_type: string = 'student';

    area: string = '';
    lat: string = '';
    lon: string = '';

    selectedsearch: string = '';

    searchstudentIdsdata: boolean = false;
    searchparentIdsdata: boolean = false;
    status: boolean = true;

    errorPlaceAddress: boolean = false;
    errorRequirData: boolean = false;

    disablebtn: boolean = false;
    successfull_name: boolean = false;

    errorMobileErrorExsistMsg = false;
    successPassword: boolean = false;
    successConfirmPassword: boolean = false;
    misMatchConfirm: boolean = false;


    addEditLoader: boolean = false;


    success_grade: boolean = false;
    success_stage: boolean = false;


    user_id;
    added_by;
    file;

    formData: FormData = null;
    selectedFile: any = null;
    successRemoveImg: boolean = false;
    successRemoveIDFile: boolean = false;

    success_file: boolean = false;
    success_id_file: boolean = false;
    successImg: boolean = true;
    successImgIDfile: boolean = true;
    successMobile: boolean = false;
    successEmail: boolean = false;
    errorEmailErrorExsistMsg = false;

    emailValue: string;

    all_countries: any[] = [];
    all_country_stages: any[] = [];
    all_stage_grades: any[] = [];
    country_id: string = '';
    stage_id: string = '';
    grade_id: string = '';

    members_add: boolean;
    members_edit: boolean;

    localUrl;
    localParent = '';
    localUrlIDfile;

    defaultImg: string;
    isDataAvailable: boolean = false;
    loadingImgPath: string = '';

    public full_nameErrorMsg: string = 'يرجى إدخال الاسم الكامل';
    public emailErrorMsg: string = 'يرجى إدخال البريد الإلكترونى';
    public emailErrorExsistMsg: string = 'هذا البريد الإلكترونى موجود من قبل';
    public mobileErrorMsg: string = 'يرجى إدخال رقم الهاتف صحيح (ارقام ) ';
    public mobileErrorExsistMsg: string = 'هذا الموبايل موجود من قبل';
    public passwordErrorMsg: string = 'يرجى إدخال كلمة المرور';
    public confirmPasswordErrorMsg: string = 'يرجى تأكيد كلمة المرور';
    public misMatchConfirmErrorMsg: string = 'كلمة المرور وتأكيدها غير متطابقتين !!';
    public fileErrorMsg: string = 'يرجى إختيار صورة العضو';
    public adderssplacemsgerror: string = 'يرجى إختيار المدينة والمنطقة';
    public requirDataerror: string = 'يرجى إدخال البيانات المطلوبة';
    public stageErrorMsg: string = 'يرجى إختيار المرحلة ';
    public gradeErrorMsg: string = 'يرجى إختيار الصف ';

    constructor(public http: HttpClient, public commService: CommonService, public adminService: UserService, private fb: FormBuilder, private alertService: SweetAlertService, private router: Router, private actRouter: ActivatedRoute, private _script: ScriptLoaderService) {

        this.defaultImg = this.commService._hostName + 'uploads/no_image.jpg';
        this.localUrl = this.defaultImg;
        this.localUrlIDfile = this.defaultImg;
        this.localParent = this.defaultImg;
        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';

    }

    showPreviewImage(event: any, type: string, inx = 0) {

        if (type === 'file') {
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
    }

    removeImg(type: string, inx) {

        if (type === 'file') {
            this.file = null;
            this.file = '';
            this.file = undefined;
            this.localUrl = this.defaultImg;
            this.successRemoveImg = false;
            this.success_file = true;
        }

    }


    onKeyUpfull_name(event: any) {
        this.successfull_name = event.target.value.trim() === '' ? true : false;
    }

    onKeyUpMobile(event: any) {
        var numbers = /^[0-9]+$/;
        //   console.log("numbers " , event.target.value.match(numbers));
        this.successMobile = event.target.value.trim() === '' ? true : false;
        this.successMobile = event.target.value.match(numbers) == null ? true : false;

        this.errorMobileErrorExsistMsg = false;
    }
    onBlurMobile(event: any) {

        let mobile = event.target.value;
        this.adminService.chickMobile(mobile).subscribe((data) => {
            if (data) {
                this.errorMobileErrorExsistMsg = true;
            }
            else {
                console.log("the mobile not exist");
            }
        });
    }
    onKeyUpEmail(event: any) {
        this.successEmail = event.target.value === '' ? true : false;
        this.errorEmailErrorExsistMsg = false;
    }
    onBlurEmail(event: any) {

        this.emailValue = event.target.value;
        this.adminService.chickEmail(this.emailValue).subscribe((data) => {
            if (data) {
                this.errorEmailErrorExsistMsg = true;
            }
            else {
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

    addEditUser() {
        // this.disablebtn = true;
        this.notes = this.notes === null ? '' : this.notes;
        this.successMobile = this.mobile === '' ? true : false;

        if (this.user_type == "student") {
            this.success_stage = this.stage_id > '0' ? false : true;
            this.success_grade = this.grade_id > '0' ? false : true;
        }

        let formData = new FormData();
        formData.append('full_name', this.full_name.trim());
        formData.append('user_type', this.user_type.trim());
        formData.append('added_by', this.added_by);
        if (this.user_type == "student") {
            formData.append('country_id', this.country_id);
            formData.append('stage_id', this.stage_id);
            formData.append('grade_id', this.grade_id);
            formData.append('parentIDs', JSON.stringify(this.parentIDs));
        }
        if (this.user_type == "parent") {
            formData.append('studentIDs', JSON.stringify(this.studentIDs));
        }

        formData.append('lon', this.lon);
        formData.append('lat', this.lat);
        formData.append('area', this.area);
        formData.append('status', this.status.toString());
        formData.append('mobile', this.mobile.trim());
        formData.append('email', this.email.trim());
        formData.append('password', this.password.trim());
        formData.append('notes', this.notes);
        formData.append('userType', 'members');

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


        if (this.action === 'add' && this.page_id === null) {
            if (this.password === '') { this.successPassword = true; }
            if (this.confirm_password === '') { this.successConfirmPassword = true; }

        }

        this.misMatchConfirm = this.password !== this.confirm_password ? true : false;
        if (this.action === 'add' && this.page_id === null) {

            if (this.full_name === '' || this.password === '' || this.confirm_password === '' || this.misMatchConfirm === true || this.successMobile === true || this.errorPlaceAddress === true || this.errorRequirData === true || this.success_stage === true || this.success_grade === true) {
                this.disablebtn = false;
                return;
            }
            else {
                this.addEditLoader = true;

                this.adminService.addEditUser(formData).subscribe((data) => {
                    this.addEditLoader = false;
                    if (data) {

                        this.disablebtn = false;
                        this.resetInputs();
                        this.alertService.success({
                            title: 'حفظ العضو',
                            text: "تم حفظ بيانات العضو بنجاح."
                        });
                    }
                });
            }
        }
        else {

            if (this.full_name === '' || this.misMatchConfirm === true || this.successMobile === true || this.errorPlaceAddress === true || this.errorRequirData === true) {
                this.disablebtn = false;
                return;
            }
            else {

                this.addEditLoader = true;

                this.adminService.addEditUser(formData).subscribe((data) => {
                    this.addEditLoader = false;
                    if (data) {
                        this.disablebtn = false;
                        if (data === 403) {
                            this.alertService.error({
                                title: 'خطأ !!!',
                                text: "هذا العضو غير موجود !!"
                            });
                        }
                        else {
                            this.alertService.success({
                                title: 'تعديل العضو',
                                text: "تم تعديل بيانات العضو بنجاح."
                            });
                        }
                    }
                });
            }
        }
    }

    resetInputs() {
        this.full_name = '';
        this.mobile = '';
        this.email = '';
        this.password = '';
        this.confirm_password = '';
        this.notes = '';
        this.area = '';
        this.lon = '';
        this.lat = '';
        this.parentIDs = [{
            "id": "", "parent_id": "", "validate": true
        }]
        this.studentIDs = [{
            "id": "", "student_id": "", "validate": true
        }]
        this.country_id = '';
        this.stage_id = '';
        this.grade_id = '';
        this.user_type = 'student';
        this.localUrl = this.defaultImg;
        this.successRemoveImg = false;
        this.file = null;
        this.file = '';
        this.file = undefined;
        this.getAllCountries();

    }

    getOneUser(id) {
        let memberId = parseInt(id);

        this.adminService.getOneUser('members', memberId).subscribe((data) => {
            if (data) {
                console.log("getOneuser", data);
                this.full_name_title = data.full_name;
                this.full_name = data.full_name;

                this.mobile = data.mobile;
                this.email = data.email;
                this.user_level = data.user_level;
                this.notes = data.notes;
                this.area = data.location.area;
                this.lon = data.location.lon;
                this.lat = data.location.lat;
                this.status = data.status === "0" ? false : true;
                this.user_type = data.user_type;

                if (this.user_type == 'student') {
                    this.country_id = data.country_id;
                    if (this.country_id && this.country_id != '' && this.country_id != null) {
                        this.getStagesWithCountry(this.country_id)
                    }
                    this.stage_id = data.stage_id;
                    if (this.stage_id && this.stage_id != '' && this.stage_id != null) {
                        this.getGradesWithStageID(this.stage_id)
                    }
                    this.grade_id = data.grade_id;
                    this.parentIDs = data.parentIDs
                    if( this.parentIDs.length < 1 ){
                        this.parentIDs = [{
                            "id": "", "parent_id": "", "validate": true
                        }];
                    }else{
                        for(let ipid=0;ipid < this.parentIDs.length;ipid++){
                            this.parentIDs[ipid].validate=this.parentIDs[ipid].validate == '1' ? true:false;
                        }
                    }
                }
                if (this.user_type == 'parent') {
                    this.studentIDs = data.studentIDs;
                    if( this.studentIDs.length < 1 ){
                        this.studentIDs = [{
                            "id": "", "student_id": "", "validate": true
                        }];
                    }
                    else{
                        for(let ipid=0;ipid < this.studentIDs.length;ipid++){
                            this.studentIDs[ipid].validate=this.studentIDs[ipid].validate == '1' ? true:false;
                        }
                    }
                }

                this.successImg = true;
                if (data.img == null || data.img == '' || data.img == undefined) {
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

    addMoreParent() {
        var newObjop = {
            "id": "", "parent_id": "", "validate": true
        }
        this.parentIDs.push(newObjop);
    }
    addMoreStudent() {
        var newObjop = {
            "id": "", "student_id": "", "validate": true
        }
        this.studentIDs.push(newObjop);
    }
    removeParent(index) {

        if (this.parentIDs[index]['id'] < 1) {
            this.parentIDs.splice(index, 1);
        } else {
            this.alertService.warning({
                title: 'هل انت متأكد ؟',
                text: "ستكون غير قادر على إستعادة البيانات المفقودة",
                showCancelButton: true,
                confirmButtonText: 'نعم, احذف الآن',
                cancelButtonText: 'لا, إلغـــاء',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    this.adminService.deleteStudentsParents([this.parentIDs[index]['id']]).subscribe((data) => {
                        if (data) {
                            this.alertService.success({
                                title: 'حذف ولى الامر',
                                text: 'تم حذف السؤال بنجاح'
                            });
                            this.parentIDs.splice(index, 1);
                        } else {
                            console.log("Oops !! ....");
                        }
                    });
                }
                else if (result.dismiss === 'cancel') {
                    this.alertService.error({
                        title: 'تم الإلغـــاء',
                        text: "بياناتك ما زالت فى أمان"
                    });
                }
            }).catch(() => console.log('canceled'));
        }
    }
    removeStudent(index) {

        if (this.studentIDs[index]['id'] < 1) {
            this.studentIDs.splice(index, 1);
        } else {

            this.alertService.warning({
                title: 'هل انت متأكد ؟',
                text: "ستكون غير قادر على إستعادة البيانات المفقودة",
                showCancelButton: true,
                confirmButtonText: 'نعم, احذف الآن',
                cancelButtonText: 'لا, إلغـــاء',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    this.adminService.deleteStudentsParents([this.studentIDs[index]['id']]).subscribe((data) => {
                        if (data) {
                            this.alertService.success({
                                title: 'حذف الطالب',
                                text: 'تم حذف الطالب بنجاح'
                            });
                            this.studentIDs.splice(index, 1);
                        } else {
                            console.log("Oops !! ....");
                        }
                    });
                }
                else if (result.dismiss === 'cancel') {
                    this.alertService.error({
                        title: 'تم الإلغـــاء',
                        text: "بياناتك ما زالت فى أمان"
                    });
                }
            }).catch(() => console.log('canceled'));
        }
    }

    getSearchParents(index) {
        this.selectedsearch = index;
        this.searchstudentIds = [];
        if (this.parentIDs[index].parent_id > 0) {
            this.adminService.getSearchUsersByType(this.parentIDs[index].parent_id, 'parent').subscribe((data) => {
                if (data) {
                    this.searchstudentIds = data;
                    if (this.searchstudentIds.length > 0) {
                        this.searchstudentIdsdata = true
                    }
                }
            });
        }
    }
    getSearchStudents(index) {
        this.selectedsearch = index;
        this.searchparentIds = [];
        if (this.studentIDs[index].student_id > 0) {
            this.adminService.getSearchUsersByType(this.studentIDs[index].student_id, 'student').subscribe((data) => {
                if (data) {
                    this.searchparentIds = data;
                    if (this.searchparentIds.length > 0) {
                        this.searchparentIdsdata = true
                    }
                }
            });
        }
    }


    setParentId(index, parent_id) {
        this.searchstudentIdsdata = false
        if (this.parentIDs[index]) {
            this.parentIDs[index].parent_id = parent_id
        }
    }
    setStudentId(index, student_id) {
        this.searchparentIdsdata = false
        if (this.studentIDs[index]) {
            this.studentIDs[index].student_id = student_id
        }
    }

    getAllCountries() {
        this.all_countries = [];

    }

    getStagesWithCountry(country_id) {
        if (country_id > 0) {

        }
    }
    getGradesWithStageID(stage_id) {
        if (stage_id > 0) {

        }
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

            this.getAllCountries();

            let roles = ["members_add", "members_edit"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.members_add = res.members_add === '1' ? true : false;
                    this.members_edit = res.members_edit === '1' ? true : false;

                    this.actRouter.paramMap.subscribe((params: ParamMap) => {

                        this.page_id = params.get('id');

                        if (this.page_id !== null) {
                            this.commService.setTitle("تعديل بيانات العضو");
                            this.edit_action = true;
                            this.action = 'edit';
                            this.successImg = false;

                            if (this.members_edit === true) {
                                this.getOneUser(this.page_id);
                            }
                            else {
                                this.isDataAvailable = true;
                            }
                        }
                        else if (this.page_id === null) {
                            this.commService.setTitle("إضافة عضو جديد");
                            this.add_action = true;
                            this.action = 'add';
                            this.isDataAvailable = true;

                            this.defaultImg = this.commService._hostName + 'uploads/no_image.jpg';
                            this.localUrl = this.defaultImg;
                            this.parentIDs = [{
                                "id": "", "parent_id": "", "validate": true
                            }];
                            this.studentIDs = [{
                                "id": "", "student_id": "", "validate": true
                            }];

                        } else {
                            this.router.navigate(['/404']);
                        }
                    });

                }
            });
        }
    }
}
