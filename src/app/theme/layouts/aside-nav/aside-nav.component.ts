import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let mLayout: any;
@Component({
    selector: "app-aside-nav",
    templateUrl: "./aside-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent implements OnInit, AfterViewInit {

    
    public user_id='';
    public provider_id='';
    constructor(private router: Router) {
    }
    ngOnInit() {

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;
            this.provider_id = localStorage.getItem('provider_id');
        }

    }
    ngAfterViewInit() {

        mLayout.initAside();

    }

}