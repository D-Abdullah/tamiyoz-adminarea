import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from '../../../_services/common.service';

@Component({
    selector: '.m-wrapper',
    templateUrl: './not-found.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class NotFoundComponent implements OnInit {

    constructor(public commService: CommonService) {
    }

    ngOnInit() {
        this.commService.setTitle("الصفحة غير موجودة");
    }
}