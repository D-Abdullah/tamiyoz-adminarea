import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
} from "@angular/core";
// import { Http } from '@angular/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../../../../helpers";
import { ScriptLoaderService } from "../../../../../_services/script-loader.service";
import { CommonService } from "../../../../../_services/common.service";
import { sectionService } from "../sections.service";

import { SweetAlertService } from "angular-sweetalert-service";

import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import {
  NgForm,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-all-home-sections",
  templateUrl: "./all-sections.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AllHomeSectionsComponent implements OnInit, AfterViewInit {
  pageForm: FormGroup;
  deleteForm: FormGroup;
  searchTitle: string = "";

  pagination_pages;
  resultObj = {};
  pagesCount: number;
  searchPagesCount: number;
  sortDirection;
  pageStatus: string = "";

  current_page: number;
  previous;
  next;
  all_pages = [];

  count;
  user_id;

  deleteMultiple: string = "";
  selectedOption: boolean = false;

  pages_view: boolean;
  pages_delete: boolean;
  isDataAvailable: boolean = false;

  loadingImgPath: string = "";
  noDatadata: boolean = false;

  constructor(
    public http: HttpClient,
    public commService: CommonService,
    public homeSectionsService: sectionService,
    private router: Router,
    private actRouter: ActivatedRoute,
    private alertService: SweetAlertService,
    private _script: ScriptLoaderService,
    private fb: FormBuilder
  ) {
    this.pageForm = fb.group({
      searchTitle: [null],
      item: [null],
    });

    this.deleteForm = fb.group({
      deleteMultiple: [null],
    });

    this.loadingImgPath = this.commService._hostName + "uploads/loading-1.gif";
  }

  ngOnInit() {
    this.commService.setTitle("كافة العناصر");

    if (localStorage.getItem("currentUser") === null) {
      this.router.navigate(["/login"]);
    } else {
      var currentUser = localStorage.getItem("currentUser");
      var retrievedObject = JSON.parse(currentUser);
      this.user_id = retrievedObject.id;

      let roles = ["home_section_view"];
      let userInfo = { user_id: this.user_id, roles: roles };

      this.commService.getUserLevel(userInfo).subscribe((res) => {
        if (res) {
          this.pages_view = res.home_section_view === "1" ? true : false;
          this.isDataAvailable = true;
          if (this.pages_view === true) {
            this.getAllData();
          }
        }
      });
    }
  }

  getAllData() {
    let pageParam, sortParam, typeParam;

    this.actRouter.queryParams.subscribe((params) => {
      pageParam = parseInt(params.page) ? parseInt(params.page) : 1;
      sortParam = params.sort ? params.sort : "";
      typeParam = params.type ? params.type : "";
      this.searchTitle = params.searchTitle ? params.searchTitle : "";

      this.sortDirection = typeParam;
      this.pageStatus = sortParam;

      this.homeSectionsService.getPagesCount().subscribe((data) => {
        if (data) {
          this.noDatadata = false;
          if (data.status === 401) {
            this.router.navigate(["/login"]);
          } else {
            this.pagesCount = data;

            this.homeSectionsService
              .getSearchPagesCount(sortParam, typeParam, this.searchTitle)
              .subscribe((data) => {
                if (data) {
                  this.noDatadata = false;
                  if (data.status === 401) {
                    this.router.navigate(["/login"]);
                  } else {
                    this.searchPagesCount = data;

                    // reset [items] to empty for deleting items
                    this.commService.items.length = 0;

                    if (this.searchTitle != "" || this.searchTitle != null) {
                      this.count = this.searchPagesCount;
                      this.pagination(
                        this.pagesCount,
                        pageParam,
                        sortParam,
                        typeParam
                      );
                    } else {
                      this.count = this.pagesCount;
                      this.pagination(
                        this.searchPagesCount,
                        pageParam,
                        sortParam,
                        typeParam
                      );
                    }
                  }
                } else {
                  this.all_pages = null;
                  this.noDatadata = true;
                }
              });
          }
        } else {
          this.all_pages = null;
          this.noDatadata = true;
        }
      });
    });
  }

  getSomePages(start, aItemsPerPage, sort, type, searchTitle) {
    this.homeSectionsService
      .getSomePages(start, aItemsPerPage, sort, type, searchTitle)
      .subscribe((data) => {
        if (data) {
          this.all_pages = data;
        } else {
          this.noDatadata = true;
        }
      });
  }

  goToSearch(searchTitle) {
    if (searchTitle != "") {
      this.router.navigate(["/home-section/all-sections"], {
        queryParams: {
          page: 1,
          sort: this.pageStatus,
          type: this.sortDirection,
          searchTitle: searchTitle,
        },
      });
    }
  }

  getSortType(sort) {
    if (sort === "title") {
      this.pageStatus = "title";
    } else {
      alert("sort undefined !!");
      this.pageStatus = "id";
    }

    this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";

    this.router.navigate(["/home-section/all-sections"], {
      queryParams: {
        page: 1,
        sort: this.pageStatus,
        type: this.sortDirection,
        searchTitle: this.searchTitle,
      },
    });
  }
  pagination(aTotal, page, sort, type, aItemsPerPage = 30, aLinksPerPage = 20) {
    let num_pages,
      first,
      last,
      left_offset,
      from,
      to,
      start = 0;

    if (aTotal && aTotal > aItemsPerPage) {
      num_pages = Math.ceil(aTotal / aItemsPerPage);
      this.current_page = parseInt(page);
      this.current_page =
        this.current_page < 1
          ? 1
          : this.current_page > num_pages
          ? num_pages
          : this.current_page;

      left_offset = Math.ceil(aLinksPerPage / 2) - 1;
      first = this.current_page - left_offset;
      first = first < 1 ? 1 : first;

      last = first + aLinksPerPage - 1;
      last = last > num_pages ? num_pages : last;

      first = last - aLinksPerPage + 1;
      first = first < 1 ? 1 : first;

      this.pagination_pages = this.commService.range(first, last, 1);

      // Previous, First links
      if (this.current_page > 1) {
        this.previous = this.current_page - 1;
      } else {
        this.previous = null;
      }

      // Next, Last links
      if (this.current_page < num_pages) {
        this.next = this.current_page + 1;
      } else {
        this.next = null;
      }

      page = page < 1 ? 1 : page;
      start = (page - 1) * aItemsPerPage;

      from = aTotal > 0 ? start + 1 : start;
      to = aTotal > start + aItemsPerPage ? start + aItemsPerPage : aTotal;
    }

    this.getSomePages(start, aItemsPerPage, sort, type, this.searchTitle);

    this.resultObj = {
      pages: this.pagination_pages,
      current_page: this.current_page,
      total: aTotal,
      previous: this.previous,
      next: this.next,
      sort: sort,
      type: type,
      from: from,
      to: to,
      aItemsPerPage: aItemsPerPage,
      searchTitle: this.searchTitle,
    };
  }

  ngAfterViewInit() {
    Helpers.loadStyles("app-all-pages", [
      "assets/own-style/pagination/style.css",
    ]);

    this._script.loadScripts("app-all-pages", [
      "assets/own-style/js/category.js",
      "assets/own-style/js/script.js",
    ]);
  }
}
