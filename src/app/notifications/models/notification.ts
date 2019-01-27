/**
 * Created by vpellegr on 20/07/2018.
 */

import * as _ from 'lodash';

export class Notification {
    id: string;
    title: string;
    category: string;
    description: string;
    created_at: string;

    public constructor(id: string, title: string, category: string, description: string, created_at: string) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.created_at = created_at;
    }

    public static buildRandomNotification(createDate: string): Notification {
        const id: string = String(this.buildRandomString(2));
        const title: string = this.buildRandomString(6);
        const description: string = this.buildRandomString(15);
        return new Notification(id, title, 'APP', description, createDate);
    }

    private static buildRandomString(length: number): string {
        return _.times(length, () => _.random(35).toString(36)).join('');
    }
}
