import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdCoreModule } from '@angular/material/core';
import { MdSidenavModule } from '@angular/material/sidenav';
import { MdListModule } from '@angular/material/list';
import { MdButtonModule } from '@angular/material/button';
import { MdProgressCircleModule } from '@angular/material/progress-spinner';
import { MainViewComponent } from './main.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { PaginationModule } from '../../components/pagination/pagination.module';

@NgModule({
    imports:      [CommonModule, MdCoreModule, MdSidenavModule, MdListModule, MdButtonModule, MdProgressCircleModule,
        PaginationModule],
    declarations: [MainViewComponent, ChartComponent],
    exports:      [MainViewComponent]
})
export class MainViewModule {
}
