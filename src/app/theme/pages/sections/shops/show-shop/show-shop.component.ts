import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {  ShopsService} from '../shops.service';
import { CommonService } from '../../../../../_services/common.service';

import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { SweetAlertService } from 'angular-sweetalert-service';
declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-show-shop",
    templateUrl: "./show-shop.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ShowShopComponent implements OnInit {

    action: string='add';
    page_id: string;

    name: string;
    isDataAvailable: boolean = false;
    loadingImgPath: string = '';
    successImg: boolean = true;
    successMobile:boolean=false;
    successfull_name: boolean = false;

    errorMobileErrorExsistMsg=false;
    successPassword: boolean = false;
    successConfirmPassword: boolean = false;
    misMatchConfirm: boolean = false;
    success_country_name: boolean = false;
    success_city_name: boolean = false;
    errorPlaceAddress: boolean = false;
    user_id;
    userImgPath:string ='';
    defaultImg:string ='';

    shops_view: boolean;
    shops_delete: boolean;

    full_name: string = '';
    provider_full_name: string = '';
    lon: string = '';
    lat: string = '';
    area: string = '';
    provider_mobile: string = '';
    password: string = '';
    confirm_password: string = '';

    cities: any = [];
    city_id='';
    districts: any = [];
    district_id='';

    station_name: string = '';
    user_type: string = '';
    ID_img: string = '';
    status: string = '';
    representative_provider: any ;
    provider_info: any ;
    electricity_meter_num: string = '';
    water_meter_num: string = '';
    tax_number: string = '';
    city_name: string = '';
    district_name: string = '';
    activation_management: string = '';
    mobile: string = '';
    totalbalance: string = '';
    marketing_code: string = '';
    userLocation:any[]=[];
    date_added: string = '';
    phone: string = '';
    rented: string = '';
    rante_time: string = '';
    shop_name: string = '';
    notes: string = '';
    count: string = '';
    img: string = '';
    bobupImgPath='';
id:'';
    financialoperationvalue='';
    financialoperationvaluecorrect:boolean=false;


    userOrders: any;
    userRepresentatives: any;
    financialOperations: any[]=[];

    orderImgPath:string='';
    carImgsUrl:string='';
    userIDImgUrl:string='';
    mmodel:any;
    user_commercial_accounts: any;

    public full_nameErrorMsg: string = 'يرجى إدخال الاسم الكامل';
    public mobileErrorMsg:string ='يرجى إدخال رقم الهاتف ';
    public mobileErrorExsistMsg: string = 'هذا الموبايل موجود من قبل';
    public passwordErrorMsg: string = 'يرجى إدخال كلمة المرور';
    public confirmPasswordErrorMsg: string = 'يرجى تأكيد كلمة المرور';
    public misMatchConfirmErrorMsg: string = 'كلمة المرور وتأكيدها غير متطابقتين !!';
    public fileErrorMsg: string = 'يرجى إختيار صورة العضو';
    public adderssplacemsgerror: string = 'يرجى إختيار المدينة والمنطقة';
    public requirDataerror: string = 'يرجى إدخال البيانات المطلوبة';



    constructor(private route: ActivatedRoute,private modalService: NgbModal, private alertService: SweetAlertService,public commService: CommonService, public userService: ShopsService, private router: Router, private actRouter: ActivatedRoute) {
        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
        this.orderImgPath=this.commService._hostName + 'uploads/order_map_imgs/';
        this.carImgsUrl = this.commService._hostName + 'uploads/users/car_owner_licence/';
        this.userIDImgUrl = this.commService._hostName + 'uploads/users/';
        this.userImgPath = this.commService._hostName + 'uploads/shops/';
        this.defaultImg = this.commService._hostName + 'uploads/no_image.jpg';

}


goToSearch(searchShop) {
  if (searchShop != '') {
      this.router.navigate(['/rentes/all-rentes'], { queryParams: { page: 1, sort:'', type: '', searchNumber: '',searchStation:'',searchShop: searchShop  } });
  }
}

    getUserDetailsInfo(id) {

        this.userService.getOneShop(id).subscribe((data) => {
            if (data) {

                   console.log("shop details",data);
                for(let i=0;i<data.langs.length;i++){
                  if(data.langs[i]['lang_code']=='ar'){
                    this.name=data.langs[i]['name'];
                    // console.log(this.name);

                  }
                }
               this.img = this.userImgPath+data.img;
                this.station_name = data.station_name?data.station_name:'';
                this.rented = data.rented;
                this.id=data.id;
                // console.log(data.id);

                this.AllRentsCount(data.id);
                // this.rante_time = data.rante_time;
                // this.status = data.status;
                // this.shop_name=data.shop_name;
                // this.date_added = data.date_added;


                // this.successImg = true;


                // this.img = data.img === '' || data.img === null || data.img === undefined ? this.commService._hostName + 'uploads/no_image.jpg' : this.commService._hostName + 'uploads/users/' + data.img;

                this.isDataAvailable = true;

            }

        });

    }

    AllRentsCount(shop_id){
      this.userService.AllRentsCount(shop_id).subscribe((data)=>{
     if(data){
       console.log(data);
       this.count=data;

     }
      });
    }


    resetInputs() {
        this.provider_full_name = '';
        this.provider_mobile = '';
        this.password = '';
        this.confirm_password = '';
        this.lon = '';
        this.lat = '';
        this.city_id = '';


    }

    GoTophone(){
      window.location.href="tel:"+this.phone;
      // console.log("tel:"+this.phone);

    }


    // GoToMail(){
    //   window.location.href="mailto:"+this.email;
    //   // console.log("mailto:"+this.email);

    // }
    ngOnInit() {


        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;

            let roles = ["shops_view","shops_delete"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.shops_view = res.shops_view === '1' ? true : false;
                    this.shops_delete = res.shops_delete === '1' ? true : false;

                    this.actRouter.paramMap.subscribe((params: ParamMap) => {
                        this.page_id = params.get('id');

                        if (this.page_id !== null) {
                            this.commService.setTitle("عرض بيانات العضو");

                            this.successImg = false;

                            if (this.shops_view === true) {
                                this.getUserDetailsInfo(this.page_id);
                            }
                            else {
                                this.isDataAvailable = true;
                            }

                        }
                        else {
                            this.router.navigate(['/404']);
                        }

                    });

                }
            });

        }


    }
}
