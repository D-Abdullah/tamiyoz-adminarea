import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Helpers } from '../../helpers';
import { ScriptLoaderService } from '../../_services/script-loader.service';
import { Router } from '@angular/router';

import { CommonService } from '../../_services/common.service';

// import { Observable } from 'rxjs'; // Angular 6
import { Observable } from 'rxjs/Rx'; // Angular 5


import * as $ from "jquery";
// declare var jquery: any;
// declare var $: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-grid.m-grid--ver-desktop.m-grid--desktop.m-body",
    templateUrl: "./default.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class DefaultComponent implements OnInit, AfterViewInit {

    @ViewChild('allUnReadNotificationsInput', {static: false}) private allUnReadNotificationsInput: ElementRef;
    @ViewChild('adminUrl', {static: false}) private adminUrl: ElementRef;

    allUnReadNotifications: any;
    sub: any;

    constructor(
        private _script: ScriptLoaderService,
        private router: Router,
        public commonService: CommonService,
    ) {
    }

    ngOnInit() {

        if (localStorage.getItem('currentUser') === null || localStorage.getItem('token') === null || localStorage.getItem('settings') === null) {
            this.router.navigate(['/login']);
        }

    }

    ngAfterViewInit() {

    }

}
