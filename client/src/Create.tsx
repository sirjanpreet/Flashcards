import React, { ChangeEvent, Component, MouseEvent } from "react";
// import { slice } from "./webpack.config";
// import React, { Component, ChangeEvent } from "react";
import { card, parseDeck } from './help';



type CreateProps = {
    /** Initial state of the file. */

    onSave: (quizName: string, cards: card[]) => void;
    onBack: () => void;
};

type CreateState = {
    quizName: string;
    cards: string;
    errorMsg: string;
};

export class Create extends Component<CreateProps, CreateState> {
    
    constructor(props: CreateProps) {
        super(props);
    
        this.state = {quizName: "", cards: "", errorMsg: ""};
    }
    render = (): JSX.Element => {
        return <div>
        <div><h1>Create</h1></div>
        <div>Name: <input type="text" onChange={this.doNameChange} value={this.state.quizName} /></div> 
        <div>
            <label htmlFor="textbox">Enter text:</label>
            <br/>
            <textarea id="textbox" rows={3} cols={40} onChange={this.doCreateChange} value={this.state.cards}></textarea>
        </div>
        <div>
        <button type="button" onClick={this.doAddClick}>Create</button> 
        <button type="button" onClick={this.doBackClick}>Back</button>
        <div>{this.state.errorMsg}</div>
        </div>

        </div>
    }

    doAddClick = (_evt: MouseEvent<HTMLElement>): void => {
        if (this.state.quizName === "") {
            this.setState({errorMsg: "Error: name should not be empty"});
            return;
        } else if (this.state.cards === "") {
            this.setState({errorMsg: "Error: no cards"});
            return;
        } // else if () // make it so that repeats are not possible
        const parsedDeck = parseDeck(this.state.cards);
        if (parsedDeck === undefined) {
            // this.props.onSave(this.state.quizName);
            this.setState({errorMsg: "Error: incorrect format"});
        } else {
            this.setState({errorMsg: ""});
            this.props.onSave(this.state.quizName, parsedDeck);
        }
    }

    

    doBackClick = (_evt: MouseEvent<HTMLElement>): void => {
        this.setState({quizName: "", cards: "", errorMsg: ""});
        this.props.onBack();
    }

    doCreateChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
        this.setState({cards: evt.target.value});
    }

    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        const name: string = evt.target.value;
        this.setState({quizName: name});
    }
  
}

      
