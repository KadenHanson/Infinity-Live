import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'infinity-live-nav',
    templateUrl: './infinity-live-nav.component.html',
    styleUrls: ['./infinity-live-nav.component.css']
})
export class InfinityLiveNavComponent implements OnInit {
    spectatorHide: boolean = false;

    constructor() { }

    ngOnInit() {
        this.spectatorHide = location.href.indexOf('&spectator=true') > -1;
    }

}
