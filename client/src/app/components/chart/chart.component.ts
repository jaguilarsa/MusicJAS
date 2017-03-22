import {
    Component, OnChanges, ViewChild, ElementRef, Input, ChangeDetectionStrategy, Inject, AfterViewInit, OnDestroy,
    SimpleChanges, OnInit
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import * as d3 from 'd3';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/do';
import { Subscription } from 'rxjs';

@Component({
    selector:        'chart',
    templateUrl:     'chart.component.html',
    styleUrls:       ['chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('chart') private chartContainer: ElementRef;
    @Input() private data;

    private resizeS: Subscription;

    private margin: any = { top: 80, bottom: 80, left: 160, right: 80 };
    private chart: any;
    private width: number;
    private height: number;
    private xScale: any;
    private yScale: any;
    private colors: any;
    private xAxis: any;
    private yAxis: any;
    private svg: any;

    public ngOnInit() {
        this.resizeS = Observable.fromEvent(window, 'resize').map(() => {
            if (this.data && this.chartContainer) {
                this.createChart();
                this.updateChart();
            }
        }).subscribe();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (this.chartContainer && changes.data.currentValue) {
            if (!this.chart) {
                this.createChart();
            }
            this.updateChart();
        }
    }

    public ngOnDestroy() {
        this.resizeS.unsubscribe();

    }

    private createChart() {
        const element = this.chartContainer.nativeElement;
        this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
        this.svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);

        // chart plot area
        this.chart = this.svg.append('g')
        .attr('class', 'bars')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // define X & Y domains
        let xDomain = [0, +d3.max(this.data, (d) => d[1])];
        let yDomain = this.data.slice(0).map((d) => d[0]);
        // create scales
        this.xScale = d3.scaleTime().domain(xDomain).range([this.width, 0]);
        this.yScale = d3.scaleBand().padding(0.1).domain(yDomain).rangeRound([0, this.height]);

        // bar colors
        this.colors = d3.scaleLinear()
        .domain([0, this.data.length]).range(<any[]> ['lightblue', 'lightgrey']);

        // x & y axis
        this.xAxis = this.svg.append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
        .call(d3.axisBottom(this.xScale).tickFormat(d3.timeFormat('%M:%S')));

        this.yAxis = this.svg.append('g')
        .attr('class', 'axis axis-y')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        .call(d3.axisLeft(this.yScale));
    }

    private resize() {
        let element = this.chartContainer.nativeElement;
        this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
        this.xAxis = this.xAxis
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
        this.yAxis = this.yAxis
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        this.chart.selectAll('.bar').transition()
        .attr('x', (d) => this.xScale(d[1]))
        .attr('y', (d) => this.yScale(d[0]))
        .attr('width', (d) => this.width - this.xScale(d[1]))
        .attr('height', (d) => this.yScale.bandwidth())
        .style('fill', (d, i) => this.colors(i));
        this.svg = this.svg
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);
    }

    private updateChart() {
        // update scales & axis
        this.xScale.domain([0, +d3.max(this.data, (d) => d[1])]);
        this.yScale.domain(this.data.slice(0).map((d) => d[0]));
        this.colors.domain([0, this.data.length]);
        this.xAxis.transition().call(d3.axisBottom(this.xScale).tickFormat(d3.timeFormat('%M:%S')));
        this.yAxis.transition().call(d3.axisLeft(this.yScale));

        let update = this.chart.selectAll('.bar')
        .data(this.data);

        // remove exiting bars
        update.exit().remove();

        // update existing bars
        this.chart.selectAll('.bar').transition()
        .attr('x', (d) => this.xScale(d[1]))
        .attr('y', (d) => this.yScale(d[0]))
        .attr('width', (d) => this.width - this.xScale(d[1]))
        .attr('height', (d) => this.yScale.bandwidth())
        .style('fill', (d, i) => this.colors(i));

        // add new bars
        update
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => this.xScale(d[1]))
        .attr('y', (d) => this.yScale(d[0]))
        .attr('width', 0)
        .attr('height', this.yScale.bandwidth())
        .style('fill', (d, i) => this.colors(i))
        .transition()
        .delay((d, i) => i * 10)
        .attr('y', (d) => this.yScale(d[0]))
        .attr('width', (d) => this.width - this.xScale(d[1]));
    }
}
