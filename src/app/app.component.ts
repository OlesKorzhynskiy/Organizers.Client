import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    @ViewChild('layoutDropZone', { read: ElementRef, static: true }) layoutDropZone!: ElementRef;

    listItems: Array<any> = [
        {
            name: "Cell block 1",
            image: "assets/block1.jpg",
            alt: "Empty cell block",
            type: "block1"
        },
        {
            name: "Cell block 2",
            image: "assets/block2.jpg",
            alt: "Empty cell block",
            type: "block2"
        },
        {
            name: "Cell block 3",
            image: "assets/block3.jpg",
            alt: "Empty cell block",
            type: "block3"
        },
        {
            name: "Cell block 4",
            image: "assets/block4.jpg",
            alt: "Empty cell block",
            type: "block4"
        },
        {
            name: "Cell block 1",
            image: "assets/block1.jpg",
            alt: "Empty cell block",
            type: "block5"
        },
        {
            name: "Cell block 2",
            image: "assets/block2.jpg",
            alt: "Empty cell block",
            type: "block6"
        },
        {
            name: "Cell block 3",
            image: "assets/block3.jpg",
            alt: "Empty cell block",
            type: "block7"
        },
        {
            name: "Cell block 4",
            image: "assets/block4.jpg",
            alt: "Empty cell block",
            type: "block8"
        },
        {
            name: "Cell block 1",
            image: "assets/block1.jpg",
            alt: "Empty cell block",
            type: "block9"
        },
        {
            name: "Cell block 2",
            image: "assets/block2.jpg",
            alt: "Empty cell block",
            type: "block10"
        },
        {
            name: "Cell block 3",
            image: "assets/block3.jpg",
            alt: "Empty cell block",
            type: "block11"
        },
        {
            name: "Cell block 4",
            image: "assets/block4.jpg",
            alt: "Empty cell block",
            type: "block12"
        },
        {
            name: "Cell block 1",
            image: "assets/block1.jpg",
            alt: "Empty cell block",
            type: "block13"
        },
        {
            name: "Cell block 2",
            image: "assets/block2.jpg",
            alt: "Empty cell block",
            type: "block14"
        },
        {
            name: "Cell block 3",
            image: "assets/block3.jpg",
            alt: "Empty cell block",
            type: "block15"
        },
        {
            name: "Cell block 4",
            image: "assets/block4.jpg",
            alt: "Empty cell block",
            type: "block16"
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

        item.placholderTop = this.getTopPosition();
        item.placholderLeft = this.getLeftPosition();
    }

    getTopPosition() {
        let positionY = this.pointerPosition.y - this.pointerShiftY;
        return (positionY - this.layoutDropZone.nativeElement.getBoundingClientRect().top) + 'px';
    }

    getLeftPosition() {
        let positionX = this.pointerPosition.x - this.pointerShiftX;
        return (positionX - this.layoutDropZone.nativeElement.getBoundingClientRect().left) + 'px';
    }

    onMouseDown(event: any, element: any) {
        this.pointerShiftX = event.clientX - element.getBoundingClientRect().left;
        this.pointerShiftY = event.clientY - element.getBoundingClientRect().top;
    }

    dropOnLayout(event: any) {
        if (event.previousContainer.id == "items-drop-list") {
            event.item.data.top = this.getTopPosition();
            event.item.data.left = this.getLeftPosition();
            this.addLayoutItem({ ...event.item.data }, event.currentIndex);
        } else if (event.previousContainer === event.container) {
            let item = this.layoutItems.find(t => t == event.item.data);
            item.top = this.getTopPosition();
            item.left = this.getLeftPosition();
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
