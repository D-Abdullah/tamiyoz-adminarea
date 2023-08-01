import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { CommonService } from "src/app/_services/common.service";

@Injectable()
export class sectionService {
  private _url: string =
    this.commonService._hostName + "admin-api/home_section.php?action=";

  constructor(public http: HttpClient, public commonService: CommonService) {}

  getSomePages(start, aItemsPerPage, sort, type, searchTitle) {
    return this.http.get<any>(
      this._url +
        "getSomeSection&start=" +
        start +
        "&aItemsPerPage=" +
        aItemsPerPage +
        "&sort=" +
        sort +
        "&type=" +
        type +
        "&searchTitle=" +
        searchTitle
    );
  }

  getSearchPagesCount(sort, type, searchTitle) {
    return this.http.get<any>(
      this._url +
        "getSearchSectionCount&sort=" +
        sort +
        "&type=" +
        type +
        "&searchTitle=" +
        searchTitle
    );
  }

  getPagesCount() {
    return this.http.get<any>(this._url + "getSectionCount");
  }

  addEditPage(data) {
    return this.http.post<any>(this._url + "addEditSection", data);
  }

  getOnePage(data) {
    let body = JSON.stringify(data);
    return this.http.post<any>(this._url + "getOneSection", body);
  }
}
