//import React, { Component, ChangeEvent, MouseEvent } from "react";
import React, { ChangeEvent, Component, MouseEvent} from "react";
// import React, { Component } from "react";
import "./style.css"
import { card, Page } from './help';


// TODO: When you're ready to get started, you can remove all the example 
//   code below and start with this blank application:

type TakeProps = {
    /** Initial state of the file. */
    deck: card[];
    onFinish: (username: string, percent: number) => void; 
    quizName: string;
    
};

type TakeState = {
  currCardSide: string;
  isQuestion: boolean;
  currIndex: number;
  correct: number;
  incorrect: number;
  page: Page;
  username: string;
  errorMsg: string;
}

/** Displays the UI of take quiz feature. */
export class Take extends Component<TakeProps, TakeState> {

  constructor(props: TakeProps) {
    super(props); 
    this.state = {currCardSide: this.props.deck[0].question, isQuestion: true, currIndex: 0,
       correct: 0, incorrect: 0, page: {kind: "takequiz"}, username: "", errorMsg: ""};
  } 
  
  render = (): JSX.Element => {
    if (this.state.page.kind === "takequiz") {
      return <div>
        <div><h1>{this.props.quizName}</h1></div>
        <div><h3>Correct: {this.state.correct} | Incorrect: {this.state.incorrect}</h3></div>
        <div>
        {/* <textarea rows={3} cols={40}  value={this.state.currCardSide} style={{textAlign: 'center', resize: 'none',  fontSize: '24px', fontWeight: 'bold' }} readOnly></textarea> */}
        <p className="card" >{this.state.currCardSide}</p>
        </div>

        <div>
          <button type="button" onClick={this.doFlipClick}>Flip</button>
          <button type="button" onClick={this.doCorrectClick}>Correct</button>
          <button type="button" onClick={this.doIncorrectClick}>Incorrect</button>
        </div>

    </div>
    } else {
      return <div>
        <div><h1>{this.props.quizName}</h1></div>
        <div>End of Quiz</div>
        <div><h3>Correct: {this.state.correct} | Incorrect: {this.state.incorrect}</h3></div>
        <div>Name:
        <input type="text" onChange={this.doUsernameChange} value={this.state.username}/>
        <button type="button" onClick={this.doFinishClick}>Finish</button>
        </div>
        <div className="error">{this.state.errorMsg}</div>
      </div>;
    }
  };
  
  doFinishClick = (_evt: MouseEvent<HTMLElement>): void => {
    if (this.state.username === "") {
      this.setState({errorMsg: "Error: missing name"});
      return;
    } else {
      this.setState({errorMsg: ""});
      const percent: number = Math.floor((this.state.correct / this.props.deck.length) * 100);
      this.props.onFinish(this.state.username, percent);
    }
    
  }

  doUsernameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    const name: string = evt.target.value;
    this.setState({username: name});
  }

  doIncorrectClick = (_evt: MouseEvent<HTMLElement>): void => {
    console.log("incorrect:" + this.state.currIndex.toString() + ", " + this.props.deck.length);
    if (this.state.currIndex + 1 >= this.props.deck.length) {
      this.setState({page: {kind: "endquiz"}});
      return;
    } else {
      const index: number = this.state.currIndex + 1;
      this.setState({currIndex: index, incorrect: this.state.incorrect + 1, currCardSide: this.props.deck[index].question, isQuestion: true}); 
    }
  }
  doCorrectClick = (_evt: MouseEvent<HTMLElement>): void => {
    console.log("correct:" + this.state.currIndex.toString() + ", " + this.props.deck.length);
    if (this.state.currIndex + 1 >= this.props.deck.length) {
      this.setState({page: {kind: "endquiz"}, correct: this.state.correct + 1});
    } else {
      const index: number = this.state.currIndex + 1;
      this.setState({correct: this.state.correct + 1, currIndex: index, currCardSide: this.props.deck[index].question, isQuestion: true}); 
    }
  }

  
  doFlipClick = (_evt: MouseEvent<HTMLElement>): void => {
    if (this.state.isQuestion) {
      this.setState({isQuestion: false, currCardSide: this.props.deck[this.state.currIndex].answer});
    } else {
      this.setState({isQuestion: true, currCardSide: this.props.deck[this.state.currIndex].question});
    }
  }

}