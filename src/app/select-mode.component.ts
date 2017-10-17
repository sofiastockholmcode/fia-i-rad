import { Component } from '@angular/core';
import {Store} from "@ngrx/store";
import { Router } from '@angular/router';
import {AppService} from "./app.service";


@Component({
    selector: 'select-mode',
    templateUrl: './select-mode.component.html',
})
export class SelectModeComponent {
    constructor(private chatService:AppService, public store:Store<any>, private router:Router) {

    }

    multiSelected:boolean = true;
    name:string = '';

    selectSingle() {
        // just route user to play
        console.log("single")
    }

    selectMulti() {
        console.log("select multi")
        this.multiSelected = true;
    }

    setName() {
        console.log(this.name);
        this.chatService.setName(this.name);
        this.router.navigateByUrl('tic')
    }

}