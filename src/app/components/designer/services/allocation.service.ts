import { Injectable } from "@angular/core";
import { BlockItem } from "../../../models/block-item";
import { Point } from "../../../models/point";

@Injectable({
    providedIn: 'root'
})
export class AllocationService {
    sideMargin: number = 50;

    findClosestPosition(items: BlockItem[], item: BlockItem, previewZoneWidth: number, previewZoneHeight: number): Point | null {
        let closestPoints: any[] = [];
        let insideAnotherBlock = this.isInterceptOtherBlocks(item, items);

        items.forEach(existingItem => {
            let points = this.getClosestLineIntersection(item, existingItem);

            points.forEach((closestPoint: any) => {
                if (closestPoint && (insideAnotherBlock || closestPoint.distance <= this.sideMargin))
                    closestPoints.push(closestPoint);
            });
        });

        if (!closestPoints || closestPoints.length == 0)
            return null;

        closestPoints.sort((a, b) => a.distance - b.distance);

        for (let i = 0; i < closestPoints.length; i++) {
            let closestPoint = closestPoints[i];
            if (!this.isValid(closestPoint, item, previewZoneWidth, previewZoneHeight))
                continue;

            let blockItem = new BlockItem(closestPoint.point, item.width, item.height);
            if (this.isInterceptOtherBlocks(blockItem, items))
                continue;

            return closestPoint.point;
        }

        return null;
    }

    isValid(closestPoint: any, item: BlockItem, previewZoneWidth: number, previewZoneHeight: number): boolean {
        if (!closestPoint)
            return false;

        if (closestPoint.point.x < 0 || closestPoint.point.y < 0)
            return false;

        if (closestPoint.point.x + item.width > previewZoneWidth || closestPoint.point.y + item.height > previewZoneHeight)
            return false;

        return true;
    }

    isInterceptOtherBlocks(item: BlockItem, items: BlockItem[]): boolean {
        for (let i = 0; i < items.length; i++) {
            if (this.isIntercepts(item, items[i]))
                return true;
        }
        return false;
    }

    isIntercepts(a: BlockItem, b: BlockItem) : Boolean
    {
        if (a.topLeftPoint.x == b.topLeftPoint.x && a.topLeftPoint.y == b.topLeftPoint.y)
            return true;

        return !(a.topRightPoint.x <= b.topLeftPoint.x
            || a.topLeftPoint.x >= b.topRightPoint.x
            || a.topLeftPoint.y >= b.bottomLeftPoint.y
            || a.bottomLeftPoint.y <= b.topLeftPoint.y);
    }

    getClosestLineIntersection(item: BlockItem, existingItem: BlockItem): any {
        let itemCenter = this.getCenter(item);
        let existingItemCenter = this.getCenter(existingItem);

        let left = this.getClosestLeftSide(item, existingItem);
        let right = this.getClosestRightSide(item, existingItem);
        let top = this.getClosestTopSide(item, existingItem);
        let bottom = this.getClosestBottomSide(item, existingItem);

        let leftDistance = this.calculateDistance(left, item.topLeftPoint);
        let rightDistance = this.calculateDistance(new Point(right.x + item.width, right.y), item.topRightPoint);
        let topDistance = this.calculateDistance(top, item.topLeftPoint);
        let bottomDistance = this.calculateDistance(new Point(bottom.x, bottom.y + item.height), item.bottomLeftPoint);

        let closestPoints = [];

        if (leftDistance) {
            if (item.height > existingItem.height) {
                if (existingItemCenter.y < itemCenter.y) {
                    left.y = existingItem.topRightPoint.y;
                } else {
                    left.y = existingItem.bottomRightPoint.y - item.height;
                }
            } else {
                if (item.topRightPoint.y < existingItem.topLeftPoint.y) {
                    left.y = existingItem.topLeftPoint.y;
                }
                if (item.bottomRightPoint.y > existingItem.bottomLeftPoint.y) {
                    left.y = existingItem.bottomLeftPoint.y - item.height;
                }
            }

            let distance = this.calculateDistance(left, item.topLeftPoint);

            closestPoints.push({ min: leftDistance, distance, point: left, side: 'left' });
        }

        if (rightDistance) {
            if (item.height > existingItem.height) {
                if (existingItemCenter.y < itemCenter.y) {
                    right.y = existingItem.topLeftPoint.y;
                } else {
                    right.y = existingItem.bottomLeftPoint.y - item.height;
                }
            } else {
                if (right && item.topLeftPoint.y < existingItem.topRightPoint.y) {
                    right.y = existingItem.topRightPoint.y;
                }
                if (right && item.bottomLeftPoint.y > existingItem.bottomRightPoint.y) {
                    right.y = existingItem.bottomRightPoint.y - item.height;
                }
            }

            let distance = this.calculateDistance(new Point(right.x + item.width, right.y), item.topRightPoint);

            closestPoints.push({ min: rightDistance, distance, point: right, side: 'right' });
        }

        if (topDistance) {
            if (item.width > existingItem.width) {
                if (existingItemCenter.x < itemCenter.x) {
                    top.x = existingItem.bottomLeftPoint.x;
                } else {
                    top.x = existingItem.bottomRightPoint.x - item.width;
                }
            } else {
                if (item.topLeftPoint.x < existingItem.bottomLeftPoint.x) {
                    top.x = existingItem.bottomLeftPoint.x;
                }
                if (item.topRightPoint.x > existingItem.bottomRightPoint.x) {
                    top.x = existingItem.bottomRightPoint.x - item.width;
                }
            }

            let distance = this.calculateDistance(top, item.topLeftPoint);

            closestPoints.push({ min: topDistance, distance, point: top, side: 'top' });
        }

        if (bottomDistance) {
            if (item.width > existingItem.width) {
                if (existingItemCenter.x < itemCenter.x) {
                    bottom.x = existingItem.topLeftPoint.x;
                } else {
                    bottom.x = existingItem.topRightPoint.x - item.width;
                }
            } else {
                if (item.bottomLeftPoint.x < existingItem.topLeftPoint.x) {
                    bottom.x = existingItem.topLeftPoint.x;
                }
                if (item.bottomRightPoint.x > existingItem.topRightPoint.x) {
                    bottom.x = existingItem.topRightPoint.x - item.width;
                }
            }

            let distance = this.calculateDistance(new Point(bottom.x, bottom.y + item.height), item.bottomLeftPoint);

            closestPoints.push({ min: bottomDistance, distance, point: bottom, side: 'bottom' });
        }

        return closestPoints;
    }

    getClosestLeftSide(item: BlockItem, existingItem: BlockItem) {
        return new Point(existingItem.topRightPoint.x, item.topLeftPoint.y);
    }

    getClosestRightSide(item: BlockItem, existingItem: BlockItem) {
        return new Point(existingItem.topLeftPoint.x - item.width, item.topLeftPoint.y);
    }

    getClosestTopSide(item: BlockItem, existingItem: BlockItem) {
        return new Point(item.topLeftPoint.x, existingItem.bottomLeftPoint.y);
    }

    getClosestBottomSide(item: BlockItem, existingItem: BlockItem) {
        return new Point(item.bottomLeftPoint.x, existingItem.topLeftPoint.y - item.height);
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
