import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

export interface PaginationServerResponse<T> {
    count: number;
    next: string;
    previous: string;
    results: T[]
}

export interface Data {
    id: number;
    name: string
}

export interface Album extends Data {
  artist: Data;
}

export interface TrackData {
   name: string;
   duration: number;
   album: Album;
}


@Component({
    selector: 'pagination',
    templateUrl: 'pagination.component.html',
    styleUrls: ['pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {

    @Input('data') data: PaginationServerResponse<TrackData>;
    asyncData: Observable<PaginationServerResponse<TrackData>>;
    page: number;
    count: number;
    loading: boolean;

    constructor(private http: Http) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.data) {
          this.asyncData = Observable.of(this.data);
        }
    }

    getPage(page: number) {
        this.loading = true;
        const reqPath = this.data.next? this.data.next.split('=').slice(-1).concat([`${page}`]).join('='): '';
        this.asyncData = this.http.get(reqPath)
        .map((res): PaginationServerResponse<TrackData> => res.json())
        .do((res) => {
            this.count = res.count;
            this.page = page;
            this.loading = false;
        })
    }




}