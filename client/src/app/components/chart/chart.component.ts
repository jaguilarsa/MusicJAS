import {
    ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit,
    SimpleChanges, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';
import * as d3 from 'd3';

export interface ChartData {
    millis: number;
    label: string;
}

export interface Margins {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

@Component({
    selector:        'chart',
    templateUrl:     'chart.component.html',
    styleUrls:       ['chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('chart') public chartContainer: ElementRef;

    @Input('data') public data: ChartData[];

    @Input('margin')
    public set margin(m: Margins) {
        this._margin = m;
        if (this.chart) {
            this.resize();
        }
    }

    private _margin = { top: 80, bottom: 80, left: 140, right: 80 };

    private subs: Subscription[] = [];

    private width: number;
    private height: number;
    private colors: any;

    private xScale: any;
    private yScale: any;

    private xDomain: number[];
    private yDomain: string[];

    private chart: any;
    private xAxis: any;
    private yAxis: any;
    private svg: any;

    public ngOnInit() {
        this.subs.push(Observable.fromEvent(window, 'resize')
        .debounceTime(100)
        .map(() => {
            if (this.data && this.chartContainer) {
                this.resize();
            }
        }).subscribe());
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (this.chartContainer && this.data) {
            if (this.chart) {
                this.update();
            } else {
                this.create();
            }
        }
    }

    public ngOnDestroy() {
        this.subs.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    private create() {

        this.setDomain();
        const element: HTMLDivElement = this.setSize();
        this.svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);

        // chart plot area
        this.chart = this.svg.append('g')
        .attr('class', 'bars')
        .attr('transform', `translate(${this._margin.left}, ${this._margin.top})`);

        // bar colors
        this.colors = d3.scaleLinear()
        .domain([0, this.data.length]).range(<any[]> ['lightblue', 'lightgrey']);

        // x & y axis
        this.xAxis = this.svg.append('g')
        .attr('class', 'axis axis-x')
        .attr('transform',
            `translate(${this._margin.left}, ${this._margin.top + this.height})`)
        .call(d3.axisBottom(this.xScale).tickFormat(d3.timeFormat('%M:%S')));

        this.yAxis = this.svg.append('g')
        .attr('class', 'axis axis-y')
        .attr('transform', `translate(${this._margin.left}, ${this._margin.top})`)
        .call(d3.axisLeft(this.yScale));
        this.update();
    }

    private setDomain() {
        this.xDomain = [0, +d3.max(this.data, (d: ChartData): number => d.millis)];
        this.yDomain = this.data.slice(0).map((d: ChartData): string => d.label);
    }

    private setSize(): HTMLDivElement {
        const element: HTMLDivElement = this.chartContainer.nativeElement;
        this.width = element.offsetWidth - this._margin.left - this._margin.right;
        this.height = element.offsetHeight - this._margin.top - this._margin.bottom;
        this.xScale = d3.scaleTime().domain(this.xDomain).range([0, this.width]);
        this.yScale = d3.scaleBand().padding(0.1).domain(this.yDomain).rangeRound([0, this.height]);
        return element;
    }

    private resize() {
        this.setDomain();
        const element: HTMLDivElement = this.setSize();
        this.svg = this.svg
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);

        this.xAxis = this.xAxis
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', `translate(${this._margin.left}, ${this._margin.top + this.height})`)
        .call(d3.axisBottom(this.xScale).tickFormat(d3.timeFormat('%M:%S')));

        this.yAxis = this.yAxis
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', `translate(${this._margin.left}, ${this._margin.top})`)
        .call(d3.axisLeft(this.yScale));
        this.updateBars();
    }

    private updateBars() {
        const update = this.chart.selectAll('.bar')
        .data(this.data);

        // remove exiting bars
        update.exit().remove();

        // update existing bars
        this.chart.selectAll('.bar').transition()
        .attr('x', 0)
        .attr('y', (d) => this.yScale(d.label))
        .attr('width', (d: ChartData) => this.xScale(d.millis))
        .attr('height', (d: ChartData) => this.yScale.bandwidth())
        .style('fill', (d, i) => this.colors(i));
        return update;
    }

    private update() {
        this.setDomain();
        // update scales & axis
        this.xScale.domain(this.xDomain);
        this.yScale.domain(this.yDomain);
        this.colors.domain([0, this.data.length]);
        this.xAxis.transition().call(d3.axisBottom(this.xScale).tickFormat(d3.timeFormat('%M:%S')));
        this.yAxis.transition().call(d3.axisLeft(this.yScale));

        const update = this.updateBars();

        // add new bars
        update
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', (d: ChartData) => this.yScale(d.label))
        .attr('width', 0)
        .attr('height', this.yScale.bandwidth())
        .style('fill', (d, i) => this.colors(i))
        .transition()
        .delay((d, i) => i * 10)
        .attr('y', (d: ChartData) => this.yScale(d.label))
        .attr('width', (d: ChartData) => this.xScale(d.millis));
    }
}
