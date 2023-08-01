import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class ServicesService {

    private _url: string = this.commonService._hostName + 'admin-api/services.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getSomeServices(start, aItemsPerPage, sort, type, searchName) {
        return this.http.get<any>(this._url + 'getSomeServices&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getSearchServicesCount(sort, type, searchName) {
        return this.http.get<any>(this._url + 'getSearchServicesCount&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getServicesCount() {
        return this.http.get<any>(this._url + 'getServicesCount');
    }

    addEditService(formData) {
        return this.http.post<any>(this._url + 'addEditService', formData);
    }

    deleteService(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deleteService', body);
    }

    getOneService(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getOneCategory', body);
    }


    getserviceByParentID(data){
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getCategoryByParentID', body);

    }

}
