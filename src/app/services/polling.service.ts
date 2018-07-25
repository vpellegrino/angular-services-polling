/**
 * Created by vpellegr on 14/07/2018.
 */


import * as _ from 'lodash';
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
    private responsesUrl: string = 'assets/mocked-responses/';

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
            if (this.serviceShouldBeUpdated(service)) {
                this.retrieveServiceItems(service.name).
                subscribe(allItems => this.serviceSubjectMap.get(service.name).next(allItems));
                this.servicesVersionMap.set(service.name, service.version);
            }
        });
    }

    /**
     * Starts polling on services REST call
     * @param {number} applicationId - application identifier for which to start polling
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
     * @return {Observable<any>}
     */
    public getServices(): Observable<any> {
        return this.http.get(this.responsesUrl + 'services.json');
    }

    /**
     * Retrieves all items related to a particular service
     * @param {string} serviceName - service name to be called for retrieving related items (e.g. notifications)
     * @return {Observable<object>}
     */
    public retrieveServiceItems(serviceName: string): Observable<object> {
        return this.http.get(this.responsesUrl + serviceName + '.json');
    }

    /**
     * Provides subscribtion to polling service, in order to keep updated about the service of interest
     * @param {string} serviceName - the service of interest
     * @return {Observable<any>}
     */
    public subscribeToPollingService(serviceName: string): Observable<any> {
        if (!this.serviceSubjectMap.get(serviceName)) {
            this.serviceSubjectMap.set(serviceName, new Subject<any>());
        }
        return this.serviceSubjectMap.get(serviceName).asObservable();
    }
}
