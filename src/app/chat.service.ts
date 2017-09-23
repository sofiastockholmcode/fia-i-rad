
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'
import {ActionReducer, Action, Store} from "@ngrx/store";
import {Injectable} from '@angular/core';


@Injectable()
export class ChatService {
    constructor(private store:Store<any>) {

    }


    private url = 'http://localhost:8080';
    private socket = io(this.url);

    sendMessage(message:any) {
        this.socket.emit('new message', message);
    }

    getMessages() {
        console.log(' get messages');
        let observable = new Observable((observer:any) => {
            this.socket.on('new message', (data:any) => {
                observer.next(data);
            })

            return () => {
                this.socket.disconnect();
            }
        })

        return observable;
    }

    setName(name:string) {
        this.store.dispatch({type:'SET_MY_NAME', payload:name})
    }

}



export const names:ActionReducer<any> = (state:any = {me:'', other:''}, action:Action) => {
    switch (action.type) {
        case 'SET_MY_NAME':
            return Object.assign({}, state, {
                me: action.payload
            });
        default:
            return state;
    }
}