import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-infinity-live-input',
  templateUrl: './infinity-live-input.component.html',
  styleUrls: ['./infinity-live-input.component.css']
})
export class InfinityLiveInputComponent implements OnInit {
    @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  verifyInput() {
      this.parentFun.emit('')
  }

}
