import { Component, OnInit, ViewEncapsulation, AfterViewInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Helpers } from '../../../helpers';
import { Router } from '@angular/router';
import { CommonService } from '../../../_services/common.service';

// import { Observable } from 'rxjs'; // Angular 6 
import { Observable } from 'rxjs/Rx'; // Angular 5

declare var jquery: any;
declare var $: any;

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {

    full_name: string = '';
    email: string = '';

    site_name: string = '';
    userImg = '';
    user_id;
    provider_id;
    userType='';
    user_level;

    constructor(
        private router: Router,
        public commService: CommonService,
    ) {

        if (localStorage.getItem('currentUser') === null || localStorage.getItem('settings') === null) {
            this.full_name = 'Demo'
            this.email = 'demo@demo.com';
            this.site_name = 'link';
        }
        else {
            let currentUser = localStorage.getItem('currentUser');
            let settings = localStorage.getItem('settings');

            this.site_name = JSON.parse(settings).site_name;

            if (JSON.parse(currentUser).img === undefined || JSON.parse(currentUser).full_name === undefined) {
                this.logout();
                return;
            }
            else {

                this.full_name = JSON.parse(currentUser).full_name;
                this.email = JSON.parse(currentUser).email;
                this.user_id = JSON.parse(currentUser).id;
                this.user_level = JSON.parse(currentUser).user_level;
                this.userImg = this.commService._hostName + 'uploads/users/' + JSON.parse(currentUser).img;

            }

        }

    }

    ngOnInit() {
        this.provider_id = localStorage.getItem('provider_id');
        if(this.provider_id ==''|| this.provider_id==undefined|| this.provider_id==null){
            this.userType='admins'
        }else{
            this.userType='representatives_admins';
        }

        if(JSON.parse(localStorage.getItem('currentUser')).img === undefined || JSON.parse(localStorage.getItem('currentUser')).img ==='' || JSON.parse(localStorage.getItem('currentUser')).img === null ){
            this.userImg = this.commService._hostName + 'uploads/no_image.jpg';
          }
    }

    logout() {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        this.router.navigate(['/login']);
    }

    ngAfterViewInit() {
        mLayout.initHeader();

    }

}