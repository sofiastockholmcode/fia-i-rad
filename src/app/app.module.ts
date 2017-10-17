import {NgModule} from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store'

import {HttpModule} from '@angular/http';
import {RootComponent} from "./root.component";
import {ChatComponent} from "./chat.component";
import {SelectModeComponent} from "./select-mode.component";
import {BoardComponent} from "./board.component";

import {AppService} from "./app.service";
import {ChatService, names} from "./chat.service";
import {squareReducer} from "./app.service";




//noinspection TypeScriptValidateTypes
const appRoutes: Routes = [
    {path: '', component: SelectModeComponent},
    {path: 'chat', component: ChatComponent},
    {path: 'tic', component: BoardComponent}
];


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    StoreModule.provideStore({squareReducer, names}),
    RouterModule.forRoot(appRoutes),

  ],
  declarations: [
      RootComponent,
      BoardComponent,
      ChatComponent,
      SelectModeComponent
  ],
    providers: [
        AppService,
        ChatService
    ],
  bootstrap: [ RootComponent ]
})
export class AppModule { }
