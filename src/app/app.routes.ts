import { Routes } from "@angular/router";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { DesignerComponent } from "./components/designer/designer.component";

export const APP_ROUTES: Routes = [
    { path: 'designer', component: DesignerComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: '**', redirectTo: 'designer', pathMatch: 'full' }
];