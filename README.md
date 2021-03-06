# Angular Services Polling

This project represents a Proof of Concept about realizing a centralized Polling service, in Angular 2+, by using Reactive Programming tools (RxJS - https://rxjs-dev.firebaseapp.com/).

## Scenario

The scenario I tried to simulate is the following: 

We have a principal `/services` endpoint which provides information about several services (e.g. notifications, appointments). This endpoint maps each business service to a proper version number, which is used to evaluate if we need to update its business service content, by downloading that information from a dedicated REST endpoint.

For example, after `X` seconds, `/services` endpoint returns a bigger version for the *notifications* service. Immediately, the `/notifications` endpoint gets called, and new notifications are retrieved and showed by the related angular component.

## Exposing mocked REST APIs

Mocked APIs are exposed through JSON Server (https://github.com/typicode/json-server), a smart utility which is able to expose REST API starting from a json file.

1. Install JSON Server
    
    `npm install -g json-server`
2. From project root folder, boot it
    
    `json-server rest-api/db.json`    

## Running the Application

1. Install the Angular CLI

    `npm install -g @angular/cli`
1. Run `npm install`
1. Run `npm start`

## Technical details

The angular service which is responsible to orchestrate all business services synchronization is `src/app/polling/services/polling.service.ts`.
This TypeScript class contains the aim of an injectable service which can be invoked by two methods:

1. `startPolling` it enables polling (if it not yet enabled) for an input service name.
1. `subscribeToPollingService` for the given service name, it subscribes to each update that will be available for it (e.g. new notifications)

An example of an end angular component which is using these two methods is `navbar-notifications.component.ts`.