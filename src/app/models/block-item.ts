import { Point } from "./point";

export class BlockItem {
    constructor(private point: Point, public width: number, public height: number) {
    }

    get topLeftPoint(): Point {
        return this.point;
    }

    get topRightPoint(): Point {
        return new Point(this.point.x + this.width, this.point.y);
    }

    get bottomLeftPoint(): Point {
        return new Point(this.point.x, this.point.y + this.height);
    }

    get bottomRightPoint(): Point {
        return new Point(this.point.x + this.width, this.point.y + this.height);
    }
}
