import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { BoundingLinesComponent } from './components/designer/bounding-lines/bounding-lines.component';
import { APP_ROUTES } from './app.routes';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { DesignerComponent } from './components/designer/designer.component';

@NgModule({
  declarations: [
    AppComponent,
    DesignerComponent,
    BoundingLinesComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
