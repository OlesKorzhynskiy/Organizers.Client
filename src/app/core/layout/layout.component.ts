import { Component, OnInit, ViewChild } from '@angular/core';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    @ViewChild(MobileMenuComponent) mobileMenu!: MobileMenuComponent;

    constructor() { }

    ngOnInit(): void {
    }
}
