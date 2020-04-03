import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpErrorResponse, HttpClientJsonpModule } from '@angular/common/http';
import { IAPIResponse } from '../interfaces/apiResponse';
import { AppConfig } from '../app.config';

@Injectable()
export class BrokerAPIService {
    protected ServerApiUrl = AppConfig.settings.ServerApiUrl;

    constructor(private http: HttpClient) {
       
     }

     getHeaderContentTypeJson()
     {
        const headerDict = {
            'authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
        return headerDict;
     }

     getHeader()
     {
        const headerDict = {
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
        return headerDict;
     }

     getHeaderDownloadImage()
     {
        const headerDict = {
            authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNi0wMDAwODAiLCJqdGkiOiI5MThiOTc3ZS1iYTExLTQyZDEtODc5ZS1lZWZiM2VjMDUxOWIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjFlMDk0ODQ5LTAyZjQtNGU0MS1iMmQ1LTc4NWNhMDQ2ZDdiYyIsImV4cCI6MTUzMjE0NzI3MiwiaXNzIjoiaHR0cDovL3d3dy5zb2xkZXYuY28udGgiLCJhdWQiOiJodHRwOi8vd3d3LnNvbGRldi5jby50aCJ9.5AwVeilLaXxHvGx4owTSUUCVie6ab91w5kfKu-JoP4U',
        }
        return headerDict;
     }


    get(strUrl:string):Observable<any> {
        return  this.http.get<any>(this.ServerApiUrl +strUrl, {headers:this.getHeaderContentTypeJson()});
    }

    post(strUrl:string,objbody : any):Observable <IAPIResponse> {
        return this.http.post<IAPIResponse>(this.ServerApiUrl +strUrl, objbody,{headers:this.getHeaderContentTypeJson()});
    }

    upload(strUrl:string,objbody : any):Observable <IAPIResponse>{
        let input = new FormData();
        input.append("file", objbody);
        return this.http.post<IAPIResponse>(this.ServerApiUrl +strUrl, input,{headers:this.getHeader()});
    }

    downloadimage(strUrl:string):Observable<Blob> {
        return this.http.get(this.ServerApiUrl + strUrl, {responseType: "blob" , headers: this.getHeaderDownloadImage()});
    }



}

