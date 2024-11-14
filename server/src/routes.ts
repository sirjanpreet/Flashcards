import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


type result = {
  quizName: string;
  quizTaker: string;
  score: number;
}
const scores: result[] = [];
const quizzesMap: Map<string, unknown> = new Map<string, unknown>();

// TODO: remove the dummy route

/**
 * Dummy route that just returns a hello message to the client.
 * @param req The request object
 * @param res The response object
 */
// export const dummy = (req: SafeRequest, res: SafeResponse): void => {
//   const name = first(req.query.name);
//   if (name === undefined) {
//     res.status(400).send('missing or invalid "name" parameter');
//     return;
//   }

//   res.send({msg: `Hi, ${name}!`});
// };

/**
 * handles request for /list, sends all the quiz names that the user has created
 * @param req The request object
 * @param res The response object
 */
export const list = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({quizzes: Array.from(quizzesMap.keys()), scores: scores});
}

/** Handles request for /load by returning the quiz requested. 
 * @param req The request object
 * @param res The response object
*/
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('required argument "name" was missing');
  } else if (!quizzesMap.has(name)) {
    res.status(404).send('no such quiz exists');
  } else {
    res.status(200).send({quiz: quizzesMap.get(name), quizName: name}); // give client back what they request along with what name corresponds
  }
}

/** Saves quizzes made by user so that they can recover them later
 * @param req The request object
 * @param res The response object
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  // res.send({msg: "started talking with server"});
  // return;
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('required argument "value" was missing');
    return;
  }
  else {
      quizzesMap.set(name, value);
      res.send({existed: true}); //had to send something
  }  
    // TODO(5a): replace 
}

/** Saves quiz scores made by user so that they can see them later
 * @param req The request object
 * @param res The response object
 */
export const saveScore = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  const score = req.body.score;
  const quiz = req.body.quiz;
  if (name === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  } else if (typeof name !== 'string') {
    res.status(400).send('argument name must be of type string');
    return;
  } else if (score === undefined) {
    res.status(400).send('required argument "score" was missing');
    return;
  } else if (typeof score !== 'number') {
    res.status(400).send('argument score must be of type number');
    return;
  } else if (quiz === undefined) {
    res.status(400).send('required argument "quiz" was missing');
    return;
  } else if (typeof quiz !== 'string') {
    res.status(400).send('argument quiz must be of type string');
    return;
  }
  else {
    scores.push({quizName: quiz, quizTaker: name, score: score});
    res.send({name: name});
  }
  
}
/** Resets quiz map and scores array to make testing easier */
export const resetQuizzesForTesting = (): void => {
  // Do not use this function except in tests!
  quizzesMap.clear();

  // Inv: len(scores) <= len(scores_0)
  while (scores.length > 0) {
    scores.pop();
  }
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
