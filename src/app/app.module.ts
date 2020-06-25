import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfinityLiveNavComponent } from './infinity-live-nav/infinity-live-nav.component';
import { SemiFinalMenuComponent, SafePipe } from './semi-finals/semi-final-menu/semi-final-menu.component';
import { FinalsComponent } from './finals/finals-component/finals.component';
import { InfinityLiveInputComponent } from './finals/components/infinity-live-input/infinity-live-input.component';
import { MemoryGameComponent } from './semi-finals/memory-game/memory-game.component';
import { BattleshipComponent } from './semi-finals/battleship/battleship.component';

import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent,
        InfinityLiveInputComponent,
        InfinityLiveNavComponent,
        SemiFinalMenuComponent,
        FinalsComponent,
        MemoryGameComponent,
        BattleshipComponent,
        SafePipe
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        AppRoutingModule,
        HttpClientModule,
        RouterModule.forRoot([
            { path: '', component: AppComponent },
            { path: 'semi-finals', component: SemiFinalMenuComponent },
            { path: 'finals', component: FinalsComponent },
            { path: 'semi-finals/battleship', component: BattleshipComponent }
        ], {
            initialNavigation: 'enabled'
        }),
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(APP_ID) private appId: string) {
        const platform = isPlatformBrowser(platformId) ?
            'in the browser' : 'on the server';
        console.log(`Running ${platform} with appId=${appId}`);
    }
}