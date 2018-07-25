import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PollingService} from "./services/polling.service";
import {NotificationsService} from "./services/notifications.service";
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
      PollingService,
      NotificationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
