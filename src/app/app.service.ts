import {Injectable} from '@angular/core';
import {Square} from './board.component';

import {Store} from '@ngrx/store'
import {Observable} from 'rxjs/Observable'
import {Action, ActionReducer} from '@ngrx/store';

import {Http} from '@angular/http';


@Injectable()
export class AppService {
    // private url = 'http://localhost:8080';
    private url = 'https://fia-i-rad.herokuapp.com';
    private socket = io(this.url);

    constructor(private http:Http, private store:Store<any>) {
        this.socket.on('initialstate', (data:any) => {
            console.log('got initial data', data);
            this.store.dispatch({type:'SET_MY_NAME', payload:data.username});
            this.store.dispatch({type:'SET_MY_TYPE', payload:data.type});
            this.store.dispatch({type: SET_GAME_STATE, payload: data.gameState});
        });

        this.socket.on('gameState', ((data:any) => {
            this.store.dispatch({type: SET_GAME_STATE, payload: data})
        }))

    }

    reset():void {
        this.store.dispatch({type:'RESET_SQUARES', payload:''});
        this.socket.emit('reset');
    }

    setSquareState(square:Square):void {
        this.store.dispatch({type:'SET_SQUARE_STATE', payload:square});
    }

    sendSquare(square:Square):void {
        this.socket.emit('square', square);
    }

    getSquares() {
        let observable = new Observable((observer:any) => {
            this.socket.on('square', (data:any) => {
                console.log('got data: ', data.square);
                let square = data.square;
                console.log('square name is: ', square.name)
                observer.next(data);
            });

            return () => {
                this.socket.disconnect();
            }
        })

        return observable;
    }

    getGameState() {
        let observable = new Observable((observable:any) => {
            this.socket.on('gameState', ((data:any) => {
                this.store.dispatch({type: SET_GAME_STATE, payload: data})
            }))
        })
    }

    getInitialState() {
        return this.store.select('names');
    }



    /* CHAT */
    sendMessage(message:any) {
        this.socket.emit('new message', message);
    }

    getMessages() {
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
        this.socket.emit('myname', name);
        this.store.dispatch({type:'SET_MY_NAME', payload:name})
    }

    getNumUsers() {
        let observable = new Observable((observer:any) => {
            this.socket.on('numusers', (data:any) => {
                observer.next(data);
            });

            return () => {
                this.socket.disconnect();
            }
        })
        return observable;
    }


}



export const names:ActionReducer<any> = (state:any = {myUsername:'', myType:''}, action:Action) => {
    switch (action.type) {
        case 'SET_MY_NAME':
            return Object.assign({}, state, {
                myUsername: action.payload
            });
        case 'SET_MY_TYPE': {
            return Object.assign({}, state, {
                myType: action.payload
            })
        }
        default:
            return state;
    }
}


export const SET_SQUARE_STATE = 'SET_SQUARE_STATE';
export const RESET_SQUARES = 'RESET_SQUARES';
export const SET_GAME_STATE = 'SET_GAME_STATE';

let initialGameState = [
    {name: '11', state: 'unchecked'},
    {name: '12', state: 'unchecked'},
    {name: '13', state: 'unchecked'},
    {name: '21', state: 'unchecked'},
    {name: '22', state: 'unchecked'},
    {name: '23', state: 'unchecked'},
    {name: '31', state: 'unchecked'},
    {name: '32', state: 'unchecked'},
    {name: '33', state: 'unchecked'}
];

export const squareReducer:ActionReducer<any> = (state:any = initialGameState, action:Action) => {
    switch (action.type) {
        case SET_SQUARE_STATE:
            let newState = state.map((square:Square) => {
                if (square.name == action.payload.square.name) {
                    square.state = action.payload.square.state;
                }

                return square;
            });
            console.log('SET_SQUARE_STATE: ', newState);
            return newState;
        case RESET_SQUARES:
            return state.map((square:Square) => { return {name:square.name, state: 'unchecked'}});
        case SET_GAME_STATE:
            return action.payload;
        default:
            return state;
    }
}