import { Injectable } from "@angular/core";
import { BlockItem } from "../models/block-item";
import { Point } from "../models/point";

@Injectable({
    providedIn: 'root'
})
export class AllocationService {
    margin: number = 250;

    findClosestPosition(items: BlockItem[], item: BlockItem, layoutWidth: number, layoutHeight: number): Point | null {
        let closestPoints: any[] = [];

        items.forEach(a => {
            let closestPoint = this.getClosestPoint(a, item);
            if (closestPoint.min <= this.margin)
                closestPoints.push(closestPoint);
        });

        if (!closestPoints || closestPoints.length == 0)
            return null;

        closestPoints.sort((a, b) => a.min - b.min);

        for (let i = 0; i < closestPoints.length; i++) {
            let closestPoint = closestPoints[i];
            if (this.isValid(closestPoint, item, layoutWidth, layoutHeight))
                return closestPoint.point;
        }

        return null;
    }

    isValid(closestPoint: any, item: BlockItem, layoutWidth: number, layoutHeight: number): boolean {
        if (closestPoint.point.x < 0 || closestPoint.point.y < 0)
            return false;

        if (closestPoint.point.x + item.width > layoutWidth || closestPoint.point.y + item.height > layoutHeight)
            return false;

        return true;
    }

    getClosestPoint(a: BlockItem, b: BlockItem): any {
        let left = this.getLengthForLeftSide(a, b);
        let right = this.getLengthForRightSide(a, b);
        let top = this.getLengthForTopSide(a, b);
        let bottom = this.getLengthForBottomSide(a, b);

        let min = Math.min(left, right, top, bottom);

        switch (min) {
            case left: return { min, point: new Point(a.topLeftPoint.x - b.width, a.topLeftPoint.y), side: 'left' };
            case right: return { min, point: new Point(a.topRightPoint.x, a.topRightPoint.y), side: 'right' };
            case top: return { min, point: new Point(a.topLeftPoint.x, a.topLeftPoint.y - b.height), side: 'top' };
            case bottom: return { min, point: new Point(a.bottomLeftPoint.x, a.bottomLeftPoint.y), side: 'bottom' };
        }
    }

    getLengthForLeftSide(a: BlockItem, b: BlockItem) {
        let first = this.calculateDistance(a.topLeftPoint, b.topRightPoint);
        let second = this.calculateDistance(a.bottomLeftPoint, b.bottomRightPoint);
        return first + second;
    }

    getLengthForRightSide(a: BlockItem, b: BlockItem) {
        let first = this.calculateDistance(a.topRightPoint, b.topLeftPoint);
        let second = this.calculateDistance(a.bottomRightPoint, b.bottomLeftPoint);
        return first + second;
    }

    getLengthForTopSide(a: BlockItem, b: BlockItem) {
        let first = this.calculateDistance(a.topLeftPoint, b.bottomLeftPoint);
        let second = this.calculateDistance(a.topRightPoint, b.bottomRightPoint);
        return first + second;
    }

    getLengthForBottomSide(a: BlockItem, b: BlockItem) {
        let first = this.calculateDistance(a.bottomLeftPoint, b.topLeftPoint);
        let second = this.calculateDistance(a.bottomRightPoint, b.topRightPoint);
        return first + second;
    }

    calculateDistance(a: Point, b: Point): number {
        let x = Math.pow(b.x - a.x, 2);
        let y = Math.pow(b.y - a.y, 2);
        return Math.sqrt(x + y);
    }
}
