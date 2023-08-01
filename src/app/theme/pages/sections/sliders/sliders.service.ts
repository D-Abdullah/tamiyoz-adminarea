import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class slidersService {

    private _url: string = this.commonService._hostName + 'admin-api/sliders.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getSomeSliders(start, aItemsPerPage, sort, type, searchName) {
        return this.http.get<any>(this._url + 'getSomeSliders&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getSearchSlidersCount(sort, type, searchName) {
        return this.http.get<any>(this._url + 'getSearchSlidersCount&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getSlidersCount() {
        return this.http.get<any>(this._url + 'getSlidersCount');
    }

    addEditSlider(formData) {
        return this.http.post<any>(this._url + 'addEditSlider', formData);
    }

    deleteSlider(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deleteSlider', body);
    }

    getOneSlider(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getOneSlider', body);
    }


    getPartnerByParentID(data){
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getPartnerByParentID', body);

    }

}
