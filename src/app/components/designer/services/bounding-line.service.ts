import { Injectable } from "@angular/core";
import { BlockItem } from "src/app/models/block-item";
import { Point } from "src/app/models/point";

@Injectable({
    providedIn: 'root'
})
export class BoundingLineService {
    topLeftPoint: Point | null = null;
    width: number = 0;
    height: number = 0;

    calculateBoundingLines(items: BlockItem[]): void {
        if (!items.length) {
            this.topLeftPoint = null;
            return;
        }

        let smallestX = Math.min(...items.map(item => item.topLeftPoint.x));
        let largestX = Math.max(...items.map(item => item.topRightPoint.x));
        let smallestY = Math.min(...items.map(item => item.topLeftPoint.y));
        let largestY = Math.max(...items.map(item => item.bottomLeftPoint.y));

        this.topLeftPoint = new Point(smallestX, smallestY);
        this.width = largestX - smallestX;
        this.height = largestY - smallestY;
    }
}
