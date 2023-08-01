import { Component, OnInit, ViewEncapsulation, AfterViewInit , ViewChild, ElementRef} from '@angular/core';
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
    selector: "app-all-members",
    templateUrl: "./all-members.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AllMembersComponent implements OnInit, AfterViewInit {

    @ViewChild('btnClose', {static: false}) btnClose: ElementRef;
    @ViewChild('dateFrom', {static: false}) dateFrom: any;
    @ViewChild('dateTo', {static: false}) dateTo: any;
    memberForm: FormGroup;
    deleteForm: FormGroup;
    searchName: string = '';
    searchUserPhone: string = '';
 
    searchDateFrom: string = '';
    searchDateTo: string = '';
    searchUserStatus: string = '';
    searchUserType: string = '';

    members;
    resultObj = {};
    memberCount: number;
    searchMemberCount: number;
    sortDirection;
    memberStatus: string = '';

    current_page: number;
    previous;
    next;
    pages = [];

    count;
    user_id;
    loade:boolean =true;

    deleteMultiple: string = '';
    selectedOption: boolean = false;

    members_view: boolean;
    members_delete: boolean;
    isDataAvailable: boolean = false;
    loadingImgPath: string = '';
    userImgPath:string ='';
    defaultImg:string ='';

    constructor(public http: HttpClient, public commService: CommonService, public memberService: UserService, private router: Router, private actRouter: ActivatedRoute, private alertService: SweetAlertService, private _script: ScriptLoaderService, private fb: FormBuilder) {

        this.memberForm = fb.group({
            'searchName': [null],
            'searchUserPhone': [null],
            'searchDateFrom': [null],
            'searchDateTo': [null],
            'searchUserStatus': [null],
            'searchUserType': [null],
            'item': [null],
        });
        

        this.deleteForm = fb.group({
            'deleteMultiple': [null],
        });

        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
        this.userImgPath = this.commService._hostName + 'uploads/users/';
        this.defaultImg = this.commService._hostName + 'uploads/no_image.jpg';
    }

    ngOnInit() {

        this.commService.setTitle("كافة الأعضاء");

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;

            let roles = ["members_view", "members_delete"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.members_view = res.members_view === '1' ? true : false;
                    this.members_delete = res.members_delete === '1' ? true : false;
                    this.isDataAvailable = true;
                    if (this.members_view === true) {
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
            this.searchUserPhone = params.searchUserPhone ? params.searchUserPhone : '';
            this.searchDateFrom = params.searchDateFrom ? params.searchDateFrom : '';
            this.searchDateTo = params.searchDateTo ? params.searchDateTo : '';
            this.searchUserStatus = params.searchUserStatus ? params.searchUserStatus : '';
            this.searchUserType = params.searchUserType ? params.searchUserType : '';


            this.sortDirection = typeParam;
            this.memberStatus = sortParam;

            this.memberService.getUsersCount('members').subscribe((data) => {
                if (data) {

                    if (data.status === 401) {
                        this.router.navigate(['/login']);
                    } else {
                        this.memberCount = data;

                        this.memberService.getSearchUsersCount('members', sortParam, typeParam, this.searchName,this.searchUserPhone, this.searchDateFrom,  this.searchDateTo,this.searchUserStatus,  this.searchUserType).subscribe((data) => {
                            if (data) {
                                if (data.status === 401) {
                                    this.router.navigate(['/login']);
                                } else {
                                    this.searchMemberCount = data;

                                    // reset [items] to empty for deleting items
                                    this.commService.items.length = 0;
                                    
                                    if (this.searchName != '' || this.searchName != null || this.searchUserPhone != '' || this.searchUserPhone != null ||this.searchDateFrom != '' || this.searchDateFrom != null||this.searchUserStatus != '' || this.searchUserStatus != null||this.searchUserType != '' || this.searchUserType != null) {
                                        this.count = this.searchMemberCount;
                                        this.pagination(this.count, pageParam, sortParam, typeParam);
                                    } else {
                                        this.count = this.memberCount;
                                        this.pagination(this.count, pageParam, sortParam, typeParam);
                                    }
                                }
                            }
                            else {
                                this.members = null;
                            }

                        });

                    }

                } else {
                    this.members = null;
                }

            });


        });
    }

    getSomeUsers(start, aItemsPerPage, sort, type, searchName,  searchUserPhone, searchDateFrom, searchDateTo,searchUserStatus,searchUserType) {
        this.members=[];
        this.loade=true;
     
        this.memberService.getSomeUsers('members', start, aItemsPerPage, sort, type, searchName,  searchUserPhone, searchDateFrom, searchDateTo,searchUserStatus,searchUserType).subscribe((data) => {
            this.loade=false;
           
            if (data) {
                //   console.log("members data",data);
                this.members = data;
            }
            else{
               
                this.members=[];
            }

        });

    } 

    goToSearch(searchName) {
        if (searchName != '' || this.searchUserPhone !='' || this.searchDateFrom !='' || this.searchDateTo !=''|| this.searchUserStatus !='' || this.searchUserType !='') {
            this.router.navigate(['/members/all-members'], { queryParams: { page: 1, sort: this.memberStatus, type: this.sortDirection, searchName: searchName, searchUserPhone: this.searchUserPhone, searchDateFrom: this.searchDateFrom, searchDateTo: this.searchDateTo, searchUserStatus: this.searchUserStatus, searchUserType: this.searchUserType } });
        }
    }

    deleteMemberConfirm(value) {

        

        if (value.deleteMultiple === 'delete') {

            if (this.commService.items.length !== 0) {

                if (this.members_delete === false) {
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

                                this.memberService.deleteUser('members', this.commService.items).subscribe((data) => {
                                    if (data) {

                                        this.memberService.getUsersCount('members').subscribe((data) => {
                                            if (data) {

                                                this.alertService.success({
                                                    title: 'حذف العضو',
                                                    text: 'تم حذف العضو بنجاح'
                                                });

                                                this.memberCount = data;

                                                this.router.navigate(['/members/all-members']);
                                                this.pagination(this.memberCount, 1, '', '');

                                                this.count = this.memberCount;
                                                $('input[class="check_all"]:checkbox:checked').prop('checked', false);

                                                this.deleteForm.reset();
                                                this.selectedOption = true;

                                            }
                                            else {

                                                this.alertService.success({
                                                    title: 'حذف العضو',
                                                    text: 'تم حذف العضو بنجاح'
                                                });

                                                this.members = null;
                                                this.memberCount = 0;

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
        else if( value.deleteMultiple === 'sendnotification'){
            if (this.commService.items.length !== 0 ) {
              var iddds=this.commService.items.toString();
                if(iddds != ''){

                    this.router.navigate(['/notifications/add-notification'], { queryParams: { ids: iddds } });
                }
            }
        }


    }
   

    getSortType(sort) {

        if (sort === 'full_name') {
            this.memberStatus = 'full_name';
        }
        else {
            alert("sort undefined !!");
            this.memberStatus = 'id';
        }

        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

        this.router.navigate(['/members/all-members'], { queryParams: { page: 1, sort: this.memberStatus, type: this.sortDirection, searchName: this.searchName, searchUserPhone: this.searchUserPhone, searchDateFrom: this.searchDateFrom, searchDateTo: this.searchDateTo, searchUserStatus: this.searchUserStatus, searchUserType: this.searchUserType  } });

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

        this.getSomeUsers(start, aItemsPerPage, sort, type, this.searchName,this.searchUserPhone, this.searchDateFrom,  this.searchDateTo,this.searchUserStatus,  this.searchUserType );

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
            searchName: this.searchName,
            searchUserPhone: this.searchUserPhone,
            searchDateFrom: this.searchDateFrom,
            searchDateTo: this.searchDateTo,
            searchUserStatus: this.searchUserStatus,
            searchUserType: this.searchUserType



        }

    }


    ngAfterViewInit() {

        Helpers.loadStyles('app-all-members',
            ['assets/own-style/pagination/style.css']);

        this._script.loadScripts('app-all-members',
            ['assets/own-style/js/category.js', 'assets/own-style/js/script.js'])

    }


}