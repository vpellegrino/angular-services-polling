/**
 * Created by vpellegr on 14/07/2018.
 */


import * as _ from 'lodash';
import * as moment from 'moment';
import {Injectable} from "@angular/core";
import {interval, Observable, Subject} from "rxjs";
import {Service} from "../models/service";
import {HttpClient} from "@angular/common/http";
import {startWith, switchMap, takeUntil} from "rxjs/operators";

@Injectable()
export class PollingService {

    private pollingInterval: any;
    private servicesVersionMap: Map<string, number>;
    private serviceSubjectMap: Map<string, Subject<any>>;
    private responsesUrl: string = 'http://localhost:3000/';

    constructor(private http: HttpClient) {
        this.servicesVersionMap = new Map<string, number>();
        this.serviceSubjectMap = new Map<string, Subject<any>>();
    }

    private serviceShouldBeUpdated(service: Service): boolean {
        if (service && service.name) {
            const serviceSubscribed: boolean = !!this.serviceSubjectMap.get(service.name);
            const previousServiceVersion: number = this.servicesVersionMap.get(service.name);
            const actualServiceVersion: number = service.version;
            const newServiceVersion: boolean = !previousServiceVersion || actualServiceVersion > previousServiceVersion;
            return serviceSubscribed && newServiceVersion;
        }
    }

    private checkServicesVersions(services: Service[]) {
        _.forEach(services, service => {
            const serviceName = service.name;
            const serviceVersion = service.version;
            if (this.serviceShouldBeUpdated(service)) {
                this.retrieveServiceItems(serviceName)
                    .subscribe(allItems => this.serviceSubjectMap.get(serviceName).next(allItems));
                this.servicesVersionMap.set(serviceName, serviceVersion);
            }
            this.simulateServiceUpdate(serviceName, serviceVersion);
        });
    }

    private simulateServiceUpdate(serviceName: string, serviceVersion: number) {
        const updateDate: string = moment.utc().format(Service.dateFormat);
        this.http.patch(this.responsesUrl+'services/'+serviceName, {"version": ++serviceVersion, "update_at": updateDate})
            .subscribe();
    }

    /**
     * Starts polling on services REST call
     * @param {string} serviceName - the service name
     * @param {Subject<boolean>} destroy$ - this parameter is bound to the component who started the polling (when it gets destroyed, polling stops)
     */
    public startPolling(serviceName: string, destroy$: Subject<boolean>) {
        destroy$.subscribe(destroyed => {
            if (destroyed) {
                // Resetting previous version for this service
                this.servicesVersionMap.delete(serviceName);
            }
        });
        this.pollingInterval = interval(30000)
                                .pipe(takeUntil(destroy$))
                                .pipe(startWith(0), switchMap(() => this.getServices()))
                                .subscribe(services => this.checkServicesVersions(services));
    }

    /**
     * It provides the list of services for the given application id
     * @return {Observable<object>}
     */
    public getServices(): Observable<any> {
        return this.http.get(this.responsesUrl + 'services');
    }

    /**
     * Retrieves all items related to a particular service
     * @param {string} serviceName - service name to be called for retrieving related items (e.g. notifications)
     * @return {Observable<object>}
     */
    public retrieveServiceItems(serviceName: string): Observable<object> {
        return this.http.get(this.responsesUrl + serviceName + '?_sort=created_at&_order=desc');
    }

    /**
     * Provides subscription to polling service, in order to keep updated about the service of interest
     * @param {string} serviceName - the service of interest
     * @return {Observable<object>}
     */
    public subscribeToPollingService(serviceName: string): Observable<any> {
        if (!this.serviceSubjectMap.get(serviceName)) {
            this.serviceSubjectMap.set(serviceName, new Subject<any>());
        }
        return this.serviceSubjectMap.get(serviceName).asObservable();
    }

}

