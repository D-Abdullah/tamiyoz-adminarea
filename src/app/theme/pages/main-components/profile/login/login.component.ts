import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { AnimationTriggerMetadata } from '@angular/animations';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../../_services/user.service';
import { SettingsService } from '../../settings/settings.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../../_services/common.service';
import { NgForm, FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, AfterViewInit {

    signInForm: FormGroup;
    forgetPasswordForm: FormGroup;

    loginEmail: string = '';
    loginPassword: string = '';

    fp_email: string = '';

    rpassword: string = '';
    current_user: {};

    success: boolean = true;
    misMatchPass: boolean = false;
    invalidLogin: boolean = false;
    existed_email: boolean = false;

    public emailErrorMsg: string = 'يرجى إدخال البريد الإلكترونى الصحيح';
    public passErrorMsg: string = 'يرجى إدخال كلمة المرور الصحيحة';
    public rpassErrorMsg: string = 'يرجى تأكيد كلمة المرور';
    public misMatchPassErrorMsg: string = 'كلمة المرور وتأكيدها غير متطابقين';
    public existed_emailErrorMsg: string = 'هذا البريد غير موجود !!';
    public invalidLoginErrorMsg: string = 'البريد الإلكترونى أو كلمة المرور غير صحيحة';

    returnUrl: string;

    fp_msg_status = false;
    fp_msg_type = '';
    fp_msg_content = '';

    constructor(private _script: ScriptLoaderService, public commService: CommonService, public http: HttpClient, public userService: UserService, private fb: FormBuilder, private router: Router, private actRouter: ActivatedRoute, public settingsService: SettingsService) {

        this.signInForm = fb.group({
            'loginEmail': [null, Validators.required],
            'loginPassword': [null, Validators.required],
        });

        this.forgetPasswordForm = fb.group({
            'fp_email': [null, Validators.required],
        });

    }

    signIn(login) {
        let body: any = {
            'email': login.loginEmail,
            'password': login.loginPassword
        }

        if (login.email !== '' || login.email !== null) {

            this.userService.signIn(body).subscribe((data) => {
                if (data.userData) {
                    // console.log("token",data.token);
                    this.loginEmail = '';
                    this.loginPassword = '';
                    this.success = false;
                    this.misMatchPass = false;
                    this.current_user = data;

                    ///// login
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("currentUser", JSON.stringify(data.userData));

                    this.router.navigateByUrl(this.returnUrl);

                }
                else {
                    this.invalidLogin = true;
                }

            });
        }
    }

    forgetPassword(fp) {

        let body: any = {
            'email': fp.fp_email,
        }

        if (fp.fp_email !== '' || fp.fp_email !== null) {

            this.userService.forgetPassword(body).subscribe((data) => {
                if (data) {

                    if (data.success === 'successSendPassByEmail') {
                        this.fp_msg_status = true;
                        this.fp_msg_type = 'success';
                        this.fp_msg_content = 'تم إرسال كلمة المرور الجديدة الى بريدك الإلكترونى بنجاح.';
                    }
                    else if (data.error === 'problemToSendPassword') {
                        this.fp_msg_status = true;
                        this.fp_msg_type = 'danger';
                        this.fp_msg_content = 'Error: go to online to do this action ...';
                    }
                    else {
                        this.fp_msg_status = true;
                        this.fp_msg_type = 'danger';
                        this.fp_msg_content = this.existed_emailErrorMsg;
                    }
                }
                else {
                    this.fp_msg_status = true;
                    this.fp_msg_type = 'danger';
                    this.fp_msg_content = 'يرجى التحقق فيما بعد !!!';
                }
            });
        }
    }

    getAllSettings() {

        this.settingsService.getAllSettings().subscribe((data) => {
            if (data) {
                localStorage.setItem('settings', JSON.stringify(data));
            }

        });
    }

    ngOnInit() {
        this.commService.setTitle("تسجيل الدخول");
        // reset login status
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("provider_id");
        localStorage.removeItem("userLevels");
        this.getAllSettings();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.actRouter.snapshot.queryParams['returnUrl'] || '/';

    }

    ngAfterViewInit() {

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/default/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
            });

        this._script.loadScripts('app-login',
            ['assets/snippets/pages/user/login.js']);

        Helpers.bodyClass('m--skin- m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default');

    }

}
