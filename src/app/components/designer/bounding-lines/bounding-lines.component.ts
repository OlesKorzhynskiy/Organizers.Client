import { Component, OnInit } from '@angular/core';
import { AllocationService } from '../services/allocation.service';
import { BoundingLineService } from '../services/bounding-line.service';

@Component({
    selector: 'app-bounding-lines',
    templateUrl: './bounding-lines.component.html',
    styleUrls: ['./bounding-lines.component.scss']
})
export class BoundingLinesComponent implements OnInit {
    get left(): number{
        return this.boundingLineService.topLeftPoint?.x ?? 0;
    }

    get top(): number {
        return this.boundingLineService.topLeftPoint?.y ?? 0;
    }

    get width(): number {
        return this.boundingLineService.width;
    }

    get height(): number {
        return this.boundingLineService.height;
    }

    get showBoundingLines(): boolean {
        return this.boundingLineService.topLeftPoint != null;
    }

    get blockSizeRatio(): number {
        return this.allocationService.blockSizeRatio;
    }

    get boudingLinePadding(): number {
        return window.innerWidth > 992 ? 30 : 25;
    }

    constructor(private boundingLineService: BoundingLineService, private allocationService: AllocationService) { }

    ngOnInit(): void {
    }


}
