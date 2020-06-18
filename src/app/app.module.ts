import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfinityLiveNavComponent } from './infinity-live-nav/infinity-live-nav.component';
import { SemiFinalMenuComponent, SafePipe } from './semi-finals/semi-final-menu/semi-final-menu.component';
import { SnakeAppComponent } from './semi-finals/snake/snake-app.component';
import { FinalsComponent } from './finals/finals-component/finals.component';
import { InfinityLiveInputComponent } from './finals/components/infinity-live-input/infinity-live-input.component';
import { MemoryGameComponent } from './semi-finals/memory-game/memory-game.component';
import { BattleshipComponent } from './semi-finals/battleship/battleship.component';

@NgModule({
  declarations: [
    AppComponent,
    InfinityLiveInputComponent,
    InfinityLiveNavComponent,
    SemiFinalMenuComponent,
    SnakeAppComponent,
    FinalsComponent,
    MemoryGameComponent,
    BattleshipComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
        { path: '', component: AppComponent },
        { path: 'semi-finals', component: SemiFinalMenuComponent },
        { path: 'finals', component: FinalsComponent },
        { path: 'semi-finals/battleship', component: BattleshipComponent },
        { path: 'semi-finals/snake', component: SnakeAppComponent }
    ]),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
