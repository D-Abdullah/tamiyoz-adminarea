import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class ChancesService {

    private _url: string = this.commonService._hostName + 'admin-api/chances.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getSomeChances(start, aItemsPerPage, sort, type, searchName) {
        return this.http.get<any>(this._url + 'getSomeChances&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getSearchChancesCount(sort, type, searchName) {
        return this.http.get<any>(this._url + 'getSearchChancesCount&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getChancesCount() {
        return this.http.get<any>(this._url + 'getChancesCount');
    }

    addEditChance(formData) {
        return this.http.post<any>(this._url + 'addEditChance', formData);
    }

    deleteChance(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deleteChance', body);
    }

    getOneChance(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getOneChance', body);
    }


    getserviceByParentID(data){
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getCategoryByParentID', body);

    }

}
