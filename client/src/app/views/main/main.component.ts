import { Component, OnInit, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { MdSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs/Observable';
import {
    PaginationServerResponse, TrackData
} from '../../components/pagination/pagination.component';
import { ChartData } from '../../components/chart/chart.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

interface ListData {
    name: string;
    id: number;
}

const URL: string = API_URL;

@Component({
    selector:    'main-view',
    templateUrl: 'main.component.html',
    styleUrls:   ['main.component.scss']
})
export class MainViewComponent implements OnInit {

    public chartData: Observable<ChartData[]>;
    public mainData: Observable<ListData[]>;
    public paginationData: Observable<PaginationServerResponse<TrackData>>;
    public loading: boolean;

    public set selected(i: number) {
        this._selected = i;
        this.onListItemClick();
    }

    public get selected() {
        return this._selected;
    }

    @ViewChild('right') public right: MdSidenav;
    @ViewChild('left') public left: MdSidenav;

    private _selected: number;

    constructor(private http: Http) {
    }

    public ngOnInit() {
        this.loading = true;
        // Fix changes sidenav change issue
        setTimeout(() => {
            this.left.open();
            this.left.disableClose = true;
        }, 1000);
        this.mainData = this.http.get(`${URL}genre/`)
        .map((res: Response): ListData[] => res.json())
        .do(() => {
            this.loading = false;
        });
    }

    public onDetailsClick() {
        this.loading = true;

        this.right.open();
        this.paginationData = this.http.get(`${URL}track/?genre=${this._selected}`)
        .map((res: Response): PaginationServerResponse<TrackData> => res.json())
        .do(() => {
            this.loading = false;
        });
    }

    public onListItemClick() {
        this.loading = true;
        this.chartData = this.http.get(`${URL}avg/?genre=${this._selected}`)
        .map((res: Response): ChartData[] => res.json()
            .map((data): ChartData =>
                ({ label: data.album__artist__name, millis: data.duration__avg }))
        )
        .do(() => {
            this.loading = false;
        });
    }
}
