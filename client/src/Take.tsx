//import React, { Component, ChangeEvent, MouseEvent } from "react";
import React, { Component, MouseEvent} from "react";
// import React, { Component } from "react";

import { card } from './help';


// TODO: When you're ready to get started, you can remove all the example 
//   code below and start with this blank application:

type TakeProps = {
    /** Initial state of the file. */
    deck: card[];
    
};

type TakeState = {
  currCardSide: string
}

/** Displays the UI of the Flashcard application. */
export class Take extends Component<TakeProps, TakeState> {

  constructor(props: TakeProps) {
    super(props); 
    this.state = {currCardSide: this.props.deck[0].question};
  } 
  
  render = (): JSX.Element => {
    return <div>
      <div><h1>SAT Vocab</h1></div>

      <div>
      <label htmlFor="textbox">Enter text:</label>
      <br/>
      <textarea id="textbox" rows={3} cols={40} value={this.state.currCardSide}
      ></textarea>
      </div>

      <div><button type="button" onClick={this.doFlipClick}>Flip</button></div>

    </div>
  };


  doFlipClick = (_evt: MouseEvent<HTMLElement>): void => {
    
  }

}