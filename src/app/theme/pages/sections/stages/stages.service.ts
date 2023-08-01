import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class StagesService {

    private _url: string = this.commonService._hostName + 'admin-api/stages.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getSomeStages(start, aItemsPerPage, sort, type, searchName,searchCountry) {
        return this.http.get<any>(this._url + 'getSomeStages&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName+ '&searchCountry=' + searchCountry);
    }
   

    getSearchStagesCount(sort, type, searchName,searchCountry) {
        return this.http.get<any>(this._url + 'getSearchStagesCount&sort=' + sort + '&type=' + type + '&searchName=' + searchName+ '&searchCountry=' + searchCountry);
    }

    getStagesCount() {
        return this.http.get<any>(this._url + 'getStagesCount');
    }
    getAllCountries() {
        return this.http.get<any>(this._url + 'getAllCountries');
    }

    addEditStage(formData) {
        return this.http.post<any>(this._url + 'addEditStage', formData);
    }

    deleteStage(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deleteStage', body);
    }

    getOneStage(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getOneStage', body);
    }


    getStageByParentID(data){
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getStageByParentID', body);

    }

}
