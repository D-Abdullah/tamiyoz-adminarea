import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { CommonService } from '../../../../../_services/common.service';
import { StationService } from '../stations.service';

import { SweetAlertService } from 'angular-sweetalert-service';

import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
// import domtoimage from 'dom-to-image';
declare var domtoimage: any;
declare var jsPDF: any;
// declare var autotable: any;
declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-all-stations",
    templateUrl: "./all-stations.component.html",
})
export class AllstationsComponent implements OnInit, AfterViewInit {
  shopStatus: string = '' ;
    serviceForm: FormGroup;
    deleteForm: FormGroup;
    searchName: string = '';
  loaderFlage=true;
    pagination_pages;
    resultObj = {};
    servicesCount: number;
    searchservicesCount: number;
    sortDirection;
    servicesStatus: string = '';
     pageName='stations';
    current_page: number;
    previous;
    next;
    all_services = [];
    projects=[];
    count;
    user_id;
  newitems=[];
    deleteMultiple: string = '';
    selectedOption: boolean = false;

    stations_view: boolean;
    stations_delete: boolean;

    loadingImgPath: string = '';
    catImgPath: string = '';
    isDataAvailable: boolean = false;
    noData: boolean = false;
    // head = [[ 'name', 'DESIGNATION', 'DEPARTMENT']];
    constructor(public http: HttpClient, public commService: CommonService,public sanitizer: DomSanitizer, public serService: StationService, private router: Router, private actRouter: ActivatedRoute, private alertService: SweetAlertService, private _script: ScriptLoaderService, private fb: FormBuilder) {

        this.serviceForm = fb.group({
          'searchName': [null],
            'shopStatus': [null],

            'item': [null],
        });

        this.deleteForm = fb.group({
            'deleteMultiple': [null],
        });

        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
        this.catImgPath = this.commService._hostName + 'uploads/projects/';

    }



  openModal(exampleModal){
    // console.log(this.commService.projects);
    if (this.newitems.length > 0) {
      this.serService.getStationByIDSAndStatus(this.newitems, this.shopStatus).subscribe((res: any) => {

        this.loaderFlage = false;
      this.projects=res;

      });



      // this.projects = this.commService.projects;
      // console.log(this.commService.items);

    //   //  this.all_services.filter();
    //   for (let i = 0; i < this.all_services.length; i++) {
    //     for (let j = 0; j < this.commService.items.length; j++) {
    //       if (this.all_services[i].id == this.commService.items[j]) {
    //           this.projects.push(this.all_services[i]);
    //       }
    //     }
    //   }
    }else{

      this.loaderFlage = false;
      this.projects=[];
    }


  }








  toggleCheckboxAddProject(event, id, shopStatus) {

    if (event.target.checked) {
      this.newitems.push(id);

    }
    else {
      $('input[class="check_all"]:checkbox:checked').prop('checked', false);
      var index = this.newitems.indexOf(id);
      // this.projects=[];
      if (index > -1) {
        this.newitems.splice(index, 1);
      }
    }




  }












  check_all($event){
    this.commService.check_all($event);
    if ($event.target.checked) {
      this.newitems = this.commService.items;
      this.openModal('saas');
    }else{
      this.newitems = [];
      this.openModal('saas');

    }









  }


    createPdf(){


  // jQuery('#downloadPDF').click(function(){
    Promise.all([
        domtoimage.toPng(document.getElementById('table1') as HTMLElement),
        // domtoimage.toPng(document.getElementById('div2') as HTMLElement)
        // domtoimage.crossOrigin = "anonymous"
      ])
      .then(function([blob1]) {
        var pdf = new jsPDF('p', 'pt', [$('#table1').width()*2, $('#table1').height()*2]);
          //  console.log(blob1);

        pdf.addImage(blob1, 'PNG', 0, 0, $('#table1').width() *2, $('#table1').height() *2);
        // pdf.addPage();
        // pdf.addImage(blob2, 'PNG', 0, 0, jQuery('#div2').width(), jQuery('#div2').height());
        pdf.save("stations.pdf");

        // that.options.api.optionsChanged();
      });
  // });



    }



    ngOnInit() {

        this.commService.setTitle("كافة المشاريع");

        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;

            let roles = ["stations_view", "stations_delete"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.stations_view = res.stations_view === '1' ? true : false;
                    this.stations_delete = res.stations_delete === '1' ? true : false;
                    this.isDataAvailable = true;
                    if (this.stations_view === true) {
                        this.getAllData();
                    }
                }
            });

        }


    }

    transform(url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }


    getAllData() {
        let pageParam, sortParam, typeParam;

        this.actRouter.queryParams.subscribe(params => {

            pageParam = parseInt(params.page) ? parseInt(params.page) : 1;
            sortParam = params.sort ? params.sort : '';
            typeParam = params.type ? params.type : '';
            this.searchName = params.searchName ? params.searchName : '';
          this.shopStatus = params.shopStatus ? params.shopStatus : '';

            this.sortDirection = typeParam;
            this.servicesStatus = sortParam;

          this.serService.getStationsCount(this.pageName, this.shopStatus).subscribe((data) => {

                if (data) {
                    this.noData = false;

                    if (data.status === 401) {
                        this.router.navigate(['/login']);
                    } else {
                        this.servicesCount = data;

                        this.serService.getSearchStationsCount(this.pageName,sortParam, typeParam, this.searchName,this.shopStatus).subscribe((data) => {
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





  getSomeServices(pagename, start, aItemsPerPage, sort, type, searchName, shopStatus) {

    this.serService.getSomeStations(pagename, start, aItemsPerPage, sort, type, searchName, shopStatus).subscribe((data) => {
            if (data) {
                 console.log("looooooooooooo",data)
                this.all_services = data;

                // console.log(data.qrcode);

              }else{
                this.noData = true;
            }

        });

    }

    goToSearch(searchName) {
      if (searchName != '' || this.shopStatus) {
        this.router.navigate(['/stations/all-stations'], { queryParams: { page: 1, sort: this.servicesStatus, type: this.sortDirection, searchName: searchName, shopStatus: this.shopStatus } });
        }
    }

    deleteserviceConfirm(value) {

        // console.log(value.deleteMultiple);

        if (value.deleteMultiple === 'delete') {

            if (this.commService.items.length !== 0) {

                if (this.stations_delete === false) {

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

                                this.serService.deleteStation(this.commService.items).subscribe((data) => {
                                    if (data) {

                                      this.serService.getStationsCount(this.pageName, this.shopStatus).subscribe((data) => {
                                            if (data) {

                                                this.alertService.success({
                                                    title: 'حذف المشروع',
                                                    text: 'تم حذف المشروع بنجاح'
                                                });

                                                this.servicesCount = data;

                                                this.router.navigate(['/stations/all-stations']);
                                                this.pagination(this.servicesCount, 1, '', '');

                                                this.count = this.servicesCount;
                                                $('input[class="check_all"]:checkbox:checked').prop('checked', false);

                                                this.deleteForm.reset();
                                                this.selectedOption = true;

                                            }
                                            else {

                                                this.alertService.success({
                                                    title: 'حذف المشروع',
                                                    text: 'تم حذف المشروع بنجاح'
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

        this.router.navigate(['/stations/all-stations'], { queryParams: { page: 1, sort: this.servicesStatus, type: this.sortDirection, searchName: this.searchName } });

    }

    goToAddservice() {
        this.router.navigate(['/stations/station']);
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

      this.getSomeServices(this.pageName, start, aItemsPerPage, sort, type, this.searchName, this.shopStatus);

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
          shopStatus: this.shopStatus
        }

    }


    ngAfterViewInit() {

        Helpers.loadStyles('app-all-stations',
            ['assets/own-style/pagination/style.css']);

        this._script.loadScripts('app-all-stations',
            ['assets/own-style/js/category.js', 'assets/own-style/js/script.js'])

    }


}
