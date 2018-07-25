import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {NavbarNotifications} from './notifications/components/navbar-notifications.component';
import {PollingService} from "./polling/services/polling.service";
import {NotificationsService} from "./notifications/services/notifications.service";
import {HttpClientModule} from '@angular/common/http';
import {BsDropdownModule, PopoverModule} from "ngx-bootstrap";

@NgModule({
    declarations: [
        NavbarNotifications
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot()
    ],
    providers: [
        PollingService,
        NotificationsService
    ],
    bootstrap: [NavbarNotifications]
})
export class AppModule { }
