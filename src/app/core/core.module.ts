import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import {MatSidenavModule} from '@angular/material/sidenav';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LayoutComponent } from './layout/layout.component';
import { MobileMenuComponent } from './layout/mobile-menu/mobile-menu.component';

@NgModule({
    declarations: [
        ConfirmDialogComponent,
        LayoutComponent,
        MobileMenuComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        RouterModule,
        MatSidenavModule,
        ToastrModule.forRoot()
    ],
    exports: [
        LayoutComponent
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
        }
    }
}
