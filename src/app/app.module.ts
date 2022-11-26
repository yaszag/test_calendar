import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {SohoButtonModule, SohoCheckBoxModule, SohoComponentsModule, SohoLocaleModule} from 'ids-enterprise-ng';

import { AppComponent } from './app.component';
import { SohoLocaleInitializerModule } from './locale/soho-locale-initializer.module';
import { HeaderComponent } from './header/header.component';
import { PersonalizeMenuComponent } from './personalize-menu/personalize-menu.component';
import { MonthComponent } from './month/month.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './month/components/filter/filter.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PersonalizeMenuComponent,
    MonthComponent,
    FilterComponent

  ],
  imports: [
    RouterModule.forRoot(
      [
        { path: 'month', component: MonthComponent},

      ]
    ),
      BrowserModule,
      SohoLocaleModule,
      SohoButtonModule,
      SohoLocaleInitializerModule,
      SohoComponentsModule,
      HttpClientModule,
      ReactiveFormsModule,
      FormsModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'en-US'
    },

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
