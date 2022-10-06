import { Injectable } from "@angular/core";
import { BlockItem } from "../models/block-item";
import { Point } from "../models/point";

@Injectable({
    providedIn: 'root'
})
export class AllocationService {
    cornerMargin: number = 250;
    sideMargin: number = 50;

    findClosestPosition(items: BlockItem[], item: BlockItem, layoutWidth: number, layoutHeight: number): Point | null {
        let closestPoints: any[] = [];

        items.forEach(a => {
            let closestPoint = this.getClosestCorner(a, item);
            if (closestPoint.min <= this.cornerMargin)
                closestPoints.push(closestPoint);
        });

        items.forEach(a => {
            let closestPoint = this.getClosestLineIntersection(a, item);
            if (closestPoint && closestPoint.min <= this.sideMargin)
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
        if (!closestPoint)
            return false;

        if (closestPoint.point.x < 0 || closestPoint.point.y < 0)
            return false;

        if (closestPoint.point.x + item.width > layoutWidth || closestPoint.point.y + item.height > layoutHeight)
            return false;

        return true;
    }

    getClosestLineIntersection(a: BlockItem, b: BlockItem): any {
        let center = new Point(b.topLeftPoint.x + b.width / 2, b.topLeftPoint.y + b.height / 2);
        let left = this.getClosestLeftPoint(a, center, b);
        let right = this.getClosestRightPoint(a, center, b);
        let top = this.getClosestTopPoint(a, center, b);
        let bottom = this.getClosestBottomPoint(a, center, b);

        let leftDistance = left ? this.calculateDistance(left, b.topLeftPoint) : null;
        let rightDistance = right ? this.calculateDistance(new Point(right.x + b.width, right.y), b.topRightPoint) : null;
        let topDistance = top ? this.calculateDistance(top, b.topLeftPoint) : null;
        let bottomDistance = bottom ? this.calculateDistance(new Point(bottom.x, bottom.y + b.height), b.bottomLeftPoint) : null;

        let min = Math.min(leftDistance ?? 9999, rightDistance ?? 9999, topDistance ?? 9999, bottomDistance ?? 9999);
        if (min == 9999)
            return null;

        switch (min) {
            case leftDistance: return { min, point: left, side: 'left' };
            case rightDistance: return { min, point: right, side: 'right' };
            case topDistance: return { min, point: top, side: 'top' };
            case bottomDistance: return { min, point: bottom, side: 'bottom' };
        }
    }

    getClosestLeftPoint(a: BlockItem, center: Point, b: BlockItem) {
        if (center.y > a.bottomRightPoint.y || center.y < a.topRightPoint.y)
            return null;

        return new Point(a.topRightPoint.x, b.topLeftPoint.y);
    }

    getClosestRightPoint(a: BlockItem, center: Point, b: BlockItem) {
        if (center.y > a.bottomLeftPoint.y || center.y < a.topLeftPoint.y)
            return null;

        return new Point(a.topLeftPoint.x - b.width, b.topLeftPoint.y);
    }

    getClosestTopPoint(a: BlockItem, center: Point, b: BlockItem) {
        if (center.x > a.bottomRightPoint.x || center.x < a.bottomLeftPoint.x)
            return null;

        return new Point(b.topLeftPoint.x, a.bottomLeftPoint.y);
    }

    getClosestBottomPoint(a: BlockItem, center: Point, b: BlockItem) {
        if (center.x > a.topRightPoint.x || center.x < a.topLeftPoint.x)
            return null;

        return new Point(b.bottomLeftPoint.x, a.topLeftPoint.y - b.height);
    }

    getClosestCorner(a: BlockItem, b: BlockItem): any {
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
