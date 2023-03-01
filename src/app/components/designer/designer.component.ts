import { CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockItem } from 'src/app/models/block-item';
import { Point } from 'src/app/models/point';
import { AllocationService } from 'src/app/components/designer/services/allocation.service';
import { BoundingLineService } from './services/bounding-line.service';
import { Subject, takeUntil } from 'rxjs';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';

@Component({
    selector: 'app-designer',
    templateUrl: './designer.component.html',
    styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('previewDropZone', { read: ElementRef, static: true }) previewDropZone!: ElementRef;
    @ViewChild(MatAccordion, { static: false }) matAccordion!: MatAccordion;
    @ViewChildren(MatExpansionPanel) expansionPanels!: QueryList<MatExpansionPanel>;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private allocationService: AllocationService, private router: Router,
        private route: ActivatedRoute, private boundingLineService: BoundingLineService) {
    }

    expandedGroupName: string | null = null;
    menuGroups: Array<any> = [];
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

    get blockSizeRatio(): number {
        return this.allocationService.blockSizeRatio;
    }

    ngOnInit(): void {
        this.updateBoundingLines();

        this.route.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe((params: any) => {
            this.expandedGroupName = params['expandedGroupName'] ?? null;

            if (this.expandedGroupName === null && window.innerWidth < 992)
                this.expandedGroupName = "Cells";

            if (window.innerWidth < 767)
                this.allocationService.blockSizeRatio = 0.75;
        });

        let component = this;
        this.menuGroups = [
            {
                name: "Cells", title: "Cells", items: [
                    {
                        name: "Cell 5x5",
                        title: "Блок 5x5",
                        image: "assets/blocks/C5x5.png",
                        alt: "Cell 5x5",
                        type: "Cell5x5",
                        defaultWidth: 50,
                        defaultHeight: 50,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
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
                        defaultWidth: 100,
                        defaultHeight: 50,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
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
                        defaultWidth: 100,
                        defaultHeight: 100,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
                        menuItemWidth: 75,
                        menuItemHeight: 75,
                        price: 175
                    },
                    {
                        name: "Cell 15x5",
                        title: "Блок 15x15",
                        image: "assets/blocks/C15x5.png",
                        alt: "Cell 15x5",
                        type: "Cell15x5",
                        defaultWidth: 150,
                        defaultHeight: 50,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
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
                        defaultWidth: 200,
                        defaultHeight: 100,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
                        menuItemWidth: 100,
                        menuItemHeight: 75,
                        price: 200
                    }
                ]
            },
            {
                name: "Squeezeboxes", title: "Squeezeboxes", items: [
                    {
                        name: "Squeezebox 5x5",
                        title: "Блок 5x5 гармошка",
                        image: "assets/blocks/S5x5.png",
                        alt: "Squeezebox 5x5",
                        type: "Squeezebox5x5",
                        defaultWidth: 50,
                        defaultHeight: 50,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
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
                        defaultWidth: 50,
                        defaultHeight: 100,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
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
                        defaultWidth: 100,
                        defaultHeight: 100,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
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
                        defaultWidth: 100,
                        defaultHeight: 200,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
                        menuItemWidth: 75,
                        menuItemHeight: 100,
                        price: 175
                    }
                ]
            },
            {
                name: "Waves", title: "Waves", items: [
                    {
                        name: "Wave 5x15 twin",
                        title: "Блок 5x15 хвиля",
                        image: "assets/blocks/W5x15twin.png",
                        alt: "Wave 5x15 twin",
                        type: "Wave5x15 twin",
                        defaultWidth: 50,
                        defaultHeight: 150,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
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
                        defaultWidth: 50,
                        defaultHeight: 250,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
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
                        defaultWidth: 50,
                        defaultHeight: 300,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
                        menuItemWidth: 40,
                        menuItemHeight: 125,
                        price: 250
                    }
                ]
            },
            {
                name: "Grids", title: "Grids", items: [
                    {
                        name: "Cell 20x20 grid",
                        title: "Блок 20x20 грід",
                        image: "assets/blocks/C20x20grid.png",
                        alt: "Cell 20x20 grid",
                        type: "Cell20x20grid",
                        defaultWidth: 200,
                        defaultHeight: 200,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
                        menuItemWidth: 100,
                        menuItemHeight: 100,
                        price: 250
                    },
                    {
                        name: "Cell 10x10 grid",
                        title: "Блок 10x10 грід",
                        image: "assets/blocks/C10x10grid.png",
                        alt: "Cell 10x10 grid",
                        type: "Cell10x10grid",
                        defaultWidth: 100,
                        defaultHeight: 100,
                        get width(): number {
                            let width = this.defaultWidth * component.allocationService.blockSizeRatio;
                            return Math.round(width / 5) * 5;
                        },
                        get height(): number {
                            let height = this.defaultHeight * component.allocationService.blockSizeRatio;
                            return Math.round(height / 5) * 5;
                        },
                        menuItemWidth: 75,
                        menuItemHeight: 75,
                        price: 225
                    }
                ]
            }
        ];

        this.initPreviewItems();
    }

    private initPreviewItems(): void {
        let previewItes = localStorage.getItem('preview-items');
        if (previewItes) {
            this.previewItems = JSON.parse(previewItes);
            this.updateBoundingLines();
            this.updatePrice();
        }
    }

    ngAfterViewInit(): void {
        this.matAccordion.multi = window.innerWidth > 992;
    }

    ngOnDestroy(): void {
        this.savePreviewItems();

        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.updateAccordionOnResize(event.target.innerWidth)
    }

    private updateAccordionOnResize(screenWidth: number): void {
        if (!this.matAccordion)
            return;

        if (screenWidth > 992) {
            this.matAccordion.multi = true;
            this.matAccordion.openAll();
        } else {
            this.matAccordion.multi = false;
            this.matAccordion.closeAll();

            this.expansionPanels.first.expanded = true;
        }
    }

    public increaseBlockSizeRatio() {
        let ratio = this.allocationService.blockSizeRatio + 0.25;
        this.changeBlockSizeRatio(ratio);
    }

    public decreaseBlockSizeRatio() {
        let ratio = this.allocationService.blockSizeRatio - 0.25;
        this.changeBlockSizeRatio(ratio);
    }

    public resetPreviewItems() {
        this.previewItems = [];

        this.updateBoundingLines();
        this.updatePrice();
    }

    private changeBlockSizeRatio(ratio: number) {
        let changeRatio = ratio / this.blockSizeRatio;

        for (let item of this.previewItems) {
            let left = parseFloat(item.left);
            let top = parseFloat(item.top);

            item.left = left * changeRatio + 'px';
            item.top = top * changeRatio + 'px';
            item.placholderLeft = item.left;
            item.placholderTop = item.top;
        }

        this.allocationService.blockSizeRatio = ratio;

        this.updateBoundingLines();
    }

    public checkout() {
        this.savePreviewItems();
        this.router.navigate(['checkout']);
    }

    private savePreviewItems(): void {
        localStorage.setItem('preview-items', JSON.stringify(this.previewItems));
    }

    public moved(event: CdkDragMove, item: any) {
        this.pointerPosition = event.pointerPosition;

        item.placholderTop = this.getPlaceholderTopPosition();
        item.placholderLeft = this.getPlaceholderLeftPosition();

        let newPosition = this.findClosestPosition(item);
        if (newPosition) {
            item.placholderTop = newPosition.y + 'px';
            item.placholderLeft = newPosition.x + 'px';
        }
    }

    private findClosestPosition(item: any) : Point | null {
        let blockItems = this.previewItems.filter(i => i != item).map(item => new BlockItem(new Point(parseFloat(item.left), parseFloat(item.top)), item.width, item.height));
        let blockItem = new BlockItem(new Point(parseFloat(item.placholderLeft), parseFloat(item.placholderTop)), item.width, item.height);
        return this.allocationService.findClosestPosition(blockItems, blockItem, this.previewDropZone.nativeElement.offsetWidth, this.previewDropZone.nativeElement.offsetHeight);
    }

    private getPlaceholderTopPosition() {
        let absoluteY = this.pointerPosition.y - this.pointerShiftY;
        let itemY = absoluteY - this.previewDropZone.nativeElement.getBoundingClientRect().top;
        return itemY + 'px';
    }

    private getPlaceholderLeftPosition() {
        let absoluteX = this.pointerPosition.x - this.pointerShiftX;
        let itemX = absoluteX - this.previewDropZone.nativeElement.getBoundingClientRect().left;
        return itemX + 'px';
    }

    public onMouseDown(event: any, element: any) {
        this.pointerShiftX = event.clientX - element.getBoundingClientRect().left;
        this.pointerShiftY = event.clientY - element.getBoundingClientRect().top;
    }

    public onTouchStart(event: any, element: any) {
        this.pointerShiftX = event.touches[0].clientX - element.getBoundingClientRect().left;
        this.pointerShiftY = event.touches[0].clientY - element.getBoundingClientRect().top;
    }

    public rotate(item: any) {
        this.swapDimensions(item, item);

        item.rotated = item.rotated ? false : true;

        // TODO: replace with transform: rotate so the new image won't be loaded
        if (item.rotated)
            item.image = item.image.replace('blocks', 'blocks/rotated')
        else
            item.image = item.image.replace('/rotated', '');

        this.updateBoundingLines();
    }

    private swapDimensions(a: any, b: any) {
        let temp = a.defaultWidth;
        a.defaultWidth = b.defaultHeight;
        b.defaultHeight = temp;
    }

    public dropOnPreview(event: any) {
        if (event.previousContainer.id == "menu-items-drop-list") {
           this.dropOnPreviewFromMenu(event);
           return;
        }

        if (event.previousContainer === event.container) {
            this.moveOnPreview(event);
            return;
        }
    }

    private dropOnPreviewFromMenu(event: any) {
        event.item.data.top = event.item.data.placholderTop;
        event.item.data.left = event.item.data.placholderLeft;

        let component = this;
        let newItem = {
            ...event.item.data,
            hidden: true,
            get width(): number {
                return this.defaultWidth * component.allocationService.blockSizeRatio;
            },
            get height(): number {
                return this.defaultHeight * component.allocationService.blockSizeRatio;
            }
        };
        this.addPreviewItem(newItem, event.currentIndex);

        setTimeout(() => {
            this.updateDesignerElement(newItem);
        });
    }

    private moveOnPreview(event: any) {
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

    public dropOnMenuList(event: any) {
        if (event.previousContainer.id == "menu-items-drop-list") {
            return;
        }

        let index = this.previewItems.findIndex(item => item == event.item.data);
        this.previewItems.splice(index, 1);

        this.updateBoundingLines();
        this.updatePrice();
    }

    private addPreviewItem(item: any, index: number) {
        this.previewItems.splice(index, 0, item);
    }

    public dragStarted(element: any) {
        this.draggingItem = element;
        this.draggingMode = true;

        let previewItem = document.getElementsByClassName('cdk-drag-preview')[0] as any;
        previewItem.style.width = element.width + 'px';
        previewItem.style.height = element.height + 'px';

        let image = previewItem.querySelector('.block-item-image');
        image.style.width = element.width + 'px';
        image.style.height = element.height + 'px';
    }

    public dragStopped() {
        this.draggingMode = false;
        this.draggingItem = undefined;
    }

    public menuListEntered() {
        this.menuItemsHovered = true;
    }

    public menuListExited() {
        this.menuItemsHovered = false;
    }

    private updateBoundingLines() {
        let blockItems = this.previewItems.map(item => new BlockItem(new Point(parseFloat(item.left), parseFloat(item.top)), item.width, item.height));
        this.boundingLineService.calculateBoundingLines(blockItems);
    }

    private updatePrice() {
        this.price = this.previewItems.reduce((sum, current) => sum + current.price, 0);
        this.priceInteger = Math.trunc(this.price);
        this.priceDecimal = this.price - this.priceInteger;
    }
}
