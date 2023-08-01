import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { CommonService } from '../../../../../_services/common.service';
import { RanteService } from '../rentes.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder } from '@angular/forms';

declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-all-rentes",
    templateUrl: "./all-rentes.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AllRentesComponent implements OnInit, AfterViewInit {

    serviceForm: FormGroup;
    deleteForm: FormGroup;
    searchNumber: string = '';
    searchStation:string='';
    searchShop:string='';
    pagination_pages;
    resultObj = {};
    servicesCount: number;
    searchservicesCount: number;
    sortDirection;
    servicesStatus: string = '';
    all_countries: any[] = [];
    all_shops: any[] = [];
    current_page: number;
    previous;
    next;
    all_services = [];

    count;
    user_id;

    deleteMultiple: string = '';
    selectedOption: boolean = false;

    rentes_view: boolean;
    rentes_delete: boolean;

    loadingImgPath: string = '';
    catImgPath: string = '';
    isDataAvailable: boolean = false;
    noData: boolean = false;

    constructor(public http: HttpClient, public commService: CommonService, public serService: RanteService, private router: Router, private actRouter: ActivatedRoute, private alertService: SweetAlertService, private _script: ScriptLoaderService, private fb: FormBuilder) {

        this.serviceForm = fb.group({
            'searchNumber': [null],
            'searchStation': [null],
            'searchShop': [null],
            'item': [null],
        });

        this.deleteForm = fb.group({
            'deleteMultiple': [null],
        });

        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
        this.catImgPath = this.commService._hostName + 'uploads/rentes/';

    }


    getAllCountries() {
      this.serService.getAllStations().subscribe((data) => {
          if (data) {
              // console.log("all_countries", data)
              this.all_countries = data;
          } else {
              this.all_countries = [];
          }
      });
  }


  getAllShops() {
    this.serService.getAllShops().subscribe((data) => {
        if (data) {
            // console.log("all_countries", data)
            this.all_shops = data;
        } else {
            this.all_shops = [];
        }
    });
}




    ngOnInit() {

        this.commService.setTitle("كافة طلبات الحجز");

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;
            this.getAllCountries();
            this.getAllShops();
            let roles = ["rentes_view", "rentes_delete"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.rentes_view = res.rentes_view === '1' ? true : false;
                    this.rentes_delete = res.rentes_delete === '1' ? true : false;
                    this.isDataAvailable = true;
                    if (this.rentes_view === true) {
                        this.getAllData();
                    }
                }
            });

        }


    }




  download(url) {
// console.log(url);

    window.open(url, '_blank');

  }






    getAllData() {
        let pageParam, sortParam, typeParam;

        this.actRouter.queryParams.subscribe(params => {

            pageParam = parseInt(params.page) ? parseInt(params.page) : 1;
            sortParam = params.sort ? params.sort : '';
            typeParam = params.type ? params.type : '';
            this.searchNumber = params.searchNumber ? params.searchNumber : '';
            this.searchStation = params.searchStation ? params.searchStation : '';
            this.searchShop = params.searchShop ? params.searchShop : '';
            this.sortDirection = typeParam;
            this.servicesStatus = sortParam;

            this.serService.getRentesCount().subscribe((data) => {

                if (data) {
                    this.noData = false;

                    if (data.status === 401) {
                        this.router.navigate(['/login']);
                    } else {
                        this.servicesCount = data;

                        this.serService.getSearchRentesCount(sortParam, typeParam, this.searchNumber,this.searchStation,this.searchShop).subscribe((data) => {
                            if (data) {
                                this.noData = false;

                                if (data.status === 401) {
                                    this.router.navigate(['/login']);
                                } else {
                                    this.searchservicesCount = data;

                                    // reset [items] to empty for deleting items
                                    this.commService.items.length = 0;

                                    if (this.searchNumber != '' || this.searchNumber != null || this.searchStation != '' || this.searchStation != null||this.searchShop != '' || this.searchShop != null) {
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

    getSomeServices(start, aItemsPerPage, sort, type, searchNumber,searchStation,searchShop) {

        this.serService.getSomeRentes(start, aItemsPerPage, sort, type, searchNumber,searchStation,searchShop).subscribe((data) => {
            if (data) {
                console.log("looooooooooooo",data)
                this.all_services = data;


              // if (data.rent_file != null) {
              //   this.recivedfile = this.commService._hostName + 'uploads/RentesPDF/' + data.rent_file;
              //   this.downloadFileFlage = true;
              // } else {
              //   this.downloadFileFlage = false;
              // }







            }else{
                this.noData = true;
            }

        });

    }

    goToSearch(searchNumber,searchStation,searchShop) {
        if (searchNumber != ''||searchStation != ''||searchShop != '') {
            this.router.navigate(['/rentes/all-rentes'], { queryParams: { page: 1, sort: this.servicesStatus, type: this.sortDirection, searchNumber: searchNumber,searchStation: searchStation ,searchShop: searchShop  } });
        }
    }

    deleteserviceConfirm(value) {

        // console.log(value.deleteMultiple);

        if (value.deleteMultiple === 'delete') {

            if (this.commService.items.length !== 0) {

                if (this.rentes_delete === false) {

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

                                this.serService.deleteRente(this.commService.items).subscribe((data) => {
                                    if (data) {

                                        this.serService.getRentesCount().subscribe((data) => {
                                            if (data) {

                                                this.alertService.success({
                                                    title: 'حذف الطلب',
                                                    text: 'تم حذف الطلب بنجاح'
                                                });

                                                this.servicesCount = data;

                                                this.router.navigate(['/rentes/all-rentes']);
                                                this.pagination(this.servicesCount, 1, '', '');

                                                this.count = this.servicesCount;
                                                $('input[class="check_all"]:checkbox:checked').prop('checked', false);

                                                this.deleteForm.reset();
                                                this.selectedOption = true;

                                            }
                                            else {

                                                this.alertService.success({
                                                    title: 'حذف الطلب',
                                                    text: 'تم حذف الطلب بنجاح'
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

        this.router.navigate(['/rentes/all-rentes'], { queryParams: { page: 1, sort: this.servicesStatus, type: this.sortDirection, searchNumber: this.searchNumber,searchStation: this.searchStation,searchShop: this.searchShop } });

    }

    goToAddservice() {
        this.router.navigate(['/rentes/rente']);
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

        this.getSomeServices(start, aItemsPerPage, sort, type, this.searchNumber,this.searchStation,this.searchShop);

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
            searchNumber: this.searchNumber,
            searchStation: this.searchStation,
            searchShop: this.searchShop
        }

    }


    ngAfterViewInit() {

        Helpers.loadStyles('app-all-rentes',
            ['assets/own-style/pagination/style.css']);

        this._script.loadScripts('app-all-rentes',
            ['assets/own-style/js/category.js', 'assets/own-style/js/script.js'])

    }


}
