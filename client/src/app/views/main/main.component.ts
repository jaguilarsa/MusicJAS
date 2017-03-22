import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MdSidenav } from '@angular/material/sidenav';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switch';
import 'rxjs/add/observable/fromPromise';

interface ListData {
    name: string;
    id: number;
}

interface TrackData {
    name: string;
    album: string;
    artist: string;
}

const API_URL: string = 'http://localhost:8000/';

@Component({
    selector:    'main-view',
    templateUrl: 'main.component.html',
    styleUrls:   ['main.component.scss']
})
export class MainViewComponent implements OnInit {

    public chartData: Observable<any[]>;
    public mainData: Observable<ListData[]>;
    public listData: Observable<TrackData[]>;

    public rows = [];
    public count: number = 0;
    public offset: number = 0;
    public limit: number = 10;

    @ViewChild('right') private right: MdSidenav;
    @ViewChild('left') private left: MdSidenav;

    constructor(private http: Http) {
    }

    public ngOnInit() {
        // Fix changes sidenav change issue
        setTimeout(this.left.open(), 1000);
        this.mainData = this.http.get(`${API_URL}genre/`)
        .map((res: Response): ListData[] => res.json());
        // this.page(this.offset, this.limit);
    }

    public onClick(id: string) {
        this.chartData = this.http.get(`${API_URL}avg/?genre=${id}`)
        .map((res: Response) => res.json()
            .map((data) => [data.album__artist__name, data.duration__avg])
        );
    }

    public page(offset, limit) {
        this.fetch((results) => {
            this.count = results.length;

            const start = offset * limit;
            const end = start + limit;
            const rows = [...this.rows];

            for (let i = start; i < end; i++) {
                rows[i] = results[i];
            }

            this.rows = rows;
            console.log('Page Results', start, end, rows);
        });
    }

    public fetch(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', API_URL + 'track/?genre=1');

        req.onload = () => {
            cb(JSON.parse(req.response));
        };

        req.send();
    }

    public onPage(event) {
        console.log('Page Event', event);
        this.page(event.offset, event.limit);
    }

}
