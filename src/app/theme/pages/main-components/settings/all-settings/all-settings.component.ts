import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from '../../../../../_services/common.service';
import { SettingsService } from '../settings.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-all-settings",
    templateUrl: "./all-settings.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AllSettingsComponent implements OnInit {

    editSettingsForm: FormGroup;

    site_name: string = '';
    site_desc_en: string = '';
    address_en: string = '';
    site_desc: string = '';
    other_phone: string = '';
    youtube: string = '';
    longitude: string = '';
    latitude: string = '';
    site_keywords: string = '';
    site_email: string = '';
    address: string = '';
    phone: string = '';


    facebook: string = '';
    twitter: string = '';
    instagram: string = '';
    linkedin: string = '';
    tiktok:string='';

    success: boolean = true;

    settings_view: boolean;

    user_id;

    isDataAvailable: boolean = false;
    loadingImgPath: string = '';

    public siteNameErrorMsg: string = 'يرجى إدخال اسم الموقع';
    public siteDescriptionErrorMsg: string = 'يرجى إدخال وصف الموقع';
    // public siteDescription_enErrorMsg: string = 'يرجى إدخال وصف الموقع';
    public address_enErrorMsg: string = 'يرجى إدخال وصف الموقع';
    public siteKeywordsErrorMsg: string = 'يرجى إدخال الكلمات الدالة للموقع';
    public site_emailErrorMsg: string = 'يرجى إدخال البريد الإلكترونى للموقع';
    public addressErrorMsg: string = 'يرجى إدخال العنوان للموقع';
    public phoneErrorMsg: string = 'يرجى إدخال الواتس اب';

    constructor(public commService: CommonService, public settingsService: SettingsService, private router: Router, private actRouter: ActivatedRoute, private alertService: SweetAlertService, private fb: FormBuilder) {

        this.editSettingsForm = fb.group({
            'site_name': [null, Validators.required],
            'site_desc_en': [null, Validators.required],
            'site_desc': [null, Validators.required],
            'address_en': [null, Validators.required],
            'other_phone': [null, Validators.required],
            'youtube': [null, Validators.required],
            'longitude': [null, Validators.required],
            'latitude': [null, Validators.required],
            'site_keywords': [null, Validators.required],
            'site_email': [null, Validators.required],
            'address': [null, Validators.required],
            'phone': [null, Validators.required],


            'facebook': [null, Validators.required],
            'twitter': [null, Validators.required],
            'instagram': [null, Validators.required],
            'linkedin': [null, Validators.required],
            'tiktok':[null,Validators.required]

        });

        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';

    }

    ngOnInit() {

        this.commService.setTitle("الإعدادات");

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;

            let roles = ["settings_view"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.settings_view = res.settings_view === '1' ? true : false;

                    if (this.settings_view === true) {
                        this.getAllSettings();
                    }
                    else {
                        this.isDataAvailable = true;
                    }
                }
            });

        }

    }

    getAllSettings() {

        this.settingsService.getAllSettings().subscribe((data) => {
            if (data) {

                // console.log(data);

                this.site_name = data.site_name;
                this.site_desc = data.site_desc;
                this.site_desc_en  = data.site_desc_en;
                this.address_en = data.address_en;
                this.other_phone = data.other_phone;
                this.youtube = data.youtube;
                this.longitude = data.longitude;
                this.latitude = data.latitude;
                this.site_keywords = data.site_keywords;
                this.site_email = data.site_email;
                this.address = data.address;
                this.phone = data.phone;
                this.facebook = data.facebook;
                this.twitter = data.twitter;
                this.instagram = data.instagram;
                this.linkedin = data.linkedin;
                this.tiktok = data.tiktok;
                this.isDataAvailable = true;


            }

        });

    }

    editSiteSettings(settings) {

        let body = {
            "site_name": settings.site_name,
            "site_desc": settings.site_desc,
            "site_desc_en": settings.site_desc_en,
            "address_en": settings.address_en,
            "other_phone": settings.other_phone,
            "youtube": settings.youtube,
            "longitude": settings.longitude,
            "latitude": settings.latitude,
            "site_keywords": settings.site_keywords,
            "site_email": settings.site_email,
            "address": settings.address,
            "phone": settings.phone,

            "facebook":settings.facebook,
            "twitter":settings.twitter,
            "instagram":settings.instagram,
            "linkedin":settings.linkedin,
            "tiktok":settings.tiktok,
        };

        // console.log(body);

        this.settingsService.editSettings(body).subscribe((data) => {
            if (data) {

                this.alertService.success({
                    title: 'تعديل الإعدادات',
                    text: "تم تعديل الإعدادات بنجاح.",
                });

                localStorage.removeItem('settings');
                localStorage.setItem('settings', JSON.stringify(data));

            }

        });

    }

}
