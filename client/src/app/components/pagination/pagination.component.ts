import { ChangeDetectionStrategy, Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

export interface PaginationServerResponse<T> {
    count: number;
    next: string;
    previous: string;
    results: T[];
}

export interface Data {
    id: number;
    name: string;
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
    selector:        'pagination',
    templateUrl:     'pagination.component.html',
    styleUrls:       ['pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnChanges {

    public asyncData: Observable<PaginationServerResponse<TrackData>>;
    public page: number;
    public count: number;
    public loading: boolean;

    @Input('data') public data: PaginationServerResponse<TrackData>;
    constructor(private http: Http) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.loading = true;
        if ((<any> changes).data.currentValue) {
            this.count = this.data.count;
            this.asyncData = Observable.of(this.data)
            .do((res) => {
                this.count = res.count;
                this.page = 1;
                this.loading = false;
            });
        }
    }

    public getPage(page: number) {
        if (/page=\d+$/.test(this.data.next || this.data.previous)) {
            this.loading = true;
            this.asyncData = this.http.get((this.data.next || this.data.previous)
            .split('=').slice(0, -1).concat([`${page}`]).join('='))
            .map((res): PaginationServerResponse<TrackData> => res.json())
            .do(() => {
                this.page = page;
                this.loading = false;
            });
        } else {
            console.error('Expected page parameter at last position in server response next url');
        }
    }
}
