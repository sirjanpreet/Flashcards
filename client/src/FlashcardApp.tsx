//import React, { Component, ChangeEvent, MouseEvent } from "react";
import React, { Component, MouseEvent } from "react";
// import React, { Component } from "react";
import { isRecord } from './record';
import { Create } from "./Create";
import { card } from './help';


// TODO: When you're ready to get started, you can remove all the example 
//   code below and start with this blank application:

type result = {
  quizName: string;
  quizTaker: string;
  score: bigint;
}

type Page = {kind: "list"} | {kind: "takequiz"} | {kind: "createquiz"} | {kind: "endquiz"} | {kind: "scores"};

type FlashcardAppState = {
  page: Page;
  quizzes: string[];
  currQuiz: card[];
  scores: result[]; 
}

/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {page: {kind: "list"}, quizzes: [], currQuiz: [], scores: []};
  }

  componentDidMount = (): void => {
    fetch("api/list")
      .then(this.doListResp)
      .catch(() => this.doListError("could not load list"));
    
    
  }

  doListResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doListJson)
      .catch(() => this.doListError("200 response is not valid json")); 
    } else if (res.status === 400) {
      res.text().then(this.doListError)
      .catch(() => this.doListError("400 response is not text"));
    } else{
      this.doListError(`bad status code ${res.status}`);
    }
  }

  doListJson = (data: unknown): void => {
    if (!isRecord(data)) {
      this.doListError("bad data from api/list: not a record");
      return;
    }
    
    if (!Array.isArray(data.quizzes)) {
      this.doListError("bad data from api/list: quizzes was not an array");
      return;
    }
    
    if (!Array.isArray(data.scores)) {
      this.doListError("bad data from api/list: scores was not an array");
      return;
    }
    this.setState({quizzes: data.quizzes, scores: data.scores});
  }

  doListError = (msg: string): void => {
    console.log(`fetch of /list failed: ${msg}`)
  }
  
  render = (): JSX.Element => {
    if (this.state.page.kind === "list") {
      return <div>
              <div><h1>List</h1></div>
              <div>
                <ul>
                  {this.renderQuizzes()}
                </ul>
              </div>
              <div><button type="button" onClick={this.doNewClick}>New</button></div>
              <div><h1>Scores</h1></div>
              <div>
                <ul>
                  {this.renderScores()}
                </ul>
              </div>
            </div>;
    } else if (this.state.page.kind === "createquiz") {
      return <div><Create onSave={this.doAddClick} onBack={this.doBackClick}/></div>
    }
    return <div> </div>
    
  };


  renderScores = (): JSX.Element => {
    const scoreList: JSX.Element[] = [];
    for (const quiz of this.state.scores) {
      scoreList.push(<li> <div></div> {quiz.quizTaker},{quiz.quizName}: {String(quiz.score)} </li>);
      // quizList.push(<li> <div><a href="#" > {quiz} </a></div>  </li>);
    }
    return <div>{scoreList}</div>;
  }

  renderQuizzes = (): JSX.Element => {
    const quizList: JSX.Element[] = [];
    for (const quiz of this.state.quizzes) {
      quizList.push(<li> <div><a href="#" onClick={() => this.doLoadClick}> {quiz} </a></div>  </li>);
      // quizList.push(<li> <div><a href="#" > {quiz} </a></div>  </li>);
    }
    return <div>{quizList}</div>;
  }


  doAddClick = (quizName: string): void => {
    // make fetch request to save on server.
    const body = {name: quizName};
    fetch("/api/saveQuiz", {method: "POST", body: JSON.stringify(body), headers: {"Content-Type": "application/json"}})
    .then(this.doAddResp)
    .catch(() => this.doAddError("failed to connect"))
  } 

  doAddResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doAddJson).catch(() => this.doAddError("200 response is not valid json"));
    } else if(res.status === 400 || res.status === 404) {
      res.text().then(this.doAddError).catch(() => this.doAddError("400 response is not text"));
    } else {
      this.doAddError(`bad status code ${res.status}`);
    }
  }

  doAddError = (msg: string): void => {
    console.log(`fetch of api/load failed: ${msg}`);
  }

  doAddJson = (_data: unknown): void => {
    // const addedQuiz: string = this.state.quizzes;
    // const quizArray: string[] = this.state.
    // this.setState({quizzes: });
    this.setState({page: {kind: "list"}});
  } 
  
  
  doBackClick = (): void => {
    this.setState({page: {kind: "list"}});
  }

  doNewClick = (_evt: MouseEvent): void => {
    this.setState({page: {kind: "createquiz"}});
  }

  doLoadClick = (_evt: MouseEvent<HTMLElement>): void => {
    fetch("api/load")
    .then(this.doLoadResp)
    .catch(() => this.doLoadError("failed to connect to server"));
  }

  doLoadResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doLoadJson).catch(() => this.doLoadError("200 response is not valid json"));
    } else if(res.status === 400 || res.status === 404) {
      res.text().then(this.doLoadError).catch(() => this.doLoadError("400 response is not text"));
    } else {
      this.doLoadError(`bad status code ${res.status}`);
    }
  }

  doLoadJson = (data: unknown): void => {
    if (!isRecord(data)) {
      this.doListError("bad data from api/load, not a record");
    } 
  }
  
  doLoadError = (msg: string): void => {
    console.log(`fetch of api/load failed: ${msg}`);
  }

  
}




// type FlashcardAppState = {
//   name: string;  // mirror state of name input box
//   msg: string;   // essage sent from server
// }


/** Displays the UI of the Flashcard application. */
// export class FlashcardApp extends Component<{}, FlashcardAppState> {

//   constructor(props: {}) {
//     super(props);

//     this.state = {name: "", msg: ""};
//   }
  
//   render = (): JSX.Element => {
//     return (<div>
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input type="text" id="name" value={this.state.name}
//                  onChange={this.doNameChange}></input>
//           <button onClick={this.doDummyClick}>Dummy</button>
//         </div>
//         {this.renderMessage()}
//       </div>);
//   };

//   renderMessage = (): JSX.Element => {
//     if (this.state.msg === "") {
//       return <div></div>;
//     } else {
//       return <p>Server says: {this.state.msg}</p>;
//     }
//   };

//   doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
//     this.setState({name: evt.target.value, msg: ""});
//   };

//   doDummyClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
//     const name = this.state.name.trim();
//     if (name.length > 0) {
//       const url = "/api/dummy?name=" + encodeURIComponent(name);
//       fetch(url).then(this.doDummyResp)
//           .catch(() => this.doDummyError("failed to connect to server"));
//     }
//   };

//   doDummyResp = (res: Response): void => {
//     if (res.status === 200) {
//       res.json().then(this.doDummyJson)
//           .catch(() => this.doDummyError("200 response is not JSON"));
//     } else if (res.status === 400) {
//       res.text().then(this.doDummyError)
//           .catch(() => this.doDummyError("400 response is not text"));
//     } else {
//       this.doDummyError(`bad stauts code ${res.status}`);
//     }
//   };

//   doDummyJson = (data: unknown): void => {
//     if (!isRecord(data)) {
//       console.error("200 response is not a record", data);
//       return;
//     }

//     if (typeof data.msg !== "string") {
//       console.error("'msg' field of 200 response is not a string", data.msg);
//       return;
//     }

//     this.setState({msg: data.msg});
//   }

//   doDummyError = (msg: string): void => {
//     console.error(`Error fetching /api/dummy: ${msg}`);
//   };

// }