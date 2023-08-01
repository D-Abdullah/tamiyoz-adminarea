import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CommonService } from '../_services/common.service';

@Injectable()
export class UserService {

    private _url: string = this.commonService._hostName + 'admin-api/users.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    signIn(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'signIn', body);
    }

    forgetPassword(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'userForgetPassword', body);
    }

    loggedIn() {
        return !!localStorage.getItem("token");
    }

    getToken() {
        return localStorage.getItem("token");
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    getUsersLevels(level_type='',provider_id='') {
        return this.http.get<any>(this._url + 'getUsersLevels&level_type='+level_type+'&provider_id='+provider_id);
    }

    getSomeUsers(userType, start, aItemsPerPage, sort, type, searchName,searchUserPhone, searchDateFrom,  searchDateTo,searchUserStatus, searchUserType,provider_id ='') {
        return this.http.get<any>(this._url + 'getSomeUsers&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName + '&userType=' + userType+ '&searchUserPhone=' + searchUserPhone+ '&searchDateFrom=' + searchDateFrom+ '&searchDateTo=' + searchDateTo+ '&searchUserStatus=' + searchUserStatus+ '&searchUserType=' + searchUserType+ "&provider_id="+provider_id);
    }

    getSearchUsersCount(userType, sort, type, searchName,searchUserPhone, searchDateFrom,  searchDateTo,searchUserStatus,  searchUserType,provider_id ='') {
        return this.http.get<any>(this._url + 'getSearchUsersCount&sort=' + sort + '&type=' + type + '&searchName=' + searchName + '&userType=' + userType+ '&searchUserPhone=' + searchUserPhone+ '&searchDateFrom=' + searchDateFrom+ '&searchDateTo=' + searchDateTo+ '&searchUserStatus=' + searchUserStatus+ '&searchUserType=' + searchUserType+ "&provider_id="+provider_id);
    }

    getUsersCount(userType,provider_id ='') {
        return this.http.get<any>(this._url + 'getUsersCount&userType=' + userType + "&provider_id="+provider_id);
    }

    addEditUser(formData) {
        return this.http.post<any>(this._url + 'addEditUser', formData);
    }
    addFinancialOperation(Data) {
        let body = JSON.stringify(Data);
        return this.http.post<any>(this._url + 'addFinancialOperation', body);
    }

    deleteUser(userType, data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deleteUser&userType=' + userType, body);
    }
    deleteStudentsParents(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deleteStudentsParents' , body);
    }
    deleteOneUserCar(user_id,data) {
        let obj={"user_id":user_id,"car_id" :data}
        return this.http.post<any>(this._url + 'deleteOneUserCar', obj);
    }

    getSearchUsersByType(query,user_type='') {
        return this.http.post<any>(this._url + 'getSearchUsersByType&query='+query+'&user_type='+user_type,null);
    }
    getOneUser(userType, data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getOneUser&userType=' + userType, body);
    }
    getAllProviderDrivers(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getAllProviderDrivers', body);
    }
    addingDriverToOrder(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'addingDriverToOrder', body);
    }
    editOrderVisit(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'editOrderVisit', body);
    }
    acceptedVisitsEdit(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'acceptedVisitsEdit', body);
    }

    getUserDetailsInfo(id) {
        return this.http.get<any>(this._url + 'getUserDetailsInfo&id=' + id);
    }


    chickEmail(email) {
        return this.http.get<any>(this._url + 'chickEmail&email=' + email);
    }
    chickMobile(mobile) {
        return this.http.get<any>(this._url + 'chickMobile&mobile=' + mobile);
    }
   
    getAllCarTypes() {
        return this.http.get<any>(this._url + 'getAllCarTypes');
    }
   
    getAllCities() {
        return this.http.get<any>(this._url + 'getAllCities');
    }
    getDistrictsByCityId(data){
        return this.http.get<any>(this._url + 'getDistrictsByCityId&city_id='+data);
    }
   

}
