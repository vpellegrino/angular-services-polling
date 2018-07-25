/**
 * Created by vpellegr on 20/07/2018.
 */

import {AfterViewChecked, Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Subject} from "rxjs";
import {Notification} from "./models/notification";
import {PopoverDirective} from "ngx-bootstrap";
import {NotificationsService} from "./services/notifications.service";
import {PollingService} from "./services/polling.service";

@Component({
    selector: 'app-root',
    template:
            `
        <div class="dropdown-menu dropdown-menu-right dropdown-menu-lg" *dropdownMenu aria-labelledby="simple-dropdown" (click)="$event.stopPropagation()">
            <ng-container *ngFor="let notification of notifications; let i=index">
                <ng-template #popTemplate>
                    {{notification.description}}
                </ng-template>
                <span><i class="fa" [ngClass]="ns.getNotificationIcon(notification.category)"></i>{{notification.title}}
                    <i (click)="ns.markNotificationAsRead(notifications, notification.id)" title="{{ns.getMarkNotificationAsReadTitle()}}" class="check-notification icon-check"></i>
                  </span>
                <small class="notification-age">{{ns.displayNotificationAge(notification.created_at)}}</small>
            </ng-container>
        </div>
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

export class AppComponent implements AfterViewChecked, OnInit, OnDestroy {

    private destroy$: Subject<boolean> = new Subject<boolean>();
    public notifications: Notification[];
    public ns: NotificationsService;

    @ViewChildren(PopoverDirective) popovers: QueryList<PopoverDirective>;

    constructor(private pollingService: PollingService, notificationsService: NotificationsService) {
        this.ns = notificationsService;
    }

    ngAfterViewChecked() {
        // dismiss other popovers, except the one that is showing now
        this.popovers.forEach((popover: PopoverDirective) => {
            popover.onShown.subscribe(() => {
                this.popovers
                    .filter(p => p !== popover)
                    .forEach(p => p.hide());
            });
        });
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
