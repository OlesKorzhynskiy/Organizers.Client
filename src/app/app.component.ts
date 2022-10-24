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

    moved(event: CdkDragMove, item: any) {
        this.pointerPosition = event.pointerPosition;

        item.placholderTop = this.getPlaceholderTopPosition();
        item.placholderLeft = this.getPlaceholderLeftPosition();

        let blockItems = this.layoutItems.filter(i => i != item).map(item => new BlockItem(new Point(parseInt(item.left), parseInt(item.top)), item.width, item.height));
        let blockItem = new BlockItem(new Point(parseInt(item.placholderLeft), parseInt(item.placholderTop)), item.width, item.height);
        let newPosition = this.allocationService.findClosestPosition(blockItems, blockItem, this.layoutDropZone.nativeElement.offsetWidth, this.layoutDropZone.nativeElement.offsetHeight);

        if (newPosition) {
            item.placholderTop = newPosition.y + 'px';
            item.placholderLeft = newPosition.x + 'px';
        }
    }

    getPlaceholderTopPosition() {
        let absoluteY = this.pointerPosition.y - this.pointerShiftY;
        let itemY = absoluteY - this.layoutDropZone.nativeElement.getBoundingClientRect().top;
        return itemY + 'px';
    }

    getPlaceholderLeftPosition() {
        let absoluteX = this.pointerPosition.x - this.pointerShiftX;
        let itemX = absoluteX - this.layoutDropZone.nativeElement.getBoundingClientRect().left;
        return itemX + 'px';
    }

    onMouseDown(event: any, element: any) {
        this.pointerShiftX = event.clientX - element.getBoundingClientRect().left;
        this.pointerShiftY = event.clientY - element.getBoundingClientRect().top;
    }

    rotate(item: any) {
        this.swapDimensions(item, item);

        item.rotated = item.rotated ? false : true;

        // TODO: replace with transform: rotate so the new image won't be loaded
        if (item.rotated) {
            item.image = item.image.replace('blocks', 'blocks/rotated')
        } else {
            item.image = item.image.replace('/rotated', '');
        }
    }

    swapDimensions(a: any, b: any) {
        let temp = a.width;
        a.width = b.height;
        b.height = temp;
    }

    dropOnLayout(event: any) {
        if (event.previousContainer.id == "items-drop-list") {
            event.item.data.top = event.item.data.placholderTop;
            event.item.data.left = event.item.data.placholderLeft;
            let newItem = { ...event.item.data, hidden: true };
            this.addLayoutItem(newItem, event.currentIndex);

            setTimeout(() => {
                this.updateDocument(newItem);
            });
        } else if (event.previousContainer === event.container) {
            let index = this.layoutItems.findIndex(t => t == event.item.data);
            let item = this.layoutItems[index];

            item.top = item.placholderTop;
            item.left = item.placholderLeft;
            this.updateDocument(item);
        }
    }

    updateDocument(item: any) {
        let index = this.layoutItems.findIndex(t => t == item);
        let id = 'layout-item-' + index;
        let documentElement = document.getElementById(id);
        if (!documentElement)
            return;

        documentElement.style.top = item.placholderTop;
        documentElement.style.left = item.placholderLeft;
        item.hidden = false;
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

        let previewItem = document.getElementsByClassName('cdk-drag-preview')[0] as any;
        previewItem.style.width = element.width + 'px';
        previewItem.style.height = element.height + 'px';

        let image = previewItem.querySelector('.item-image');
        image.style.width = element.width + 'px';
        image.style.height = element.height + 'px';
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
