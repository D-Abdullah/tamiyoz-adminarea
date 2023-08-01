import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { CommonService } from '../../../../../_services/common.service';
import { slidersService } from '../sliders.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-all-sliders",
    templateUrl: "./all-sliders.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AllslidersComponent implements OnInit, AfterViewInit {

    categoryForm: FormGroup;
    deleteForm: FormGroup;
    searchName: string = '';

    pagination_pages;
    resultObj = {};
    countriesCount: number;
    searchCountriesCount: number;
    sortDirection;
    countriesStatus: string = '';

    current_page: number;
    previous;
    next;
    all_countries = [];

    count;
    user_id;

    deleteMultiple: string = '';
    selectedOption: boolean = false;

    sliders_view: boolean;
    sliders_delete: boolean;

    loadingImgPath: string = '';
    catImgPath: string = '';
    isDataAvailable: boolean = false;
    noData: boolean = false;

    constructor(public http: HttpClient, public commService: CommonService, public sliderservice: slidersService, private router: Router, private actRouter: ActivatedRoute, private alertService: SweetAlertService, private _script: ScriptLoaderService, private fb: FormBuilder) {

        this.categoryForm = fb.group({
            'searchName': [null],
            'item': [null],
        });

        this.deleteForm = fb.group({
            'deleteMultiple': [null],
        });

        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
        this.catImgPath = this.commService._hostName + 'uploads/sliders/';

    }

    ngOnInit() {

        this.commService.setTitle("كافة الاسلايدرات");

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;

            let roles = ["sliders_view", "sliders_delete"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.sliders_view = res.sliders_view === '1' ? true : false;
                    this.sliders_delete = res.sliders_delete === '1' ? true : false;
                    this.isDataAvailable = true;
                    if (this.sliders_view === true) {
                        this.getAllData();
                    }
                }
            });

        }


    }

    getAllData() {
        let pageParam, sortParam, typeParam;

        this.actRouter.queryParams.subscribe(params => {

            pageParam = parseInt(params.page) ? parseInt(params.page) : 1;
            sortParam = params.sort ? params.sort : '';
            typeParam = params.type ? params.type : '';
            this.searchName = params.searchName ? params.searchName : '';

            this.sortDirection = typeParam;
            this.countriesStatus = sortParam;

            this.sliderservice.getSlidersCount().subscribe((data) => {

                if (data) {
                    this.noData = false;

                    if (data.status === 401) {
                        this.router.navigate(['/login']);
                    } else {
                        this.countriesCount = data;

                        this.sliderservice.getSearchSlidersCount(sortParam, typeParam, this.searchName).subscribe((data) => {
                            if (data) {
                                this.noData = false;

                                if (data.status === 401) {
                                    this.router.navigate(['/login']);
                                } else {
                                    this.searchCountriesCount = data;

                                    // reset [items] to empty for deleting items
                                    this.commService.items.length = 0;

                                    if (this.searchName != '' || this.searchName != null) {
                                        this.count = this.searchCountriesCount;
                                        this.pagination(this.countriesCount, pageParam, sortParam, typeParam);

                                    } else {
                                        this.count = this.countriesCount;
                                        this.pagination(this.searchCountriesCount, pageParam, sortParam, typeParam);

                                    }
                                }
                            }
                            else {
                                this.all_countries = null;
                                this.isDataAvailable = true;
                                this.noData = true;
                            }

                        });

                    }

                } else {

                    this.all_countries = null;
                    this.isDataAvailable = true;
                    this.noData = true;
                }

            });


        });
    }

    getSomeCountries(start, aItemsPerPage, sort, type, searchName) {

        this.sliderservice.getSomeSliders(start, aItemsPerPage, sort, type, searchName).subscribe((data) => {
            if (data) {
                // console.log("looooooooooooo",data)
                this.all_countries = data;
            }else{
                this.noData = true;
            }

        });

    }

    goToSearch(searchName) {
        if (searchName != '') {
            this.router.navigate(['/sliders/all-sliders'], { queryParams: { page: 1, sort: this.countriesStatus, type: this.sortDirection, searchName: searchName } });
        }
    }

    deleteCountryConfirm(value) {

        // console.log(value.deleteMultiple);

        if (value.deleteMultiple === 'delete') {

            if (this.commService.items.length !== 0) {

                if (this.sliders_delete === false) {

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

                                this.sliderservice.deleteSlider(this.commService.items).subscribe((data) => {
                                    if (data) {

                                        this.sliderservice.getSlidersCount().subscribe((data) => {
                                            if (data) {

                                                this.alertService.success({
                                                    title: 'حذف السلايد',
                                                    text: 'تم حذف السلايد بنجاح'
                                                });

                                                this.countriesCount = data;

                                                this.router.navigate(['/sliders/all-sliders']);
                                                this.pagination(this.countriesCount, 1, '', '');

                                                this.count = this.countriesCount;
                                                $('input[class="check_all"]:checkbox:checked').prop('checked', false);

                                                this.deleteForm.reset();
                                                this.selectedOption = true;

                                            }
                                            else {

                                                this.alertService.success({
                                                    title: 'حذف السلايد',
                                                    text: 'تم حذف السلايد بنجاح'
                                                });
                                                this.countriesCount = 0;
                                                this.all_countries = null;
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
            this.countriesStatus = 'name';
        }
        else if (sort === 'sort') {
            this.countriesStatus = 'sort';
        }
        else {
            alert("sort undefined !!");
            this.countriesStatus = 'id';
        }

        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

        this.router.navigate(['/sliders/all-sliders'], { queryParams: { page: 1, sort: this.countriesStatus, type: this.sortDirection, searchName: this.searchName } });

    }

    goToAddCountry() {
        this.router.navigate(['/sliders/slider']);
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

        this.getSomeCountries(start, aItemsPerPage, sort, type, this.searchName);

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
            searchName: this.searchName
        }

    }


    ngAfterViewInit() {

        Helpers.loadStyles('app-all-sliders',
            ['assets/own-style/pagination/style.css']);

        this._script.loadScripts('app-all-sliders',
            ['assets/own-style/js/category.js', 'assets/own-style/js/script.js'])

    }


}
