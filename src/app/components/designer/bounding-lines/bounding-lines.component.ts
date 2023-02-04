import { Component, OnInit } from '@angular/core';
import { BoundingLineService } from 'src/app/services/bounding-line.service';

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

    constructor(private boundingLineService: BoundingLineService) { }

    ngOnInit(): void {
    }
}
