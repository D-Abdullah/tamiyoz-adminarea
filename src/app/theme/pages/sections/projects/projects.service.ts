import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class ProjectService {

    private _url: string = this.commonService._hostName + 'admin-api/projects.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getSomeProjects(start, aItemsPerPage, sort, type, searchName,pagename) {
        return this.http.get<any>(this._url + 'getSomeProjects&pagename='+ pagename +'&start=' + start + '&aItemsPerPage=' + aItemsPerPage + '&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getSearchProjectsCount(sort, type, searchName,pagename) {
        return this.http.get<any>(this._url + 'getSearchProjectsCount&pagename='+pagename+'&sort=' + sort + '&type=' + type + '&searchName=' + searchName);
    }

    getProjectsCount(pagename) {
        return this.http.get<any>(this._url + 'getProjectsCount&pagename='+pagename);
    }

    addEditProject(formData) {
        return this.http.post<any>(this._url + 'addEditProject', formData);
    }

    deleteProject(data) {
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'deleteProject', body);
    }

    getOneProject(id,pagename) {
        // let body = JSON.stringify(data);
        let body = JSON.stringify({'id':id,'pagename':pagename});
        return this.http.post<any>(this._url + 'getOneProject', body);
    }


    getserviceByParentID(data){
        let body = JSON.stringify(data);
        return this.http.post<any>(this._url + 'getCategoryByParentID', body);

    }

}
