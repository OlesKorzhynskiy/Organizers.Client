import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    items: any[] = [];

    constructor() { }

    ngOnInit(): void {
        let storageItems = localStorage.getItem('checkout-items');
        let items = storageItems ? JSON.parse(storageItems): [];
        this.items = items.reduce((group: any[], item: any) => {
            let groupItem = group.find(i => i.name == item.name)
            if (groupItem) {
                groupItem.quantity++;
                groupItem.price += item.price;
            } else {
                groupItem = { name: item.name, image: item.image, alt: item.alt, title: item.title, price: item.price, quantity: 1 };
                group.push(groupItem);
            }

            return group;
        }, []);
    }

}
