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
            name: "Cell 5x5",
            image: "assets/blocks/C5x5.png",
            alt: "Cell 5x5",
            type: "Cell5x5"
        },
        {
            name: "Cell 10x5",
            image: "assets/blocks/C10x5.png",
            alt: "Cell 10x5",
            type: "Cell10x5"
        },
        {
            name: "Cell 10x10",
            image: "assets/blocks/C10x10.png",
            alt: "Cell 10x10",
            type: "Cell10x10"
        },
        {
            name: "Cell 10x10 grid",
            image: "assets/blocks/C10x10grid.png",
            alt: "Cell 10x10 grid",
            type: "Cell10x10grid"
        },
        {
            name: "Cell 15x5",
            image: "assets/blocks/C15x5.png",
            alt: "Cell 15x5",
            type: "Cell15x5"
        },
        {
            name: "Cell 20x10",
            image: "assets/blocks/C20x10.png",
            alt: "Cell 20x10",
            type: "Cell20x10"
        },
        {
            name: "Cell 20x20 grid",
            image: "assets/blocks/C20x20grid.png",
            alt: "Cell 20x20 grid",
            type: "Cell20x20grid"
        },
        {
            name: "Squeezebox 5x5",
            image: "assets/blocks/S5x5.png",
            alt: "Squeezebox 5x5",
            type: "Squeezebox5x5"
        },
        {
            name: "Squeezebox 10x5",
            image: "assets/blocks/S10x5.png",
            alt: "Squeezebox 10x5",
            type: "Squeezebox10x5"
        },
        {
            name: "Squeezebox 10x10",
            image: "assets/blocks/S10x10.png",
            alt: "Squeezebox 10x10",
            type: "Squeezebox10x10"
        },
        {
            name: "Squeezebox 20x10",
            image: "assets/blocks/S20x10.png",
            alt: "Squeezebox 20x10",
            type: "Squeezebox20x10"
        },
        {
            name: "Wave 5x15 twin",
            image: "assets/blocks/W5x15twin.png",
            alt: "Wave 5x15 twin",
            type: "Wave5x15 twin"
        },
        {
            name: "Wave 5x25 twin",
            image: "assets/blocks/W5x25twin.png",
            alt: "Wave 5x25 twin",
            type: "Wave5x25 twin"
        },
        {
            name: "Wave 5x30",
            image: "assets/blocks/W5x30.png",
            alt: "Wave 5x30",
            type: "Wave5x30"
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
