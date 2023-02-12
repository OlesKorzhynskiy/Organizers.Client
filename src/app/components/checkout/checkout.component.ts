import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize, Subject, takeUntil } from 'rxjs';
import { DeliveryResponse } from 'src/app/api/models/Deliveries/delivery-response';

import { SettlementResponse } from 'src/app/api/models/Settlements/settlement-response';
import { WarehouseResponse } from 'src/app/api/models/Warehouses/warehouse-response';
import { DeliveriesService } from 'src/app/api/services/deliveries.service';
import { SettlementsService } from 'src/app/api/services/settlements.service';
import { WarehousesService } from 'src/app/api/services/warehouse.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
    orderForm!: UntypedFormGroup;
    items: any[] = [];

    debounceTime = 500;
    delivery: DeliveryResponse | null = null;
    warehouseTypes: string[] | null = null;

    settlementMinLengthTerm = 3;
    isSettlementsLoading = false;
    settlements: SettlementResponse[] = [];
    settlement: SettlementResponse | null = null;

    warehouseMinLengthTerm = 0;
    isWarehousesLoading = false;
    warehouses: WarehouseResponse[] = [];
    warehouse: WarehouseResponse | null = null;

    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private settlementsService: SettlementsService,
        private warehousesService: WarehousesService,
        private deliveriesService: DeliveriesService) {
    }

    ngOnInit(): void {
        this.orderForm = this.formBuilder.group({
            settlement: ['', [Validators.required, (control: AbstractControl) => this.settlement != null ? null : {settlement: {value: control.value}}]],
            settlementId: ['', [Validators.required]],
            warehouse: ['', [Validators.required, (control: AbstractControl) => this.warehouse != null ? null : {warehouse: {value: control.value}}]],
            warehouseId: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            firstName: ['', [Validators.required]]
        });

        this.fetchDeliveries();

        this.initOrderedItems();

        this.initAutocomplete();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    fetchDeliveries(): void {
        this.deliveriesService.getAll().pipe(takeUntil(this.unsubscribe)).subscribe(response => {
            this.delivery = response.response[0];
            this.onWarehouseTypeSelected("відділення");
        });
    }

    initOrderedItems(): void {
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

    initAutocomplete(): void {
        this.orderForm.get('settlement')?.valueChanges
            .pipe(
                takeUntil(this.unsubscribe),
                filter(result => result !== null && result.length >= this.settlementMinLengthTerm && this.delivery != null),
                distinctUntilChanged(),
                debounceTime(this.debounceTime),
                tap(() => {
                    this.settlements = [];
                    this.isSettlementsLoading = true;
                }),
                switchMap(value => {
                    return this.settlementsService.getAll(this.delivery!.id, value)
                        .pipe(finalize(() => this.isSettlementsLoading = false));
                })
            )
            .subscribe((result: any) => {
                this.settlements = result.response?.sort((a: SettlementResponse, b: SettlementResponse) => a.settlementTypeDescription > b.settlementTypeDescription ? 1 : -1);
            });

        this.orderForm.get('warehouse')?.valueChanges
            .pipe(
                takeUntil(this.unsubscribe),
                filter(result => result !== null && result.length >= this.warehouseMinLengthTerm && this.settlement != null && this.warehouseTypes != null),
                distinctUntilChanged(),
                debounceTime(this.debounceTime),
                tap(() => {
                    this.warehouses = [];
                    this.isWarehousesLoading = true;
                }),
                switchMap(value => {
                    return this.warehousesService.getAll(this.delivery!.id, this.settlement!.id, value, this.warehouseTypes!)
                        .pipe(finalize(() => this.isWarehousesLoading = false));
                })
            )
            .subscribe((result: any) => {
                this.warehouses = result.response;
            });
    }

    onWarehouseTypeSelected(value: string) {
        if (this.delivery == null)
            return;

        this.warehouseTypes = this.delivery.warehouseTypes
            .filter(warehouseType => warehouseType.description.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
            .map(warehouseType => warehouseType.id);

        this.clearWarehouseSelection();
    }

    clearSettlementSelection() {
        this.orderForm.get('settlement')?.setValue("");
        this.orderForm.get('settlementId')?.setValue("");
        this.settlements = [];
    }

    clearSettlement() {
        this.settlement = null;
    }

    onSettlementSelected(settlement: SettlementResponse) {
        this.settlement = settlement;
        this.orderForm.get('settlement')?.setValue(`${settlement.shortSettlementTypeDescription} ${settlement.name} (${settlement.areaDescription})`);
        this.orderForm.get('settlementId')?.setValue(settlement.id);

        this.clearWarehouseSelection();
    }

    clearWarehouseSelection() {
        this.orderForm.get('warehouse')?.setValue("");
        this.orderForm.get('warehouseId')?.setValue("");
        this.warehouses = [];
    }

    clearWarehouse() {
        this.warehouse = null;
    }

    onWarehouseSelected(warehouse: WarehouseResponse) {
        this.warehouse = warehouse;
        this.orderForm.get('warehouse')?.setValue(warehouse.name);
        this.orderForm.get('warehouseId')?.setValue(warehouse.id);
    }

    onSave(): void {
        if (!this.orderForm.valid || !this.settlement)
            return;
    }
}
