import { Routes } from '@angular/router';
import { DesignerComponent } from './components/designer/designer/designer.component';

export const APP_ROUTES: Routes = [
    { path: 'designer', component: DesignerComponent },
    { path: '**', redirectTo: 'designer', pathMatch: 'full' }
];
