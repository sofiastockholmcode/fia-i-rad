import { Injectable } from '@angular/core';
import {Square} from "./app.component";

import { Store, provideStore} from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import {Reducer, Action, ActionReducer} from '@ngrx/store';

import { Http, Response } from '@angular/http';




@Injectable()
export class AppService {

    constructor(private http:Http, private store:Store<any>) {}

    reset():void {
        this.store.dispatch({type:'RESET_SQUARES', payload:''})
    }

    setSquareState(square:Square):void {
        this.store.dispatch({type:'SET_SQUARE_STATE', payload:square});
    }

    getSquareState(pos:String) {

    }

}





export const SET_SQUARE_STATE = 'SET_SQUARE_STATE';
export const RESET_SQUARES = 'RESET_SQUARES';

let initialStateSquares = [
    {name: '11', state: 'unchecked'},
    {name: '12', state: 'unchecked'},
    {name: '13', state: 'unchecked'},
    {name: '21', state: 'unchecked'},
    {name: '22', state: 'unchecked'},
    {name: '23', state: 'unchecked'},
    {name: '31', state: 'unchecked'},
    {name: '32', state: 'unchecked'},
    {name: '33', state: 'unchecked'}
]

export const squareReducer:ActionReducer<any> = (state:any = initialStateSquares, action:Action) => {
    switch (action.type) {
        case SET_SQUARE_STATE:
            let newState = state.map((square:Square) => {
                if (square.name == action.payload.name)
                    square.state = action.payload.state;
                return square;
            });
            return newState;
        case RESET_SQUARES:
            console.log('reset squares');
            return state.map((square:Square) => { return {name:square.name, state: 'unchecked'}});
        default:
            return state;
    }
}