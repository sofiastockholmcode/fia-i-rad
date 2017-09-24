
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'

export class ChatService {
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
}