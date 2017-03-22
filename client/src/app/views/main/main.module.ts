import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdSidenavModule } from '@angular/material/sidenav';
import { MdListModule } from '@angular/material/list';
import { MainViewComponent } from './main.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { Angular2DataTableModule } from 'angular2-data-table';

@NgModule({
    imports:      [CommonModule, MdSidenavModule, MdListModule, Angular2DataTableModule],
    declarations: [MainViewComponent, ChartComponent],
    exports:      [MainViewComponent]
})
export class MainViewModule {
}
