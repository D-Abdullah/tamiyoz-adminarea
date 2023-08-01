import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { CommonService } from '../../../../../_services/common.service';
import { LevelsService } from '../levels.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NgForm, FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-all-levels",
    templateUrl: "./all-levels.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AllLevelsComponent implements OnInit, AfterViewInit {

    levelForm: FormGroup;
    deleteForm: FormGroup;
    searchName: string = '';

    pagination_pages;
    resultObj = {};
    levelsCount: number;
    searchLevelsCount: number;
    sortDirection;
    levelStatus: string = '';

    current_page: number;
    previous;
    next;
    all_levels = [];

    count;
    user_id;

    deleteMultiple: string = '';
    selectedOption: boolean = false;

    levels_view: boolean;
    levels_delete: boolean;
    isDataAvailable: boolean = false;
    loadingImgPath: string = '';

    constructor(public http: HttpClient, public commService: CommonService, public levelService: LevelsService, private router: Router, private actRouter: ActivatedRoute, private alertService: SweetAlertService, private _script: ScriptLoaderService, private fb: FormBuilder) {

        this.levelForm = fb.group({
            'searchName': [null],
            'item': [null],
        });

        this.deleteForm = fb.group({
            'deleteMultiple': [null],
        });

        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';

    }

    ngOnInit() {

        this.commService.setTitle("كافة المستويات");

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;

            let roles = ["levels_view", "levels_delete"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.levels_view = res.levels_view === '1' ? true : false;
                    this.levels_delete = res.levels_delete === '1' ? true : false;
                    this.isDataAvailable = true;
                    if (this.levels_view === true) {
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
            console.log(this.searchName);

            this.sortDirection = typeParam;
            this.levelStatus = sortParam;

            this.levelService.getLevelsCount().subscribe((data) => {
                if (data) {

                    if (data.status === 401) {
                        this.router.navigate(['/login']);
                    } else {
                        this.levelsCount = data;

                        this.levelService.getSearchLevelsCount(sortParam, typeParam, this.searchName, 'admin').subscribe((data) => {
                            if (data) {
                                if (data.status === 401) {
                                    this.router.navigate(['/login']);
                                } else {
                                    this.searchLevelsCount = data;

                                    // reset [items] to empty for deleting items
                                    this.commService.items.length = 0;

                                    if (this.searchName != '' || this.searchName != null) {
                                        this.count = this.searchLevelsCount;
                                        this.pagination(this.levelsCount, pageParam, sortParam, typeParam);

                                    } else {
                                        this.count = this.levelsCount;
                                        this.pagination(this.searchLevelsCount, pageParam, sortParam, typeParam);

                                    }
                                }
                            }
                            else {
                                this.all_levels = null;
                            }

                        });

                    }

                } else {
                    this.all_levels = null;
                }

            });

        });
    }

    getSomeLevels(start, aItemsPerPage, sort, type, searchName) {

        this.levelService.getSomeLevels(start, aItemsPerPage, sort, type, searchName, 'admin').subscribe((data) => {
            if (data) {
                this.all_levels = data;
            }

        });

    }

    goToSearch(searchName) {
        if (searchName != '') {
            this.router.navigate(['/levels/all-levels'], { queryParams: { page: 1, sort: this.levelStatus, type: this.sortDirection, searchName: searchName } });
        }
    }

    deleteLevelConfirm(value) {

        // console.log(value.deleteMultiple);

        if (value.deleteMultiple === 'delete') {

            if (this.commService.items.length !== 0) {

                if (this.levels_delete === false) {
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

                                this.levelService.deleteLevel(this.commService.items).subscribe((data) => {
                                    if (data) {

                                        this.levelService.getLevelsCount().subscribe((data) => {
                                            if (data) {

                                                this.alertService.success({
                                                    title: 'حذف المستوى',
                                                    text: 'تم حذف المستوى بنجاح'
                                                });

                                                this.levelsCount = data;

                                                this.router.navigate(['/levels/all-levels']);
                                                this.pagination(this.levelsCount, 1, '', '');

                                                this.count = this.levelsCount;
                                                $('input[class="check_all"]:checkbox:checked').prop('checked', false);

                                                this.deleteForm.reset();
                                                this.selectedOption = true;

                                            }
                                            else {

                                                this.alertService.success({
                                                    title: 'حذف المستوى',
                                                    text: 'تم حذف المستوى بنجاح'
                                                });

                                                this.levelsCount = 0;
                                                this.all_levels = null;

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

        if (sort === 'level_name') {
            this.levelStatus = 'level_name';
        }
        else {
            this.levelStatus = 'id';
            alert("sort undefined !!");
        }

        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

        this.router.navigate(['/levels/all-levels'], { queryParams: { page: 1, sort: this.levelStatus, type: this.sortDirection, searchName: this.searchName } });

    }

    goToAddLevel() {
        this.router.navigate(['/levels/level']);
    }

    pagination(aTotal, page, sort, type, aItemsPerPage = 5, aLinksPerPage = 20) {

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

        this.getSomeLevels(start, aItemsPerPage, sort, type, this.searchName);

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

        Helpers.loadStyles('app-all-levels',
            ['assets/own-style/pagination/style.css']);

        this._script.loadScripts('app-all-levels',
            ['assets/own-style/js/category.js', 'assets/own-style/js/script.js'])

    }


}