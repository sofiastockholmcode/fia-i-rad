import { Component } from '@angular/core';
import {ChatService} from "./chat.service";
import {Store} from "@ngrx/store";


@Component({
    selector: 'select-mode',
    templateUrl: './select-mode.component.html',
})
export class SelectModeComponent {
    constructor(private chatService:ChatService, public store:Store<any>) {

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
    }

}