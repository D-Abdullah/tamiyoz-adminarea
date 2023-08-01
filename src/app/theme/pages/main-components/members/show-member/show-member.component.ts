import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../../../../_services/user.service';
import { CommonService } from '../../../../../_services/common.service';

import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { SweetAlertService } from 'angular-sweetalert-service';
declare var jquery: any;
declare var $: any;

@Component({
    selector: "app-show-member",
    templateUrl: "./show-member.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ShowMemberComponent implements OnInit {

    action: string='add';
    page_id: string;

    member_name_title: string = '';
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

    members_details_view: boolean;
    members_add_mony: boolean;

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
   
    email: string = '';
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
    notes: string = '';
    img: string = '';
    bobupImgPath='';
   
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



    constructor(private route: ActivatedRoute,private modalService: NgbModal, private alertService: SweetAlertService,public commService: CommonService, public userService: UserService, private router: Router, private actRouter: ActivatedRoute) {
        this.loadingImgPath = this.commService._hostName + 'uploads/loading-1.gif';
        this.orderImgPath=this.commService._hostName + 'uploads/order_map_imgs/';
        this.carImgsUrl = this.commService._hostName + 'uploads/users/car_owner_licence/';
        this.userIDImgUrl = this.commService._hostName + 'uploads/users/';
        this.userImgPath = this.commService._hostName + 'uploads/users/';
        this.defaultImg = this.commService._hostName + 'uploads/no_image.jpg';
      
}

onKeyUpfull_name(event: any) {
    this.successfull_name = event.target.value.trim() === '' ? true : false;
}

onKeyUpMobile(event: any) {
    this.successMobile = event.target.value.trim() === '' ? true : false;
    this.errorMobileErrorExsistMsg=false;
}
onBlurMobile(event: any) {
   
    let mobile = event.target.value;
    this.userService.chickMobile(mobile).subscribe((data) => {
        if (data) {
            this.errorMobileErrorExsistMsg=true;
        }
        else{
            console.log("the mobile not exist");
        }
    });
}

onKeyUpPassword(event: any) {
    if (this.action === 'add' ) {
        this.successPassword = event.target.value === '' ? true : false;
    }
}

onKeyUpConfirmPassword(event: any) {
    if (this.action === 'add' ) {
        this.successConfirmPassword = event.target.value === '' ? true : false;
    }
}

    goToBobup(imgpath,content){
        console.log("this content is",content )
        this.bobupImgPath=imgpath;
        if(content == 'content' ){
            this.modalService.open(content, { size: 'lg' });
        }
        else{
          this.mmodel= this.modalService.open(content, { size: 'lg' });
        }
        
    }

    onNavigate(URL, mode) {
        if (mode === 'map') {
            URL = "https://www.google.com/maps?q=" + URL;
        }
        window.open(URL, "_blank");
    }

   

    getUserDetailsInfo(id) {

        this.userService.getUserDetailsInfo(id).subscribe((data) => {
            if (data) {

                   console.log("member details",data);

                this.member_name_title = data.full_name;
                this.full_name = data.full_name;
                this.date_added = data.date_added;
                this.email = data.email?data.email:'';
                this.user_type = data.user_type;
                this.status = data.status;
                this.activation_management = data.activation_management;
                this.ID_img = data.ID_img;
                this.mobile = data.mobile;
                this.electricity_meter_num = data.electricity_meter_num;
                this.representative_provider = data.representative_provider;
                this.provider_info = data.provider_info;
                this.water_meter_num = data.water_meter_num;
                this.tax_number = data.tax_number;
                this.city_name = data.city_name;
                this.district_name = data.district_name;
                this.totalbalance = data.totalbalance !=null?data.totalbalance:"0";
                this.marketing_code = data.marketing_code !=null?data.marketing_code:"";
                this.notes = data.notes;
                this.userOrders=data.orders;
                this.userRepresentatives=data.userRepresentatives;
               
                this.userLocation=data.userLocation;

        
                this.financialOperations=data.financialOperations;
              
                this.successImg = true;


                this.img = data.img === '' || data.img === null || data.img === undefined ? this.commService._hostName + 'uploads/no_image.jpg' : this.commService._hostName + 'uploads/users/' + data.img;

                this.isDataAvailable = true;

            }

        });

    }

    addEditUser() {
        
    
        this.successMobile = this.mobile === '' ? true : false;
        this.city_id =='' || this.district_id ==""? this.errorPlaceAddress=true : this.errorPlaceAddress=false;
        let formData = new FormData();
        formData.append('full_name', this.provider_full_name.trim());
        formData.append('user_type', 'representative');
        formData.append('provider_id',this.page_id );
        formData.append('area', this.area);
        formData.append('lon', this.lon);
        formData.append('lat', this.lat);
        formData.append('city_id', this.city_id);
        formData.append('district_id', this.district_id);
        formData.append('status', 'true');
        formData.append('mobile', this.provider_mobile.trim());
        formData.append('password', this.password.trim());
        formData.append('notes', this.notes);
        formData.append('userType', 'members');
        formData.append('operation', 'add');
      
        if (this.full_name === '') { this.successfull_name = true; }
        if (this.action === 'add' ) {

            if (this.password === '') { this.successPassword = true; }
            if (this.confirm_password === '') { this.successConfirmPassword = true; }

        }
       
        this.misMatchConfirm = this.password !== this.confirm_password ? true : false;

        if (this.action === 'add' ) {

            if (this.full_name === '' || this.password === '' || this.confirm_password === '' || this.misMatchConfirm === true || this.successMobile ===true  || this.errorPlaceAddress ===true ) {
               
                return;
            }
            else {
                this.userService.addEditUser(formData).subscribe((data) => {
                    if (data) {
                        this.resetInputs();
                        this.getUserDetailsInfo(this.page_id);
                        this.alertService.success({
                            title: 'حفظ المندوب',
                            text: "تم حفظ بيانات المندوب بنجاح."
                        });
                    }
                });
            }
        }
       
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
    addFinancialOperation() {
        this.financialoperationvaluecorrect=false;
      
       let value =Number(this.financialoperationvalue);
       if(!isNaN(value) && value >0 )
       {
       
        let body={
            "user_id":this.page_id,
            "value":value,
            "added_by":this.user_id
        }
        this.userService.addFinancialOperation(body).subscribe((data) => {
            if (data) {
                // console.log("addFinancialOperation",data);
                this.mmodel.close();
                this.financialoperationvalue='';
                this.getUserDetailsInfo(this.page_id)
                this.alertService.success({
                    title: 'حفظ العملية',
                    text: "تم حفظ بيانات العملية بنجاح."
                });
            }
        });


       }else{
           this.financialoperationvaluecorrect=true;
        }
    }

    
    getAllCities() {
        this.cities = null;
        this.districts=null;
        this.userService.getAllCities().subscribe((data) => {
            if (data) {
                this.cities = data;
            }
            else {
                this.cities = null;
            }
        });
    }
    getDistrictsByCityId() {
        this.districts=null;
        this.district_id='';
        if(this.city_id !=''){
            this.userService.getDistrictsByCityId(this.city_id).subscribe((data) => {
                if (data) {
                    this.districts = data;
                }
                else {
                    this.districts = null;
                }
            });
        }
        
    } 

    ngOnInit() {
       
      
        if (localStorage.getItem('currentUser') === null) {
            this.router.navigate(['/login']);
        }
        else {
            var currentUser = localStorage.getItem('currentUser');
            var retrievedObject = JSON.parse(currentUser);
            this.user_id = retrievedObject.id;
            this.getAllCities();
            let roles = ["members_details_view","members_add_mony"];
            let userInfo = { "user_id": this.user_id, "roles": roles };

            this.commService.getUserLevel(userInfo).subscribe((res) => {
                if (res) {
                    this.members_details_view = res.members_details_view === '1' ? true : false;
                    this.members_add_mony = res.members_add_mony === '1' ? true : false;

                    this.actRouter.paramMap.subscribe((params: ParamMap) => {
                        this.page_id = params.get('id');

                        if (this.page_id !== null) {
                            this.commService.setTitle("عرض بيانات العضو");

                            this.successImg = false;

                            if (this.members_details_view === true) {
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