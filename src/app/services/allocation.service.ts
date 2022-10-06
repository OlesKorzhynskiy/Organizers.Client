import { Injectable } from "@angular/core";
import { BlockItem } from "../models/block-item";
import { Point } from "../models/point";

@Injectable({
    providedIn: 'root'
})
export class AllocationService {
    cornerMargin: number = 20;
    sideMargin: number = 50;

    findClosestPosition(items: BlockItem[], item: BlockItem, layoutWidth: number, layoutHeight: number): Point | null {
        let closestPoints: any[] = [];

        // items.forEach(a => {
        //     let closestPoint = this.getClosestCorner(a, item);
        //     if (closestPoint.min <= this.cornerMargin)
        //         closestPoints.push(closestPoint);
        // });

        items.forEach(a => {
            let closestPoint = this.getClosestLineIntersection(a, item);
            if (closestPoint && closestPoint.min <= this.sideMargin)
                closestPoints.push(closestPoint);
        });

        if (!closestPoints || closestPoints.length == 0)
            return null;

        closestPoints.sort((a, b) => a.distance - b.distance);

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
        let aCenter = this.getCenter(a);
        let bCenter = this.getCenter(b);

        let left = this.getClosestLeftPoint(a, b);
        let right = this.getClosestRightPoint(a, b);
        let top = this.getClosestTopPoint(a, b);
        let bottom = this.getClosestBottomPoint(a, b);

        let leftDistance = left ? this.calculateDistance(left, b.topLeftPoint) : null;
        let rightDistance = right ? this.calculateDistance(new Point(right.x + b.width, right.y), b.topRightPoint) : null;
        let topDistance = top ? this.calculateDistance(top, b.topLeftPoint) : null;
        let bottomDistance = bottom ? this.calculateDistance(new Point(bottom.x, bottom.y + b.height), b.bottomLeftPoint) : null;

        let min = Math.min(leftDistance ?? 9999, rightDistance ?? 9999, topDistance ?? 9999, bottomDistance ?? 9999);
        if (min == 9999)
            return null;

        switch (min) {
            case leftDistance: {
                if (!left)
                    throw new Error('left can not be empty');

                if (b.height > a.height) {
                    if (aCenter.y < bCenter.y) {
                        left.y = a.topRightPoint.y;
                    } else {
                        left.y = a.bottomRightPoint.y - b.height;
                    }
                } else {
                    if (b.topRightPoint.y < a.topLeftPoint.y) {
                        left.y = a.topLeftPoint.y;
                    }
                    if (b.bottomRightPoint.y > a.bottomLeftPoint.y) {
                        left.y = a.bottomLeftPoint.y - b.height;
                    }
                }

                let distance = this.calculateDistance(left, b.topLeftPoint);

                return { min, distance, point: left, side: 'left' };
            }
            case rightDistance: {
                if (!right)
                    throw new Error('right can not be empty');

                if (b.height > a.height) {
                    if (aCenter.y < bCenter.y) {
                        right.y = a.topLeftPoint.y;
                    } else {
                        right.y = a.bottomLeftPoint.y - b.height;
                    }
                } else {
                    if (right && b.topLeftPoint.y < a.topRightPoint.y) {
                        right.y = a.topRightPoint.y;
                    }
                    if (right && b.bottomLeftPoint.y > a.bottomRightPoint.y) {
                        right.y = a.bottomRightPoint.y - b.height;
                    }
                }

                let distance = this.calculateDistance(new Point(right.x + b.width, right.y), b.topRightPoint);

                return { min, distance, point: right, side: 'right' };
            }
            case topDistance: {
                if (!top)
                    throw new Error('top can not be empty');

                if (b.width > a.width) {
                    if (aCenter.x < bCenter.x) {
                        top.x = a.bottomLeftPoint.x;
                    } else {
                        top.x = a.bottomRightPoint.x - b.width;
                    }
                } else {
                    if (b.topLeftPoint.x < a.bottomLeftPoint.x) {
                        top.x = a.bottomLeftPoint.x;
                    }
                    if (b.topRightPoint.x > a.bottomRightPoint.x) {
                        top.x = a.bottomRightPoint.x - b.width;
                    }
                }

                let distance = this.calculateDistance(top, b.topLeftPoint);

                return { min, distance, point: top, side: 'top' };
            }
            case bottomDistance: {
                if (!bottom)
                    throw new Error('bottom can not be empty');

                if (b.width > a.width) {
                    if (aCenter.x < bCenter.x) {
                        bottom.x = a.topLeftPoint.x;
                    } else {
                        bottom.x = a.topRightPoint.x - b.width;
                    }
                } else {
                    if (b.bottomLeftPoint.x < a.topLeftPoint.x) {
                        bottom.x = a.topLeftPoint.x;
                    }
                    if (b.bottomRightPoint.x > a.topRightPoint.x) {
                        bottom.x = a.topRightPoint.x - b.width;
                    }
                }

                let distance = this.calculateDistance(new Point(bottom.x, bottom.y + b.height), b.bottomLeftPoint);

                return { min, distance, point: bottom, side: 'bottom' };
            }
        }
    }

    getClosestLeftPoint(a: BlockItem, b: BlockItem) {
        if (b.topLeftPoint.y > a.bottomRightPoint.y || b.bottomLeftPoint.y < a.topRightPoint.y)
            return null;

        return new Point(a.topRightPoint.x, b.topLeftPoint.y);
    }

    getClosestRightPoint(a: BlockItem, b: BlockItem) {
        if (b.topRightPoint.y > a.bottomLeftPoint.y || b.bottomRightPoint.y < a.topLeftPoint.y)
            return null;

        return new Point(a.topLeftPoint.x - b.width, b.topLeftPoint.y);
    }

    getClosestTopPoint(a: BlockItem, b: BlockItem) {
        if (b.topRightPoint.x < a.bottomLeftPoint.x || b.topLeftPoint.x > a.bottomRightPoint.x)
            return null;

        return new Point(b.topLeftPoint.x, a.bottomLeftPoint.y);
    }

    getClosestBottomPoint(a: BlockItem, b: BlockItem) {
        if (b.bottomRightPoint.x < a.topLeftPoint.x || b.bottomLeftPoint.x > a.topRightPoint.x)
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

    getCenter(point: BlockItem) {
        return new Point(point.topLeftPoint.x + point.width / 2, point.topLeftPoint.y + point.height / 2);
    }
}
