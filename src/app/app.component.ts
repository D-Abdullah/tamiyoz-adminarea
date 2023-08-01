import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Helpers } from "./helpers";
import { SettingsService } from '../app/theme/pages/main-components/settings/settings.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'body',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    title = 'app';
    globalBodyClass = 'm-page--loading-non-block m-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default';

    constructor(private _router: Router, public http: HttpClient, public settingsService: SettingsService) {

        this.getAllSettings();

    }

    ngOnInit() {
        this._router.events.subscribe((route) => {
            if (route instanceof NavigationStart) {
                Helpers.setLoading(true);
                Helpers.bodyClass(this.globalBodyClass);
            }
            if (route instanceof NavigationEnd) {
                Helpers.setLoading(false);
            }
        });
    }

    getAllSettings() {

        this.settingsService.getAllSettings().subscribe((data) => {
            if (data) {
                //console.log(data);
                localStorage.setItem('settings', JSON.stringify(data));
            }

        });
    }
}