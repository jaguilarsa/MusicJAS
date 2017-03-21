import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { MdSidenav } from '@angular/material/sidenav';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
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
    selector:        'main-view',
    templateUrl:     'main.component.html',
    styleUrls:       ['main.component.scss']
})
export class MainViewComponent implements AfterViewInit, OnInit {

    public chartData: Observable<any[]>;
    public mainData: Observable<ListData[]>;
    public listData: Observable<TrackData[]>;

    @ViewChild('right') private right: MdSidenav;
    @ViewChild('left') private left: MdSidenav;

    constructor(private http: Http) {
    }

    public ngAfterViewInit() {
        console.log('Run View');
        setTimeout(this.left.open(), 1000);
    }

    public ngOnInit() {
        this.mainData = this.http.get(`${API_URL}genre/`)
        .map((res: Response): ListData[] => res.json());
    }

    public onClick(id: string) {
        this.chartData = this.http.get(`${API_URL}avg/?genre=${id}`)
        .map((res: Response) => res.json()
            .map((data) => [data.album__artist__name, data.duration__avg])
        );
    }

}
