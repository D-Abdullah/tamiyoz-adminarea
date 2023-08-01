import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class StationService {

    public _url: string = this.commonService._hostName + 'admin-api/projects.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

  getSomeStations(pagename, start, aItemsPerPage, sort, type, searchName, shopStatus) {
    return this.http.get<any>(this._url + 'getSomeProjects&pagename=' + pagename + '&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName + '&shopStatus=' + shopStatus);
    }

  getSearchStationsCount(pagename, sort, type, searchName, shopStatus) {
    return this.http.get<any>(this._url + 'getSearchProjectsCount&pagename=' + pagename + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName + '&shopStatus=' + shopStatus );
    }

  getStationsCount(pagename, shopStatus) {
    return this.http.get<any>(this._url + 'getProjectsCount&pagename=' + pagename + '&shopStatus=' + shopStatus);
    }

    addEditStation(formData) {
        return this.http.post<any>(this._url + 'addEditProject', formData);
    }

    deleteStation(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deleteProject', body);
    }



  getStationByIDSAndStatus(data,shopStatus) {
    let body = JSON.stringify(data);
    return this.http.post<any>(this._url + 'getStationByIDSAndStatus&shopStatus=' + shopStatus , body);
  }

    getOneStation(id,pagename) {
        let body = JSON.stringify({'id':id,'pagename':pagename});
        // console.log(body);

        return this.http.post<any>(this._url + 'getOneProject', body);
    }


    getserviceByParentID(data){
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getCategoryByParentID', body);

    }

}
