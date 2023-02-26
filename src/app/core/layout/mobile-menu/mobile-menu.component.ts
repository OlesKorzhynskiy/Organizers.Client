import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-mobile-menu',
    templateUrl: './mobile-menu.component.html',
    styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements OnInit {
    @ViewChild('drawer', { static: false }) drawer!: any;

    constructor() { }

    ngOnInit(): void {
    }

    public toggle() {
        this.drawer.toggle();
    }
}
