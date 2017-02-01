import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { AppComponent } from './app.component';


import {FormsModule} from '@angular/forms';
import {AppService} from "./app.service";

import {RouterModule, Routes} from '@angular/router';
import {squareReducer} from "./app.service";

import {Store, StoreModule } from '@ngrx/store'

import {RootComponent} from "./root.component";
import {HttpModule} from '@angular/http';




//noinspection TypeScriptValidateTypes
const appRoutes: Routes = [
    {path: '', component: AppComponent},
    {path: '**', component: AppComponent}
];


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    StoreModule.provideStore({squareReducer}),
    RouterModule.forRoot(appRoutes),

  ],
  declarations: [
    AppComponent,
    RootComponent
  ],
    providers: [
        AppService
    ],
  bootstrap: [ RootComponent ]
})
export class AppModule { }
