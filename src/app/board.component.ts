import {Component} from '@angular/core';
import '../../public/css/styles.css';
import {AppService} from "./app.service";
import {Router} from "@angular/router";

import { Store} from '@ngrx/store'
import {ChatService} from "./chat.service";


@Component({
  selector: 'my-app',
  templateUrl: './board.component.html',
  styleUrls: ['./app.component.css']
})

export class BoardComponent {

  squares:Square[];
  gameIsFinished = false;
  result = '';
  connection:any;
  numUsers:any;

  constructor(private appService:AppService, private router:Router, public store:Store<any>, private chatService:ChatService) {
    this.store.select('squareReducer').subscribe(
        squares => {
          this.squares = <Square[]>squares;
        }
    )
  }


  ngOnInit(): void {
    this.appService.reset();
    // this.opponentMove();
    this.connection = this.appService.getSquares().subscribe((square:Square) => {
      this.appService.setSquareState(square);
    });

    this.chatService.getNumUsers().subscribe((data:any) => {
      console.log("got num users:", data)
      this.numUsers = data.numUsers
    });
    console.log('this.numUsers: ', this.numUsers);
  }

  squareClick(square:any):void {
    if (!this.gameIsFinished) {
      if (square.state == 'unchecked') {
        let newSquare = new Square(square.name, 'checked');
        // this.appService.setSquareState(newSquare);
        this.appService.sendSquare({name: square.name, state: 'checked'});
        if (!this.checkIfWon(newSquare))
          //this.opponentMove();
          console.log('other players turn. or is it? hehe')
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
    // this.opponentMove();
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