import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
    selector: 'infinity-live-nav',
    templateUrl: './infinity-live-nav.component.html',
    styleUrls: ['./infinity-live-nav.component.css']
})
export class InfinityLiveNavComponent implements OnInit {
    spectatorHide: boolean = false;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.spectatorHide = location.href.indexOf('&spectator=true') > -1;
        }
    }

}
