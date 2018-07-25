/**
 * Created by vpellegr on 20/07/2018.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Notification} from "../models/notification";
import {NotificationsService} from "../services/notifications.service";
import {PollingService} from "../../polling/services/polling.service";

@Component({
    selector: 'navbar-notifications',
    template:
        `
        <ul class="nav navbar-nav ml-auto">
            <li class="nav-item dropdown d-md-down-none" dropdown #dropdown="bs-dropdown" placement="bottom right">
                <a class="nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false" dropdownToggle (click)="false">
                  <i class="icon-bell"></i><span class="badge badge-pill badge-danger">{{notifications && notifications.length}}</span>
                </a>
                <div class="dropdown-menu dropdown-menu-right dropdown-menu-lg" *dropdownMenu aria-labelledby="simple-dropdown" (click)="$event.stopPropagation()">
                    <ng-container *ngFor="let notification of notifications; let i=index">
                        <ng-template #popTemplate>
                            {{notification.description}}
                        </ng-template>
                        <a [popover]="popTemplate" [outsideClick]="true" placement="left" class="notification-item dropdown-item" *ngIf="i<5">
                            <span><i class="fa" [ngClass]="ns.getNotificationIcon(notification.category)"></i>{{notification.title}}
                                <i (click)="ns.markNotificationAsRead(notifications, notification.id)" title="{{ns.getMarkNotificationAsReadTitle()}}" class="check-notification icon-check"></i>
                              </span>
                            <small class="notification-age">{{ns.displayNotificationAge(notification.created_at)}}</small>
                        </a>
                    </ng-container>
                </div>
            </li>
        </ul>
        `,
    styles: [
        `
            small.notification-age {
                margin-top: 3px;
                margin-left: -5px;
                margin-bottom: -3px;
                display: block;
            }
            i.check-notification {
                float: right;
                margin-top: 5px;
                padding-left: 20px;
            }
            i.check-notification:hover {
                color: #8ad4ee;
                font-weight: bold;
            }
        `
    ]
})

export class NavbarNotifications implements OnInit, OnDestroy {

    private destroy$: Subject<boolean> = new Subject<boolean>();
    public notifications: Notification[];
    public ns: NotificationsService;

    constructor(private pollingService: PollingService, notificationsService: NotificationsService) {
        this.ns = notificationsService;
    }

    ngOnInit() {
        this.pollingService.startPolling('notifications', this.destroy$);
        this.pollingService.subscribeToPollingService('notifications').subscribe(notifications => this.notifications = notifications);
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        // Now let's also unsubscribe from the subject itself
        this.destroy$.unsubscribe();
    }
}
