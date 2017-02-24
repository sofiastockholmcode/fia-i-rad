import { Component, Directive, Renderer, ElementRef } from '@angular/core';
import '../../public/css/styles.css';
import {AppService} from "./app.service";
import {Router} from "@angular/router";

import { Store, provideStore} from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import {Reducer,  Action, ActionReducer} from '@ngrx/store';
import {ChatService} from "./chat.service";


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  squares:Square[];
  gameIsFinished = false;
  result = '';

  constructor(private appService:AppService, private router:Router, public store:Store<any>) {
    this.store.select('squareReducer').subscribe(
        squares => {
          this.squares = <Square[]>squares;
        }
    )
  }


  ngOnInit(): void {
    this.appService.reset();
    this.opponentMove();
  }

  squareClick(square:any):void {
    if (!this.gameIsFinished) {
      if (square.state == 'unchecked') {
        let newSquare = new Square(square.name, 'checked');
        this.appService.setSquareState(newSquare);
        if (!this.checkIfWon(newSquare))
          this.opponentMove();
      }
    }
  }

  getState(square:Square) {
    if (square.state == 'checked') {
      return 'yellow';
    } else if (square.state == 'oppChecked')
     return 'red';
    else
      return 'greeen';
  }

  reset() {
    this.gameIsFinished = false;
    this.appService.reset();
    this.opponentMove();
  }


  opponentMove():void {
    let uncheckedSquares = this.squares.filter((square:Square) => {return square.state == 'unchecked'});
    if (this.squares.filter((square:Square) => {return square.state == 'unchecked'}).length == 0) {
      this.result = 'Its a tie';
      this.gameIsFinished = true;
      return;
    }

    // randomly select a square
    let selectedSquare = uncheckedSquares[Math.floor(Math.random() * uncheckedSquares.length)];
    let opponentSquare = new Square(selectedSquare.name, 'oppChecked');
    this.appService.setSquareState(opponentSquare);

    this.checkIfWon(opponentSquare);
  }

  checkIfWon(thisSquare:Square):boolean {

    console.log('thisSquare: ', thisSquare.state);
      let p:String;
      if (thisSquare.state == 'checked')
        p = 'You';
      else p = 'Opponent';

      if (this.squares.filter((square:Square) => {
            return (square.name.charAt(0) == thisSquare.name.charAt(0) && square.state == thisSquare.state)
          }).length > 2 ) {
        this.result = `${p} won horizontal`;
        this.gameIsFinished = true;
        return true;
      }

      if (this.squares.filter((square:Square) => {
            return (square.name.charAt(1) == thisSquare.name.charAt(1) && square.state == thisSquare.state)
          }).length > 2 ) {
        this.result = `${p}  won vertical`;
        this.gameIsFinished = true;
        return true;
      }

      let participantSquares = this.squares.filter((square:Square) => { return square.state == thisSquare.state});
      console.log('participantSquares', participantSquares);
      if (participantSquares.filter((square:Square) => {return square.name.charAt(0) == square.name.charAt(1)}).length > 2) {
        this.result = `${p} won diagonal`;
        this.gameIsFinished = true;
        return true;
      }

      if (participantSquares.filter((square:Square) => {return square.name == '13' || square.name == '22' || square.name == '31'}).length > 2) {
        this.result = `${p} won anti diagonal`;
        this.gameIsFinished = true;
        return true;
      }

      if (this.squares.filter((square:Square) => {return square.state == 'unchecked'}).length == 0) {
        this.result = 'Its a tie';
        this.gameIsFinished = true;
      }

      return false;
  }

}


export class Square {
  constructor(name:string, state:string) {this.name=name, this.state=state}
  name:string;
  state:string;
}