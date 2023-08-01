import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import { CommonService } from '../../../_services/common.service';
// import { PostService } from '../../../_services/post.service';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';

@Component({
    selector: "app-index",
    templateUrl: "./index.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class IndexComponent implements OnInit, AfterViewInit {

    lat = 24.7253981;
    lng = 46.2620168;
    markers = [
    ];
    // html map tag (mapClick)="addMarker($event.coords.lat, $event.coords.lng)"

    languages_count: string = '';
    chances_count: string = '';
    partners_count: string = '';
    shops_count: string = '';
    stations_count: string = '';


    pages_count: string = '';
    projects_count: string = '';

    members_count: string = '';
    services_count: string = '';
    management_count: string = '';
    user_levels_count: string = '';
    fragment: string = '';

    public level_type='';
    public provider_data:boolean=false;
    public user_id='';
    public provider_id='';

    constructor(
        public commService: CommonService,
        private _script: ScriptLoaderService,
        private router: Router,
        private route: ActivatedRoute
    ) {


    }


    addMarker(lat: number, lng: number) {
        this.markers.push({ lat, lng, alpha: 0.4 });
      }

      selectMarker(event,user_id) {
            let url="/members/show-member/"+user_id;
            window.open(window.location.origin+url, '_blank');
      }



    getHomeStatistics() {

        this.commService.getHomeStatistics().subscribe((data) => {
            if (data) {

                //   console.log(data);
                this.languages_count = data.languages;
                this.chances_count = data.chances;
                this.partners_count = data.partners;
                this.pages_count = data.pages;
                this.projects_count = data.projects;

                this.members_count = data.members;
                this.services_count = data.services;
                this.management_count = data.management;
                this.user_levels_count = data.user_levels;
                this.shops_count = data.shops;
                this.stations_count = data.stations;

            }

        });

    }



    goToSpecificPage(path) {
        this.router.navigate([path]);
    }

    ngOnInit() {

        this.commService.setTitle("الرئيسية");


         this.route.fragment.subscribe(fragment => { this.fragment = fragment; });


         if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;
            this.getHomeStatistics();
        }

    }

    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);

    }



}
