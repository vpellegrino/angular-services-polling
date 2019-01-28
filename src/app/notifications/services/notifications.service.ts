/**
 * Created by vpellegr on 20/07/2018.
 */

import * as moment from 'moment';
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Notification} from "../models/notification";
import {Observable, of} from "rxjs";
import {Service} from "../../polling/models/service";

@Injectable()
export class NotificationsService {

    private readonly notificationIconMap: object;
    private mockedNotifications: Notification[];
    private responsesUrl: string = 'http://localhost:3000/';

    constructor(private http: HttpClient) {
        moment.locale('it');
        this.notificationIconMap = { APP: 'fa-calendar-check-o', USR: 'fa-user-o', REQ: 'fa-paper-plane-o'};
        this.http.get(this.responsesUrl + 'notifications')
            .subscribe((notifications: Notification[]) => this.mockedNotifications = notifications);
    }

    /**
     * Appends a mocked notification, by calling the REST API
     * Used to simulate the usual notification flow on a web-app
     */
    public appendMockedNotification() {
        const createDate: string = moment.utc().format(Service.dateFormat);
        const mockedNotification = Notification.buildRandomNotification(createDate);
        this.http.post(this.responsesUrl + 'notifications', mockedNotification)
            .subscribe();
    }

    /**
     * Returns all notifications for the given application identifier
     * @return {Observable<Notification[]>}
     */
    public getNotifications(): Observable<Notification[]> {
        return of(this.mockedNotifications);
    }

    /**
     * It optimistically removes notification from the given list and it calls PATCH in order to update its status
     * @param {Notification[]} notifications - notification list
     * @param {string} notificationId - notification identifier
     */
    public markNotificationAsRead(notifications: Notification[], notificationId: string) {
        // Optimistic notification removal for a better user-experience (sometime PATCH could require too much time)
        notifications.splice(notifications.findIndex(notification => notification && notification.id === notificationId), 1);
    }

    /**
     * Returns notification icon class for this category
     * @param {string} category - notification category
     * @return {string}
     */
    public getNotificationIcon(category: string): string {
        return this.notificationIconMap[category] || 'fa-envelope-o';
    }

    /**
     * Returns human readable date distance
     * @param {string} createdAt - plain date
     * @return {string}
     */
    public displayNotificationAge(createdAt: string): string {
        return moment(createdAt, Service.dateFormat).fromNow()
    }

    /**
     * Returns the mark notification as read title
     * @return {string}
     */
    public getMarkNotificationAsReadTitle(): string {
        return 'Mark notification as read';
    }

}
