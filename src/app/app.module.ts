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
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ApiModule } from './api/api-module.module';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FaqComponent } from './components/faq/faq.component';
import { ContactComponent } from './components/contact/contact.component';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';

@NgModule({
  declarations: [
    AppComponent,
    DesignerComponent,
    BoundingLinesComponent,
    CheckoutComponent,
    HomeComponent,
    AboutUsComponent,
    FaqComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUsefulSwiperModule,
    ApiModule.forRoot({ rootUrl: environment.gatewayUrl, paymentRootUrl: environment.paymentUrl }),
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
