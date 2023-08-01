import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';


import { CommonService } from '../../../../_services/common.service';

@Injectable()
export class SettingsService {

    private _url: string = this.commonService._hostName + 'admin-api/settings.php?action=';

    constructor(public http: HttpClient, public commonService: CommonService) { }

    getAllSettings() {
        return this.http.get<any>(this._url + 'getAllSettings');
    }

    editSettings(data) {
        return this.http.post<any>(this._url + 'editSettings', data);
    }

}
