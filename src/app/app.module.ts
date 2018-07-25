import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {NavbarNotifications} from './navbar-notifications.component';
import {PollingService} from "./services/polling.service";
import {NotificationsService} from "./services/notifications.service";
import {HttpClientModule} from '@angular/common/http';
import {BsDropdownModule} from "ngx-bootstrap";

@NgModule({
    declarations: [
        NavbarNotifications
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BsDropdownModule.forRoot(),
    ],
    providers: [
        PollingService,
        NotificationsService
    ],
    bootstrap: [NavbarNotifications]
})
export class AppModule { }
