import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { UserService } from '../../../../../_services/user.service';
import { CommonService } from '../../../../../_services/common.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NgForm, FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-all-admins",
    templateUrl: "./all-admins.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AllAdminsComponent implements OnInit, AfterViewInit {

    adminForm: FormGroup;
    deleteForm: FormGroup;
    searchName: string = '';

    admins;
    resultObj = {};
    adminCount: number;
    searchAdminCount: number;
    sortDirection;
    adminStatus: string = '';

    current_page: number;
    previous;
    next;
    pages = [];

    count;
    user_id;

    deleteMultiple: string = '';
    selectedOption: boolean = false;

    admins_view: boolean;
    admins_delete: boolean;
    isDataAvailable: boolean = false;
    loadingImgPath: string = '';

    constructor(public http: HttpClient, public commService: CommonService, public adminService: UserService, private router: Router, private actRouter: ActivatedRoute, private alertService: SweetAlertService, private _script: ScriptLoaderService, private fb: FormBuilder) {

        this.adminForm = fb.group({
            'searchName': [null],
            'item': [null],
        });

        this.deleteForm = fb.group({
            'deleteMultiple': [null],
        });

        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';

    }

    ngOnInit() {

        this.commService.setTitle("الإدارة");

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;

            let roles = ["admins_view", "admins_delete"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.admins_view = res.admins_view === '1' ? true : false;
                    this.admins_delete = res.admins_delete === '1' ? true : false;
                    this.isDataAvailable = true;
                    if (this.admins_view === true) {
                        this.getAllData();
                    }
                }
            });

        }

    }

    getAllData() {
        let pageParam, sortParam, typeParam, searchName;

        this.actRouter.queryParams.subscribe(params => {

            pageParam = parseInt(params.page) ? parseInt(params.page) : 1;
            sortParam = params.sort ? params.sort : '';
            typeParam = params.type ? params.type : '';
            this.searchName = params.searchName ? params.searchName : '';

            this.sortDirection = typeParam;
            this.adminStatus = sortParam;

            this.adminService.getUsersCount('admins').subscribe((data) => {
                if (data) {

                    if (data.status === 401) {
                        this.router.navigate(['/login']);
                    } else {
                        this.adminCount = data;

                        this.adminService.getSearchUsersCount('admins', sortParam, typeParam, this.searchName,'','','','','').subscribe((data) => {
                            if (data) {
                                if (data.status === 401) {
                                    this.router.navigate(['/login']);
                                } else {
                                    this.searchAdminCount = data;

                                    // reset [items] to empty for deleting items
                                    this.commService.items.length = 0;

                                    if (this.searchName != '' || this.searchName != null) {
                                        this.count = this.searchAdminCount;
                                        this.pagination(this.adminCount, pageParam, sortParam, typeParam);
                                    } else {
                                        this.count = this.adminCount;
                                        this.pagination(this.searchAdminCount, pageParam, sortParam, typeParam);
                                    }
                                }
                            }
                            else {
                                this.admins = null;
                            }

                        });

                    }

                } else {
                    this.admins = null;
                }

            });


        });

    }

    getSomeUsers(start, aItemsPerPage, sort, type, searchName) {

        this.adminService.getSomeUsers('admins', start, aItemsPerPage, sort, type, searchName,'','','','','').subscribe((data) => {
            if (data) {
                this.admins = data;
            }

        });

    }

    goToSearch(searchName) {
        if (searchName != '') {
            this.router.navigate(['/management/all-admins'], { queryParams: { page: 1, sort: this.adminStatus, type: this.sortDirection, searchName: searchName } });
        }
    }

    deleteAdminConfirm(value) {

        // console.log(value.deleteMultiple);

        if (value.deleteMultiple === 'delete') {

            if (this.commService.items.length !== 0) {

                if (this.admins_delete === false) {
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

                                this.adminService.deleteUser('admins', this.commService.items).subscribe((data) => {
                                    if (data) {

                                        this.adminService.getUsersCount('admins').subscribe((data) => {
                                            if (data) {

                                                this.alertService.success({
                                                    title: 'حذف الإدارة',
                                                    text: 'تم حذف الإدارة بنجاح'
                                                });

                                                this.adminCount = data;

                                                this.router.navigate(['/management/all-admins']);
                                                this.pagination(this.adminCount, 1, '', '');

                                                this.count = this.adminCount;
                                                $('input[class="check_all"]:checkbox:checked').prop('checked', false);

                                                this.deleteForm.reset();
                                                this.selectedOption = true;

                                            }
                                            else {

                                                this.alertService.success({
                                                    title: 'حذف الإدارة',
                                                    text: 'تم حذف الإدارة بنجاح'
                                                });

                                                this.adminCount = 0;
                                                this.admins = null;

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

        if (sort === 'full_name') {
            this.adminStatus = 'full_name';
        }
        else {
            alert("sort undefined !!");
            this.adminStatus = 'id';
        }

        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

        this.router.navigate(['/management/all-admins'], { queryParams: { page: 1, sort: this.adminStatus, type: this.sortDirection, searchName: this.searchName } });

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

            this.pages = this.commService.range(first, last, 1);

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

        this.getSomeUsers(start, aItemsPerPage, sort, type, this.searchName);

        this.resultObj = {
            pages: this.pages,
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

        Helpers.loadStyles('app-all-admins',
            ['assets/own-style/pagination/style.css']);

        this._script.loadScripts('app-all-admins',
            ['assets/own-style/js/category.js', 'assets/own-style/js/script.js'])

    }


}