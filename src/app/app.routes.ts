import { Routes } from "@angular/router";
import { AboutUsComponent } from "./components/about-us/about-us.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { ContactComponent } from "./components/contact/contact.component";
import { DesignerComponent } from "./components/designer/designer.component";
import { FaqComponent } from "./components/faq/faq.component";
import { HomeComponent } from "./components/home/home.component";

export const APP_ROUTES: Routes = [
    { path: 'designer', component: DesignerComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'faq', component: FaqComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'contact', component: ContactComponent },
    { path: '', component: HomeComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
