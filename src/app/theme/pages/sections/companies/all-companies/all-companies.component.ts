import { CompanyService } from './../companies.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { CommonService } from '../../../../../_services/common.service';
// import { ProjectService } from '../marketing.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-all-companies",
    templateUrl: "./all-companies.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AllCompaniesComponent implements OnInit, AfterViewInit {

    serviceForm: FormGroup;
    deleteForm: FormGroup;
    searchName: string = '';
    pagename='companies';
    pagination_pages;
    resultObj = {};
    servicesCount: number;
    searchservicesCount: number;
    sortDirection;
    servicesStatus: string = '';

    current_page: number;
    previous;
    next;
    all_services = [];

    count;
    user_id;

    deleteMultiple: string = '';
    selectedOption: boolean = false;

    companies_view: boolean;
    companies_delete: boolean;

    loadingImgPath: string = '';
    catImgPath: string = '';
    isDataAvailable: boolean = false;
    noData: boolean = false;

    constructor(public http: HttpClient, public commService: CommonService, public serService: CompanyService, private router: Router, private actRouter: ActivatedRoute, private alertService: SweetAlertService, private _script: ScriptLoaderService, private fb: FormBuilder) {

        this.serviceForm = fb.group({
            'searchName': [null],
            'item': [null],
        });

        this.deleteForm = fb.group({
            'deleteMultiple': [null],
        });

        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
        this.catImgPath = this.commService._hostName + 'uploads/projects/';

    }

    ngOnInit() {

        this.commService.setTitle("كافة الشركات");

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;

            let roles = ["companies_view", "companies_delete"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.companies_view = res.companies_view === '1' ? true : false;
                    this.companies_delete = res.companies_delete === '1' ? true : false;
                    this.isDataAvailable = true;
                    if (this.companies_view === true) {
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
            this.servicesStatus = sortParam;

            this.serService.getProjectsCount(this.pagename).subscribe((data) => {

                if (data) {
                    this.noData = false;

                    if (data.status === 401) {
                        this.router.navigate(['/login']);
                    } else {
                        this.servicesCount = data;

                        this.serService.getSearchProjectsCount(sortParam, typeParam, this.searchName,this.pagename).subscribe((data) => {
                            if (data) {
                                this.noData = false;

                                if (data.status === 401) {
                                    this.router.navigate(['/login']);
                                } else {
                                    this.searchservicesCount = data;

                                    // reset [items] to empty for deleting items
                                    this.commService.items.length = 0;

                                    if (this.searchName != '' || this.searchName != null) {
                                        this.count = this.searchservicesCount;
                                        this.pagination(this.servicesCount, pageParam, sortParam, typeParam);

                                    } else {
                                        this.count = this.servicesCount;
                                        this.pagination(this.searchservicesCount, pageParam, sortParam, typeParam);

                                    }
                                }
                            }
                            else {
                                this.all_services = null;
                                this.isDataAvailable = true;
                                this.noData = true;
                            }

                        });

                    }

                } else {

                    this.all_services = null;
                    this.isDataAvailable = true;
                    this.noData = true;
                }

            });


        });
    }

    getSomeServices(start, aItemsPerPage, sort, type, searchName,pagename) {

        this.serService.getSomeProjects(start, aItemsPerPage, sort, type, searchName,pagename).subscribe((data) => {
            if (data) {
                // console.log("looooooooooooo",data)
                this.all_services = data;
            }else{
                this.noData = true;
            }

        });

    }

    goToSearch(searchName) {
        if (searchName != '') {
            this.router.navigate(['/marketing/all-companies'], { queryParams: { page: 1, sort: this.servicesStatus, type: this.sortDirection, searchName: searchName } });
        }
    }

    deleteserviceConfirm(value) {

        // console.log(value.deleteMultiple);

        if (value.deleteMultiple === 'delete') {

            if (this.commService.items.length !== 0) {

                if (this.companies_delete === false) {

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

                                this.serService.deleteProject(this.commService.items).subscribe((data) => {
                                    if (data) {

                                        this.serService.getProjectsCount(this.pagename).subscribe((data) => {
                                            if (data) {

                                                this.alertService.success({
                                                    title: 'حذف الشركه',
                                                    text: 'تم حذف الشركه بنجاح'
                                                });

                                                this.servicesCount = data;

                                                this.router.navigate(['/marketing/all-companies']);
                                                this.pagination(this.servicesCount, 1, '', '');

                                                this.count = this.servicesCount;
                                                $('input[class="check_all"]:checkbox:checked').prop('checked', false);

                                                this.deleteForm.reset();
                                                this.selectedOption = true;

                                            }
                                            else {

                                                this.alertService.success({
                                                    title: 'حذف الشركه',
                                                    text: 'تم حذف الشركه بنجاح'
                                                });
                                                this.servicesCount = 0;
                                                this.all_services = null;
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
            this.servicesStatus = 'name';
        }
        else if (sort === 'sort') {
            this.servicesStatus = 'sort';
        }
        else {
            alert("sort undefined !!");
            this.servicesStatus = 'id';
        }

        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

        this.router.navigate(['/marketing/all-companies'], { queryParams: { page: 1, sort: this.servicesStatus, type: this.sortDirection, searchName: this.searchName } });

    }

    goToAddservice() {
        this.router.navigate(['/marketing/company']);
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

        this.getSomeServices(start, aItemsPerPage, sort, type, this.searchName,this.pagename);

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

        Helpers.loadStyles('app-all-companies',
            ['assets/own-style/pagination/style.css']);

        this._script.loadScripts('app-all-companies',
            ['assets/own-style/js/category.js', 'assets/own-style/js/script.js'])

    }


}
