import {Inject, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

// internal service for transferring searched data from search component to
// home component
@Injectable()
export class InternalService {
  public searchResult : string =''
  public searchResultSource = new BehaviorSubject<string>(this.searchResult);
  searchResultItems$ = this.searchResultSource.asObservable();

  setSearchResult(items:any){
    this.searchResult = items;
    this.searchResultSource.next(this.searchResult);
  }
}
