import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { CommonService } from '../../../../../_services/common.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { UserService } from '../../../../../_services/user.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NgForm, FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-my-profile",
    templateUrl: "./my-profile.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class MyProfileComponent implements OnInit {

    my_profile_view: boolean;

    user_id;
    provider_id;
    userType='admins';

    full_name = '';
    email = '';
    mobile = '';
    img = '';
    level_name = '';
    notes = '';

    isDataAvailable: boolean = false;
    loadingImgPath: string = '';

    constructor(public http: HttpClient, public commService: CommonService, public userService: UserService, private router: Router, private actRouter: ActivatedRoute, private alertService: SweetAlertService, private _script: ScriptLoaderService, private fb: FormBuilder) {
        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
    }

    ngOnInit() {

        this.commService.setTitle("الصفحة الشخصية");

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;
            this.provider_id = localStorage.getItem('provider_id');

            let roles = ["my_profile_view"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.my_profile_view = res.my_profile_view === '1' ? true : false;

                    if (this.my_profile_view === true) {
                        this.getUserData(this.user_id);
                    }
                    else {
                        this.isDataAvailable = true;
                    }
                }
            });
        }

    }

    getUserData(userId) {

if(this.provider_id ==''|| this.provider_id==undefined|| this.provider_id==null){
    this.userType='admins'
}else{
    this.userType='representatives_admins';
}

        this.userService.getOneUser(this.userType, userId).subscribe((data) => {
            if (data) {

                 console.log("profile data",data);

                this.full_name = data.full_name;
                this.email = data.email;
                this.mobile = data.mobile;
                this.notes = data.notes;

                this.img = data.img === '' || data.img === null || data.img === undefined ? this.commService._hostName + 'uploads/no_image.jpg' : this.commService._hostName + 'uploads/users/' + data.img;

                this.level_name = data.level_name;

                this.isDataAvailable = true;
            }

        });

    }

}