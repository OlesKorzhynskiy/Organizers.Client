import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    @ViewChild('dropZone', { read: ElementRef, static: true }) dropZone!: ElementRef;

    menu: Array<any> = [];
    table: Array<any> = [];
    _pointerPosition: any;
    _shiftX: any;
    _shiftY: any;
    transferringItem: any| undefined = undefined;
    block1: any = {};

    moved(event: CdkDragMove) {

        const fromLeftOfDraggedElement = event.pointerPosition.x - event.source.element.nativeElement.getBoundingClientRect().left;
        const fromTopOfDraggedElement = event.pointerPosition.y - event.source.element.nativeElement.getBoundingClientRect().top;

        const xRelativeToParent = event.pointerPosition.x - fromLeftOfDraggedElement - this.dropZone.nativeElement.getBoundingClientRect().left;
        const yRelativeToParent = event.pointerPosition.y - fromTopOfDraggedElement - this.dropZone.nativeElement.getBoundingClientRect().top;

        this._pointerPosition = { x: xRelativeToParent, y: yRelativeToParent };

        this._pointerPosition = event.pointerPosition;
    }

    onMouseDown(event: any, element: any) {
        this._shiftX = event.clientX - element.getBoundingClientRect().left;
        this._shiftY = event.clientY - element.getBoundingClientRect().top;
    }

    dropOnLayout(event: any) {
        let positionX = this._pointerPosition.x - this._shiftX;
        let positionY = this._pointerPosition.y - this._shiftY;

        if (event.previousContainer.id == "menu-drop-list") {
            event.item.data.top = (positionY - this.dropZone.nativeElement.getBoundingClientRect().top) + 'px'
            event.item.data.left = (positionX - this.dropZone.nativeElement.getBoundingClientRect().left) + 'px'
            this.addField({ ...event.item.data }, event.currentIndex);
        } else if (event.previousContainer === event.container) {
            let item = this.table.find(t => t == event.item.data)
            item.top = (positionY - this.dropZone.nativeElement.getBoundingClientRect().top) + 'px'
            item.left = (positionX - this.dropZone.nativeElement.getBoundingClientRect().left) + 'px'
        }

        this.transferringItem = undefined;
    }

    dropOnMenu(event: any) {
        if (event.previousContainer.id == "menu-drop-list") {
            return;
        }

        let index = this.table.findIndex(t => t == event.item.data);
        this.table.splice(index, 1);
    }

    addField(fieldType: string, index: number) {
        this.table.splice(index, 0, fieldType)
    }

    exited(event: any) {
        const currentIdx = event.container.data.findIndex(
            (f: any) => f.id === event.item.data.id
        );
        this.menu.splice(currentIdx + 1, 0, {
            ...event.item.data,
            temp: true,
        });
    }
    entered() {
        this.menu = this.menu.filter((f) => !f.temp);
    }

    dragStarted(event: any, element: any) {
        this.transferringItem = element;
    }

    dragStopped(event: any) {
        this.transferringItem = undefined;
    }
}
