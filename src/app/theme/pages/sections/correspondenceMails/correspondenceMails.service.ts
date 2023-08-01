import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class CorrespondenceMailsService {

  private _url: string = this.commonService._hostName + 'admin-api/correspondencemails.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getSomeLanguages(start, aItemsPerPage, sort, type, searchName) {
      return this.http.get<any>(this._url + 'getSomecorrespondenceMails&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getSearchLanguagesCount(sort, type, searchName) {
      return this.http.get<any>(this._url + 'getSearchcorrespondenceMailsCount&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getLanguagesCount() {
      return this.http.get<any>(this._url + 'getcorrespondenceMailsCount');
    }

    addEditLanguage(formData) {
      return this.http.post<any>(this._url + 'addEditcorrespondenceMails', formData);
    }

    deleteLanguage(data) {
        let body = JSON.stringify(data);
      return this.http.post<any>(this._url + 'deletecorrespondenceMails', body);
    }

    getOneLanguage(data) {
        let body = JSON.stringify(data);
      return this.http.post<any>(this._url + 'getOnecorrespondenceMails', body);
    }

}
