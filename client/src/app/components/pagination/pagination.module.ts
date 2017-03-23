import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { MdListModule } from '@angular/material/list';
import { MdProgressCircleModule } from '@angular/material/progress-spinner';
import { PaginationComponent } from './pagination.component';
import { Ng2PaginationModule } from 'ng2-pagination';

@NgModule({
    imports:      [CommonModule, MdListModule, MdProgressCircleModule, Ng2PaginationModule],
    providers:    [HttpModule],
    declarations: [PaginationComponent],
    exports:      [PaginationComponent]
})
export class PaginationModule {
}