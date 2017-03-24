import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { MdListModule } from '@angular/material/list';
import { MdProgressCircleModule } from '@angular/material/progress-spinner';
import { MdGridListModule } from '@angular/material/grid-list';
import { Ng2PaginationModule } from 'ng2-pagination';
import { PaginationComponent } from './pagination.component';

@NgModule({
    imports:      [CommonModule, MdListModule, MdGridListModule, MdProgressCircleModule,
        Ng2PaginationModule
    ],
    providers:    [HttpModule],
    declarations: [PaginationComponent],
    exports:      [PaginationComponent]
})
export class PaginationModule {
}
