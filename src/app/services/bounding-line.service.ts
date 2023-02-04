import { Injectable } from "@angular/core";
import { BlockItem } from "../models/block-item";
import { Point } from "../models/point";

@Injectable({
    providedIn: 'root'
})
export class BoundingLineService {
    boundingLineMargin: number = 50;

    findBoundingLines(items: BlockItem[]): Point[] | null {
        if (items.length)
            return null;

        let smallestX = Math.min(...items.map(item => item.topLeftPoint.x));
        let smallestY = Math.min(...items.map(item => item.topLeftPoint.y));
        let largestY = Math.max(...items.map(item => item.bottomLeftPoint.y));

        return null;
    }
}
