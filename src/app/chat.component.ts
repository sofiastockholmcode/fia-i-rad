

import { Component } from '@angular/core';
import {ChatService} from "./chat.service";

@Component({
    selector:'chat',
    template: `
        <div class="chatbox">
            <div *ngFor="let message of messages">
                <span><strong>{{message.username}}:</strong> {{message.text}}</span>
            </div>
        </div>

        <form (ngSubmit)="sendMessage()" class="form-inline">
            <input class="form-control" [(ngModel)]="message" name="message" required/>
            <button class="btn btn-primary btn-sm" type="submit">Send</button>
        </form>



    `

})


export class ChatComponent {
    messages:any = [];
    connection:any;
    message:string;


    constructor(private chatService:ChatService) {}

    sendMessage() {
        this.chatService.sendMessage(this.message);
        this.message = "";
    }

    ngOnInit() {
        this.connection = this.chatService.getMessages().subscribe((obj:any) => {
            this.messages.push(obj);
        })
    }

    ngOnDestory() {
        this.connection.unsubscribe();
    }

}