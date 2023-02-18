import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BlockItem } from 'src/app/models/block-item';
import { Point } from 'src/app/models/point';
import { AllocationService } from 'src/app/components/designer/services/allocation.service';
import { BoundingLineService } from './services/bounding-line.service';

@Component({
    selector: 'app-designer',
    templateUrl: './designer.component.html',
    styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit {
    @ViewChild('previewDropZone', { read: ElementRef, static: true }) previewDropZone!: ElementRef;

    constructor(private allocationService: AllocationService,
        private boundingLineService: BoundingLineService, private router: Router) {

    }
    ngOnInit(): void {
        this.updateBoundingLines();
    }

    menuItems: Array<any> = [
        {
            name: "Cell 5x5",
            title: "Блок 5x5",
            image: "assets/blocks/C5x5.png",
            alt: "Cell 5x5",
            type: "Cell5x5",
            width: 50,
            height: 50,
            menuItemWidth: 40,
            menuItemHeight: 40,
            price: 75
        },
        {
            name: "Cell 10x5",
            title: "Блок 10x5",
            image: "assets/blocks/C10x5.png",
            alt: "Cell 10x5",
            type: "Cell10x5",
            width: 100,
            height: 50,
            menuItemWidth: 75,
            menuItemHeight: 40,
            price: 150
        },
        {
            name: "Cell 10x10",
            title: "Блок 10x10",
            image: "assets/blocks/C10x10.png",
            alt: "Cell 10x10",
            type: "Cell10x10",
            width: 100,
            height: 100,
            menuItemWidth: 75,
            menuItemHeight: 75,
            price: 175
        },
        {
            name: "Cell 10x10 grid",
            title: "Блок 10x10 грід",
            image: "assets/blocks/C10x10grid.png",
            alt: "Cell 10x10 grid",
            type: "Cell10x10grid",
            width: 100,
            height: 100,
            menuItemWidth: 75,
            menuItemHeight: 75,
            price: 225
        },
        {
            name: "Cell 15x5",
            title: "Блок 15x15",
            image: "assets/blocks/C15x5.png",
            alt: "Cell 15x5",
            type: "Cell15x5",
            width: 150,
            height: 50,
            menuItemWidth: 87.5,
            menuItemHeight: 40,
            price: 175
        },
        {
            name: "Cell 20x10",
            title: "Блок 20x10",
            image: "assets/blocks/C20x10.png",
            alt: "Cell 20x10",
            type: "Cell20x10",
            width: 200,
            height: 100,
            menuItemWidth: 100,
            menuItemHeight: 75,
            price: 200
        },
        {
            name: "Cell 20x20 grid",
            title: "Блок 20x20 грід",
            image: "assets/blocks/C20x20grid.png",
            alt: "Cell 20x20 grid",
            type: "Cell20x20grid",
            width: 200,
            height: 200,
            menuItemWidth: 100,
            menuItemHeight: 100,
            price: 250
        },
        {
            name: "Squeezebox 5x5",
            title: "Блок 5x5 гармошка",
            image: "assets/blocks/S5x5.png",
            alt: "Squeezebox 5x5",
            type: "Squeezebox5x5",
            width: 50,
            height: 50,
            menuItemWidth: 40,
            menuItemHeight: 40,
            price: 75
        },
        {
            name: "Squeezebox 10x5",
            title: "Блок 10x5 гармошка",
            image: "assets/blocks/S10x5.png",
            alt: "Squeezebox 10x5",
            type: "Squeezebox10x5",
            width: 50,
            height: 100,
            menuItemWidth: 40,
            menuItemHeight: 75,
            price: 150
        },
        {
            name: "Squeezebox 10x10",
            title: "Блок 10x10 гармошка",
            image: "assets/blocks/S10x10.png",
            alt: "Squeezebox 10x10",
            type: "Squeezebox10x10",
            width: 100,
            height: 100,
            menuItemWidth: 75,
            menuItemHeight: 75,
            price: 75
        },
        {
            name: "Squeezebox 20x10",
            title: "Блок 20x10 гармошка",
            image: "assets/blocks/S20x10.png",
            alt: "Squeezebox 20x10",
            type: "Squeezebox20x10",
            width: 100,
            height: 200,
            menuItemWidth: 75,
            menuItemHeight: 100,
            price: 175
        },
        {
            name: "Wave 5x15 twin",
            title: "Блок 5x15 хвиля",
            image: "assets/blocks/W5x15twin.png",
            alt: "Wave 5x15 twin",
            type: "Wave5x15 twin",
            width: 50,
            height: 150,
            menuItemWidth: 40,
            menuItemHeight: 87.5,
            price: 225
        },
        {
            name: "Wave 5x25 twin",
            title: "Блок 5x25 хвиля",
            image: "assets/blocks/W5x25twin.png",
            alt: "Wave 5x25 twin",
            type: "Wave5x25 twin",
            width: 50,
            height: 250,
            menuItemWidth: 40,
            menuItemHeight: 112.5,
            price: 225
        },
        {
            name: "Wave 5x30",
            title: "Блок 5x30 хвиля",
            image: "assets/blocks/W5x30.png",
            alt: "Wave 5x30",
            type: "Wave5x30",
            width: 50,
            height: 300,
            menuItemWidth: 40,
            menuItemHeight: 125,
            price: 250
        }
    ];
    previewItems: Array<any> = [];

    pointerPosition: any;
    pointerShiftX: any;
    pointerShiftY: any;
    draggingItem: any| undefined = undefined;
    draggingMode: boolean = false;
    menuItemsHovered: boolean = false;

    price = 0;
    priceInteger = 0;
    priceDecimal = 0;

    checkout() {
        localStorage.setItem('checkout-items', JSON.stringify(this.previewItems));
        this.router.navigate(['checkout']);
    }

    moved(event: CdkDragMove, item: any) {
        this.pointerPosition = event.pointerPosition;

        item.placholderTop = this.getPlaceholderTopPosition();
        item.placholderLeft = this.getPlaceholderLeftPosition();

        let blockItems = this.previewItems.filter(i => i != item).map(item => new BlockItem(new Point(parseInt(item.left), parseInt(item.top)), item.width, item.height));
        let blockItem = new BlockItem(new Point(parseInt(item.placholderLeft), parseInt(item.placholderTop)), item.width, item.height);
        let newPosition = this.allocationService.findClosestPosition(blockItems, blockItem, this.previewDropZone.nativeElement.offsetWidth, this.previewDropZone.nativeElement.offsetHeight);

        if (newPosition) {
            item.placholderTop = newPosition.y + 'px';
            item.placholderLeft = newPosition.x + 'px';
        }
    }

    getPlaceholderTopPosition() {
        let absoluteY = this.pointerPosition.y - this.pointerShiftY;
        let itemY = absoluteY - this.previewDropZone.nativeElement.getBoundingClientRect().top;
        return itemY + 'px';
    }

    getPlaceholderLeftPosition() {
        let absoluteX = this.pointerPosition.x - this.pointerShiftX;
        let itemX = absoluteX - this.previewDropZone.nativeElement.getBoundingClientRect().left;
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
        if (item.rotated)
            item.image = item.image.replace('blocks', 'blocks/rotated')
        else
            item.image = item.image.replace('/rotated', '');

        this.updateBoundingLines();
    }

    swapDimensions(a: any, b: any) {
        let temp = a.width;
        a.width = b.height;
        b.height = temp;
    }

    dropOnPreview(event: any) {
        if (event.previousContainer.id == "menu-items-drop-list") {
           this.dropOnPreviewFromMenu(event);
           return;
        }

        if (event.previousContainer === event.container) {
            this.moveOnPreview(event);
            return;
        }
    }

    dropOnPreviewFromMenu(event: any) {
        event.item.data.top = event.item.data.placholderTop;
        event.item.data.left = event.item.data.placholderLeft;
        let newItem = { ...event.item.data, hidden: true };
        this.addPreviewItem(newItem, event.currentIndex);

        setTimeout(() => {
            this.updateDesignerElement(newItem);
        });
    }

    moveOnPreview(event: any) {
        let index = this.previewItems.findIndex(t => t == event.item.data);
        let item = this.previewItems[index];

        item.top = item.placholderTop;
        item.left = item.placholderLeft;
        this.updateDesignerElement(item);
    }

    private updateDesignerElement(item: any) {
        let index = this.previewItems.findIndex(t => t == item);
        let id = 'block-item-' + index;
        let documentElement = document.getElementById(id);
        if (!documentElement)
            return;

        documentElement.style.top = item.placholderTop;
        documentElement.style.left = item.placholderLeft;
        item.hidden = false;

        this.updateBoundingLines();

        this.updatePrice();
    }

    dropOnMenuList(event: any) {
        if (event.previousContainer.id == "menu-items-drop-list") {
            return;
        }

        let index = this.previewItems.findIndex(item => item == event.item.data);
        this.previewItems.splice(index, 1);

        this.updateBoundingLines();
        this.updatePrice();
    }

    addPreviewItem(item: any, index: number) {
        this.previewItems.splice(index, 0, item);
    }

    dragStarted(element: any) {
        this.draggingItem = element;
        this.draggingMode = true;

        let previewItem = document.getElementsByClassName('cdk-drag-preview')[0] as any;
        previewItem.style.width = element.width + 'px';
        previewItem.style.height = element.height + 'px';

        let image = previewItem.querySelector('.block-item-image');
        image.style.width = element.width + 'px';
        image.style.height = element.height + 'px';
    }

    dragStopped() {
        this.draggingMode = false;
        this.draggingItem = undefined;
    }

    menuListEntered() {
        this.menuItemsHovered = true;
    }

    menuListExited() {
        this.menuItemsHovered = false;
    }

    updateBoundingLines() {
        let blockItems = this.previewItems.map(item => new BlockItem(new Point(parseInt(item.left), parseInt(item.top)), item.width, item.height));
        this.boundingLineService.calculateBoundingLines(blockItems);
    }

    updatePrice() {
        this.price = this.previewItems.reduce((sum, current) => sum + current.price, 0);
        this.priceInteger = Math.trunc(this.price);
        this.priceDecimal = this.price - this.priceInteger;
    }
}
