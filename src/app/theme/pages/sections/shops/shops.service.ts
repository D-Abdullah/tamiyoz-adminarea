import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class ShopsService {

    private _url: string = this.commonService._hostName + 'admin-api/shops.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getSomeShops(start, aItemsPerPage, sort, type, searchName,searchCountry) {
        return this.http.get<any>(this._url + 'getSomeShops&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName+ '&searchCountry=' + searchCountry);
    }


    getSearchShopsCount(sort, type, searchName,searchCountry) {
        return this.http.get<any>(this._url + 'getSearchShopsCount&sort=' + sort + '&type=' + type + '&searchName=' + searchName+ '&searchCountry=' + searchCountry);
    }

    getShopsCount() {
        return this.http.get<any>(this._url + 'getShopsCount');
    }
    getAllStations() {
        return this.http.get<any>(this._url + 'getAllStations');
    }

    addEditShop(formData) {
        return this.http.post<any>(this._url + 'addEditShop', formData);
    }

    deleteShop(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deleteShop', body);
    }

    getOneShop(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getOneShop', body);
    }


    getShopByParentID(data){
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getShopByParentID', body);

    }
    AllRentsCount(shop_id) {
      return this.http.get<any>(this._url + 'AllRentsCount&shop=' + shop_id );
  }
}
