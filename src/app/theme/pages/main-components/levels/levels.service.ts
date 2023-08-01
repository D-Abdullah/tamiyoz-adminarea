import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class LevelsService {

    private _url: string = this.commonService._hostName + 'admin-api/levels.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getSomeLevels(start, aItemsPerPage, sort, type, searchName, level_type, provider_id = '') {
        return this.http.get<any>(this._url + 'getSomeLevels&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName + '&level_type=' + level_type + '&provider_id=' + provider_id);
    }

    getSearchLevelsCount(sort, type, searchName, level_type, provider_id = '') {
        return this.http.get<any>(this._url + 'getSearchLevelsCount&sort=' + sort + '&type=' + type + '&searchName=' + searchName + '&level_type=' + level_type + '&provider_id=' + provider_id);
    }

    getLevelsCount() {
        return this.http.get<any>(this._url + 'getLevelsCount');
    }

    addEditLevel(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'addEditLevel', body);
    }

    deleteLevel(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deleteLevel', body);
    }

    getOneLevel(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getOneLevel', body);
    }

}
