import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdSidenavModule } from '@angular/material/sidenav';
import { MdListModule } from '@angular/material/list';
import { MainViewComponent } from './main.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { PaginationModule } from '../../components/pagination/pagination.module';

@NgModule({
    imports:      [CommonModule, MdSidenavModule, MdListModule, PaginationModule],
    declarations: [MainViewComponent, ChartComponent],
    exports:      [MainViewComponent]
})
export class MainViewModule {
}
