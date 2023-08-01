import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class PartnersService {

    private _url: string = this.commonService._hostName + 'admin-api/partners.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getSomePartners(start, aItemsPerPage, sort, type, searchName) {
        return this.http.get<any>(this._url + 'getSomePartners&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getSearchPartnersCount(sort, type, searchName) {
        return this.http.get<any>(this._url + 'getSearchPartnersCount&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getPartnersCount() {
        return this.http.get<any>(this._url + 'getPartnersCount');
    }

    addEditPartner(formData) {
        return this.http.post<any>(this._url + 'addEditPartner', formData);
    }

    deletePartner(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deletePartner', body);
    }

    getOnePartner(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getOnePartner', body);
    }


    getPartnerByParentID(data){
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getPartnerByParentID', body);

    }

}
