import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { CommonService } from '../../../../../_services/common.service';
import { ShopsService } from '../shops.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-all-shops",
    templateUrl: "./all-shops.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AllShopsComponent implements OnInit, AfterViewInit {

    categoryForm: FormGroup;
    deleteForm: FormGroup;
    searchName: string = '';
    searchCountry: string = '';

    pagination_pages;
    resultObj = {};
    stagesCount: number;
    searchStagesCount: number;
    sortDirection;
    stagesStatus: string = '';

    current_page: number;
    previous;
    next;
    all_stages = [];
    all_countries: any[] = [];

    count;
    user_id;

    deleteMultiple: string = '';
    selectedOption: boolean = false;

    shops_view: boolean;
    shops_delete: boolean;

    loadingImgPath: string = '';
    catImgPath: string = '';
    isDataAvailable: boolean = false;
    noData: boolean = false;

    constructor(public http: HttpClient, public commService: CommonService, public stageService: ShopsService, private router: Router, private actRouter: ActivatedRoute, private alertService: SweetAlertService, private _script: ScriptLoaderService, private fb: FormBuilder) {

        this.categoryForm = fb.group({
            'searchName': [null],
            'searchCountry': [null],
            'item': [null],
        });

        this.deleteForm = fb.group({
            'deleteMultiple': [null],
        });

        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
        this.catImgPath = this.commService._hostName + 'uploads/shops/';

    }

    ngOnInit() {

        this.commService.setTitle("كافة المحلات");

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;
            this.getAllCountries();
            let roles = ["shops_view", "shops_delete"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.shops_view = res.shops_view === '1' ? true : false;
                    this.shops_delete = res.shops_delete === '1' ? true : false;
                    this.isDataAvailable = true;
                    if (this.shops_view === true) {
                        this.getAllData();
                    }
                }
            });

        }


    }
    getAllCountries() {
        this.stageService.getAllStations().subscribe((data) => {
            if (data) {
                // console.log("all_countries", data)
                this.all_countries = data;
            } else {
                this.all_countries = [];
            }
        });
    }
    getAllData() {
        let pageParam, sortParam, typeParam;

        this.actRouter.queryParams.subscribe(params => {

            pageParam = parseInt(params.page) ? parseInt(params.page) : 1;
            sortParam = params.sort ? params.sort : '';
            typeParam = params.type ? params.type : '';
            this.searchName = params.searchName ? params.searchName : '';
            this.searchCountry = params.searchCountry ? params.searchCountry : '';

            this.sortDirection = typeParam;
            this.stagesStatus = sortParam;

            this.stageService.getShopsCount().subscribe((data) => {

                if (data) {
                    this.noData = false;

                    if (data.status === 401) {
                        this.router.navigate(['/login']);
                    } else {
                        this.stagesCount = data;

                        this.stageService.getSearchShopsCount(sortParam, typeParam, this.searchName,this.searchCountry).subscribe((data) => {
                            if (data) {
                                this.noData = false;

                                if (data.status === 401) {
                                    this.router.navigate(['/login']);
                                } else {
                                    this.searchStagesCount = data;

                                    // reset [items] to empty for deleting items
                                    this.commService.items.length = 0;

                                    if (this.searchName != '' || this.searchName != null || this.searchCountry != '' || this.searchCountry != null) {
                                        this.count = this.searchStagesCount;
                                        this.pagination(this.stagesCount, pageParam, sortParam, typeParam);

                                    } else {
                                        this.count = this.stagesCount;
                                        this.pagination(this.searchStagesCount, pageParam, sortParam, typeParam);

                                    }
                                }
                            }
                            else {
                                this.all_stages = null;
                                this.isDataAvailable = true;
                                this.noData = true;
                            }

                        });

                    }

                } else {

                    this.all_stages = null;
                    this.isDataAvailable = true;
                    this.noData = true;
                }

            });


        });
    }

    getSomeStages(start, aItemsPerPage, sort, type, searchName,searchCountry) {

        this.stageService.getSomeShops(start, aItemsPerPage, sort, type, searchName,searchCountry).subscribe((data) => {
            if (data) {
                // console.log("looooooooooooo",data)
                this.all_stages = data;
            }else{
                this.noData = true;
            }

        });

    }

    goToSearch(searchName,searchCountry) {
        if (searchName != '' || searchCountry !='') {
            this.router.navigate(['/shops/all-shops'], { queryParams: { page: 1, sort: this.stagesStatus, type: this.sortDirection, searchName: searchName ,searchCountry:searchCountry } });
        }
    }

    deleteStageConfirm(value) {

        // console.log(value.deleteMultiple);

        if (value.deleteMultiple === 'delete') {

            if (this.commService.items.length !== 0) {

                if (this.shops_delete === false) {

                    this.alertService.warning({
                        title: this.commService.permissionMsgType,
                        text: this.commService.permissionMsg
                    });

                }
                else {

                    this.alertService.warning({
                        title: 'هل انت متأكد ؟',
                        text: "ستكون غير قادر على إستعادة البيانات المفقودة",
                        showCancelButton: true,
                        confirmButtonText: 'نعم, احذف الآن',
                        cancelButtonText: 'لا, إلغـــاء',
                        reverseButtons: true
                    }).then((result) => {

                        if (result.value) {

                            if (this.commService.items.length !== 0) {

                                this.stageService.deleteShop(this.commService.items).subscribe((data) => {
                                    if (data) {

                                        this.stageService.getShopsCount().subscribe((data) => {
                                            if (data) {

                                                this.alertService.success({
                                                    title: 'حذف المحل',
                                                    text: 'تم حذف المحل بنجاح'
                                                });

                                                this.stagesCount = data;

                                                this.router.navigate(['/shops/all-shops']);
                                                this.pagination(this.stagesCount, 1, '', '');

                                                this.count = this.stagesCount;
                                                $('input[class="check_all"]:checkbox:checked').prop('checked', false);

                                                this.deleteForm.reset();
                                                this.selectedOption = true;

                                            }
                                            else {

                                                this.alertService.success({
                                                    title: 'حذف المحل',
                                                    text: 'تم حذف المحل بنجاح'
                                                });
                                                this.stagesCount = 0;
                                                this.all_stages = null;
                                                this.noData = true;
                                                this.count = 0;
                                                $('input[class="check_all"]:checkbox:checked').prop('checked', false);

                                                this.deleteForm.reset();
                                                this.selectedOption = true;

                                            }

                                        });

                                    } else {
                                        console.log("Oops !! ....");
                                    }

                                });

                            }
                            else {
                                console.log("array empty");
                            }

                        }
                        else if (result.dismiss === 'cancel') {
                            this.alertService.error({
                                title: 'تم الإلغـــاء',
                                text: "بياناتك ما زالت فى أمان"
                            });
                        }
                    })
                        .catch(() => console.log('canceled'));

                }

            }
        }

    }

    getSortType(sort) {

        if (sort === 'name') {
            this.stagesStatus = 'name';
        }
        else if (sort === 'sort') {
            this.stagesStatus = 'sort';
        }
        else {
            alert("sort undefined !!");
            this.stagesStatus = 'id';
        }

        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

        this.router.navigate(['/shops/all-shops'], { queryParams: { page: 1, sort: this.stagesStatus, type: this.sortDirection, searchName: this.searchName,searchCountry:this.searchCountry } });

    }

    goToAddStage() {
        this.router.navigate(['/shops/shop']);
    }

    pagination(aTotal, page, sort, type, aItemsPerPage = 30, aLinksPerPage = 20) {

        let num_pages, first, last, left_offset, from, to, start = 0;

        if (aTotal && aTotal > aItemsPerPage) {

            num_pages = Math.ceil(aTotal / aItemsPerPage);
            this.current_page = parseInt(page);
            this.current_page = (this.current_page < 1) ? 1 : (this.current_page > num_pages ? num_pages : this.current_page);

            left_offset = Math.ceil(aLinksPerPage / 2) - 1;
            first = this.current_page - left_offset;
            first = (first < 1) ? 1 : first;

            last = first + aLinksPerPage - 1;
            last = (last > num_pages) ? num_pages : last;

            first = last - aLinksPerPage + 1;
            first = (first < 1) ? 1 : first;

            this.pagination_pages = this.commService.range(first, last, 1);

            // Previous, First links
            if (this.current_page > 1) {
                this.previous = this.current_page - 1;
            } else {
                this.previous = null;
            }

            // Next, Last links
            if (this.current_page < num_pages) {

                this.next = this.current_page + 1;
            } else {
                this.next = null;
            }

            page = (page < 1) ? 1 : page;
            start = (page - 1) * aItemsPerPage;

            from = (aTotal > 0) ? start + 1 : start;
            to = (aTotal > (start + aItemsPerPage)) ? start + aItemsPerPage : aTotal;

        }

        this.getSomeStages(start, aItemsPerPage, sort, type, this.searchName,this.searchCountry);

        this.resultObj = {
            pages: this.pagination_pages,
            current_page: this.current_page,
            total: aTotal,
            previous: this.previous,
            next: this.next,
            sort: sort,
            type: type,
            from: from,
            to: to,
            aItemsPerPage: aItemsPerPage,
            searchName: this.searchName,
            searchCountry: this.searchCountry
        }

    }


    ngAfterViewInit() {

        Helpers.loadStyles('app-all-shops',
            ['assets/own-style/pagination/style.css']);

        this._script.loadScripts('app-all-shops',
            ['assets/own-style/js/category.js', 'assets/own-style/js/script.js'])

    }


}
