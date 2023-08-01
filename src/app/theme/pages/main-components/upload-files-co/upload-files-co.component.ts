import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { CommonService } from '../../../../_services/common.service';

import {
    HttpClient,
    HttpEventType,
    HttpErrorResponse,
    HttpHeaders
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { StationService } from '../../sections/stations/stations.service';
// import { InfoService } from '../../_services/info.service';





@Component({
    selector: "app-upload-files-co",
    templateUrl: "./upload-files-co.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class UploadFilesComponentComp implements OnInit {

    @Input('files') files: any;
    @Input('type') type: string;
    @Input('folderName') folderName: string;

    @Output() setFiles = new EventEmitter<any>();
    @Output() setImages = new EventEmitter<any>();


    constructor(
        public commonService: CommonService,
        public http: HttpClient,
      public infoService: StationService,
        public ngZone: NgZone,




    ) {



    }

    ngOnInit() {


        let file = {
            isUpload: false,
          localUrl: this.commonService._hostName + 'uploads/no_image.jpg',
            id: '',
            progress: 1

        }
        // console.log('files', this.files)

        if (this.files) {
            let index = this.files.findIndex(e => e.name == '')

            if (index == -1) {
                this.files.unshift(file)
            }
            // for (let index = 1; index < this.files.length; index++) {
            //   // console.log(this.files);

            //     if (this.files[index]['name']) {
            //         this.files[index]['img'] = this.files[index]['name']
            //       this.files[index]['localUrl'] = this.commonService._hostName +'uploads/'+ this.folderName + '/' + this.files[index]['name']
            //         // this.files[index]['localUrl'] = this.files[index]['url']
            //         this.files[index]['progress'] = null;
            //     }

            // }
        }
        console.log(this.files)
    }

    showPreviewFile(event: any, uploadFolder: any, index = 0) {
        //console.log('event', event.target.files)


        if (event.target.files.length > 0) {
            let length = this.files.length - 1
            let fileIndex = 0
            for (let index = length; index < (event.target.files.length + length); index++) {

                this.files.push({
                    isUpload: false,
                    localUrl: this.commonService._hostName + 'uploads/no_image.jpg',
                    id: '',
                    progress: 1,
                })
                var reader = new FileReader();
                reader.onload = (event: any) => {
                    this.files[index + 1].localUrl = event.target.result;
                }
                reader.readAsDataURL(event.target.files[fileIndex]);



                let formData = new FormData();
                formData.append('file', event.target.files[fileIndex]);
                formData.append('typefolder', this.folderName);



                //console.log('event', formData)

              let url = this.commonService._hostName + 'admin-api/uploadFile.php?action=uploadFile&folderName='+this.folderName;

                // httpHeaders = httpHeaders.set('Content-Type', 'multipart/form-data');
                // httpHeaders = httpHeaders.set('Authorization', "Bearer " + localStorage.getItem('token'));

                this.http.post(url, formData, {
                    reportProgress: true,
                    observe: "events"
                }).pipe(

                    map((event: any) => {



                        if (event.type == HttpEventType.UploadProgress) {
                            this.ngZone.run(() => {
                                this.files[index + 1].progress = Math.round((100 / event.total) * event.loaded);
                            })

                        } else if (event.type == HttpEventType.Response) {
                            console.log(event.body, "event.body")
                            if (event.body) {
                                if (event.body.ImageName) {
                                    this.files[index + 1]['img'] = event.body.ImageName
                                    this.files[index + 1]['isUpload'] = true
                                  this.files[index + 1]['localUrl'] = this.commonService._hostName + 'uploads/' + this.folderName + '/' + event.body.ImageName
                                    this.files[index + 1].progress = null;
                                    //console.log('this.files', this.files)
                                    this.type == 'images' ? this.setImages.emit(this.files) : this.setFiles.emit(this.files)
                                } else {
                                    this.files[index + 1]['isUpload'] = false
                                    this.files[index + 1].progress = null;
                                }
                            } else {
                                this.files[index + 1]['isUpload'] = false
                                this.files[index + 1].progress = null;
                            }


                        }

                    }),
                    catchError((err: any) => {
                        this.files[index + 1]['isUpload'] = false
                        this.files[index + 1].progress = null;
                        return throwError(err.message);
                    })
                ).toPromise();

                fileIndex += 1


            }
        }

    }
  removeFile(index) {
    this.files.splice(index, 1)
    this.type == 'images' ? this.setImages.emit(this.files) : this.setFiles.emit(this.files)
    }

}
