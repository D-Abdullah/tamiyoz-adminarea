import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class RanteService {

    private _url: string = this.commonService._hostName + 'admin-api/rentes.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getSomeRentes(start, aItemsPerPage, sort, type, searchNumber,searchStation,searchShop) {
        return this.http.get<any>(this._url + 'getSomeRentes&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchNumber=' + searchNumber+ '&searchStation=' + searchStation+ '&searchShop=' + searchShop);
    }

    getSearchRentesCount(sort, type, searchNumber,searchStation,searchShop) {
        return this.http.get<any>(this._url + 'getSearchRentesCount&sort=' + sort + '&type=' + type + '&searchNumber=' + searchNumber+ '&searchStation=' + searchStation+ '&searchShop=' + searchShop);
    }

    getRentesCount() {
        return this.http.get<any>(this._url + 'getRentesCount');
    }

    // addEditProject(formData) {
    //     return this.http.post<any>(this._url + 'addEditProject', formData);
    // }

    deleteRente(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deleteRente', body);
    }

    getOneRente(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getOneRente', body);
    }




    getAllStations() {
      return this.http.get<any>(this._url + 'getAllStations');
  }



  getAllShops() {
    return this.http.get<any>(this._url + 'getAllShops');
}
}
