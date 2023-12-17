import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InternalService } from 'src/app/shared/services/internal.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  constructor(public internalService:InternalService){}

  // search form
  reactiveForm = new FormGroup({
    searchControl : new FormControl('')
  })

  // when user stops writing, after 1 sec, the searched data
  // will be changed in internal service and home component will recieve this data
  timeout: any = null;
  public onKeySearch(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.internalService.setSearchResult(event.target.value);
      }
    }, 1000);
  }

  

}
