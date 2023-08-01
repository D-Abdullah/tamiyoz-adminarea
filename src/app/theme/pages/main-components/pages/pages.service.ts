import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class PagesService {

    private _url: string = this.commonService._hostName + 'admin-api/pages.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getSomePages(start, aItemsPerPage, sort, type, searchTitle) {
        return this.http.get<any>(this._url + 'getSomePages&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchTitle=' + searchTitle);
    }

    getSearchPagesCount(sort, type, searchTitle) {
        return this.http.get<any>(this._url + 'getSearchPagesCount&sort=' + sort + '&type=' + type + '&searchTitle=' + searchTitle);
    }

    getPagesCount() {
        return this.http.get<any>(this._url + 'getPagesCount');
    }

    addEditPage(data) {
        return this.http.post<any>(this._url + 'addEditPage', data);
    }

    deletePage(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deletePage', body);
    }

    getOnePage(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getOnePage', body);
    }

}
