import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { BlockItem } from './models/block-item';
import { Point } from './models/point';
import { AllocationService } from './services/allocation.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    @ViewChild('layoutDropZone', { read: ElementRef, static: true }) layoutDropZone!: ElementRef;

    constructor(private allocationService: AllocationService) {

    }

    listItems: Array<any> = [
        {
            name: "Cell 5x5",
            image: "assets/blocks/C5x5.png",
            alt: "Cell 5x5",
            type: "Cell5x5",
            width: 50,
            height: 50,
            menuItemWidth: 40,
            menuItemHeight: 40
        },
        {
            name: "Cell 10x5",
            image: "assets/blocks/C10x5.png",
            alt: "Cell 10x5",
            type: "Cell10x5",
            width: 100,
            height: 50,
            menuItemWidth: 75,
            menuItemHeight: 40
        },
        {
            name: "Cell 10x10",
            image: "assets/blocks/C10x10.png",
            alt: "Cell 10x10",
            type: "Cell10x10",
            width: 100,
            height: 100,
            menuItemWidth: 75,
            menuItemHeight: 75
        },
        {
            name: "Cell 10x10 grid",
            image: "assets/blocks/C10x10grid.png",
            alt: "Cell 10x10 grid",
            type: "Cell10x10grid",
            width: 100,
            height: 100,
            menuItemWidth: 75,
            menuItemHeight: 75
        },
        {
            name: "Cell 15x5",
            image: "assets/blocks/C15x5.png",
            alt: "Cell 15x5",
            type: "Cell15x5",
            width: 150,
            height: 50,
            menuItemWidth: 87.5,
            menuItemHeight: 40
        },
        {
            name: "Cell 20x10",
            image: "assets/blocks/C20x10.png",
            alt: "Cell 20x10",
            type: "Cell20x10",
            width: 200,
            height: 100,
            menuItemWidth: 100,
            menuItemHeight: 75
        },
        {
            name: "Cell 20x20 grid",
            image: "assets/blocks/C20x20grid.png",
            alt: "Cell 20x20 grid",
            type: "Cell20x20grid",
            width: 200,
            height: 200,
            menuItemWidth: 100,
            menuItemHeight: 100
        },
        {
            name: "Squeezebox 5x5",
            image: "assets/blocks/S5x5.png",
            alt: "Squeezebox 5x5",
            type: "Squeezebox5x5",
            width: 50,
            height: 50,
            menuItemWidth: 40,
            menuItemHeight: 40
        },
        {
            name: "Squeezebox 10x5",
            image: "assets/blocks/S10x5.png",
            alt: "Squeezebox 10x5",
            type: "Squeezebox10x5",
            width: 100,
            height: 50,
            menuItemWidth: 75,
            menuItemHeight: 40
        },
        {
            name: "Squeezebox 10x10",
            image: "assets/blocks/S10x10.png",
            alt: "Squeezebox 10x10",
            type: "Squeezebox10x10",
            width: 100,
            height: 100,
            menuItemWidth: 75,
            menuItemHeight: 75
        },
        {
            name: "Squeezebox 20x10",
            image: "assets/blocks/S20x10.png",
            alt: "Squeezebox 20x10",
            type: "Squeezebox20x10",
            width: 200,
            height: 100,
            menuItemWidth: 100,
            menuItemHeight: 75
        },
        {
            name: "Wave 5x15 twin",
            image: "assets/blocks/W5x15twin.png",
            alt: "Wave 5x15 twin",
            type: "Wave5x15 twin",
            width: 50,
            height: 150,
            menuItemWidth: 40,
            menuItemHeight: 87.5
        },
        {
            name: "Wave 5x25 twin",
            image: "assets/blocks/W5x25twin.png",
            alt: "Wave 5x25 twin",
            type: "Wave5x25 twin",
            width: 50,
            height: 250,
            menuItemWidth: 40,
            menuItemHeight: 112.5
        },
        {
            name: "Wave 5x30",
            image: "assets/blocks/W5x30.png",
            alt: "Wave 5x30",
            type: "Wave5x30",
            width: 50,
            height: 300,
            menuItemWidth: 40,
            menuItemHeight: 125
        }
    ];
    layoutItems: Array<any> = [];

    pointerPosition: any;
    pointerShiftX: any;
    pointerShiftY: any;
    draggingItem: any| undefined = undefined;
    draggingMode: boolean = false;
    listItemsHovered: boolean = false;

    moved(event: CdkDragMove, item: any, isLayout: boolean = false) {
        this.pointerPosition = event.pointerPosition;

        item.placholderTop = this.getPlaceholderTopPosition(item, isLayout);
        item.placholderLeft = this.getPlaceholderLeftPosition(item, isLayout);

        let blockItems = this.layoutItems.filter(i => i != item).map(item => new BlockItem(new Point(parseInt(item.left), parseInt(item.top)), item.width, item.height));
        let blockItem = new BlockItem(new Point(parseInt(item.placholderLeft), parseInt(item.placholderTop)), item.width, item.height);
        let newPosition = this.allocationService.allocationPosition(blockItems, blockItem);

        if (newPosition) {
            item.placholderTop = newPosition.y + 'px';
            item.placholderLeft = newPosition.x + 'px';
        }
    }

    getPlaceholderTopPosition(item: any, isLayout: boolean) {
        let absoluteY = this.pointerPosition.y - this.pointerShiftY;
        let itemY = absoluteY - this.layoutDropZone.nativeElement.getBoundingClientRect().top;
        let placeholderShift = isLayout ? 0 : (item.height - item.menuItemHeight) / 2;
        return itemY - placeholderShift + 'px';
    }

    getPlaceholderLeftPosition(item: any, isLayout: boolean) {
        let absoluteX = this.pointerPosition.x - this.pointerShiftX;
        let itemX = absoluteX - this.layoutDropZone.nativeElement.getBoundingClientRect().left;
        let placeholderShift = isLayout ? 0 : (item.width - item.menuItemWidth) / 2;
        return itemX - placeholderShift + 'px';
    }

    onMouseDown(event: any, element: any) {
        this.pointerShiftX = event.clientX - element.getBoundingClientRect().left;
        this.pointerShiftY = event.clientY - element.getBoundingClientRect().top;
    }

    dropOnLayout(event: any) {
        if (event.previousContainer.id == "items-drop-list") {
            event.item.data.top = event.item.data.placholderTop;
            event.item.data.left = event.item.data.placholderLeft;
            this.addLayoutItem({ ...event.item.data }, event.currentIndex);
        } else if (event.previousContainer === event.container) {
            let item = this.layoutItems.find(t => t == event.item.data);
            item.top = item.placholderTop;
            item.left = item.placholderLeft;
        }
    }

    dropOnItemsList(event: any) {
        if (event.previousContainer.id == "items-drop-list") {
            return;
        }

        let index = this.layoutItems.findIndex(item => item == event.item.data);
        this.layoutItems.splice(index, 1);
    }

    addLayoutItem(item: any, index: number) {
        this.layoutItems.splice(index, 0, item);
    }

    dragStarted(element: any) {
        this.draggingItem = element;
        this.draggingMode = true;
    }

    dragStopped() {
        this.draggingMode = false;
        this.draggingItem = undefined;
    }

    itemsListEntered() {
        this.listItemsHovered = true;
    }

    itemsListExited() {
        this.listItemsHovered = false;
    }
}
