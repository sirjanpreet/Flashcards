import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { save, load, list, resetQuizzesForTesting, saveScore } from './routes';
// import { dummy } from './routes';


describe('routes', function() {

//   // TODO: remove the tests for the dummy route

//   it('dummy', function() {
//     const req1 = httpMocks.createRequest(
//         {method: 'GET', url: '/api/dummy', query: {name: 'Bob'} });
//     const res1 = httpMocks.createResponse();
//     dummy(req1, res1);
//     assert.strictEqual(res1._getStatusCode(), 200);
//     assert.deepStrictEqual(res1._getData(), {msg: "Hi, Bob!"});
//   });
it('save', function() {
  // First branch, straight line code, error case (only one possible input) missing name
  const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {value: "some stuff"}});
  const res1 = httpMocks.createResponse();
  save(req1, res1);

  assert.strictEqual(res1._getStatusCode(), 400);
  assert.deepStrictEqual(res1._getData(),
      'required argument "name" was missing');

  

  // Second branch, straight line code, error case (only one possible input) missing value
  const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: "A"}});
  const res2 = httpMocks.createResponse();
  save(req2, res2);

  assert.strictEqual(res2._getStatusCode(), 400);
  assert.deepStrictEqual(res2._getData(),
      'required argument "value" was missing');

  // third
  const req3 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "A", value: [{quizTaker: "some stuff"}]}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    //assert.deepStrictEqual(res3._getData(), {name: "A"});

    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "B", value: "different stuff"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    //assert.deepStrictEqual(res4._getData(), {name: "B"});
    resetQuizzesForTesting();
});



it('load', function() {


  // Third Branch, straight line code (2 cases)
  const saveReq = httpMocks.createRequest({method: 'POST', url: '/api/save',
      body: {name: "key", value: ["pattern value"]}});
  const saveResp = httpMocks.createResponse();
  save(saveReq, saveResp);
  // Now we can actually (mock a) request to load the transcript
  const loadReq = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {name: "key"}});
  const loadRes = httpMocks.createResponse();
  load(loadReq, loadRes);
  // Validate that both the status code and the output is as expected
  assert.strictEqual(loadRes._getStatusCode(), 200);
  assert.deepStrictEqual(loadRes._getData(), {quiz: ["pattern value"], quizName: "key"});

  const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/save',
      body: {name: "diffkey", value: ["pattern value that is different"]}});
  const saveResp2 = httpMocks.createResponse();
  save(saveReq2, saveResp2);
  // Now we can actually (mock a) request to load the transcript
  const loadReq2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {name: "diffkey"}});
  const loadRes2 = httpMocks.createResponse();
  load(loadReq2, loadRes2);
  // Validate that both the status code and the output is as expected
  assert.strictEqual(loadRes2._getStatusCode(), 200);
  assert.deepStrictEqual(loadRes2._getData(), {quiz: ["pattern value that is different"], quizName: "diffkey"});


  // Second branch, error case, staight line (2 cases)
  const saveReq3 = httpMocks.createRequest({method: 'POST', url: '/api/save',
      body: {quizName: "key", quiz: ["pattern value"]}});
  const saveResp3 = httpMocks.createResponse();
  save(saveReq3, saveResp3);
  // Now we can actually (mock a) request to load the transcript
  const loadReq3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {name: "differentkey"}});
  const loadRes3 = httpMocks.createResponse();
  load(loadReq3, loadRes3);
  // Validate that both the status code and the output is as expected
  assert.strictEqual(loadRes3._getStatusCode(), 404);
  assert.deepStrictEqual(loadRes3._getData(), 'no such quiz exists');

  const saveReqR = httpMocks.createRequest({method: 'POST', url: '/api/save',
      body: {quizName: "key", quiz: ["pattern value"]}});
  const saveRespR = httpMocks.createResponse();
  save(saveReqR, saveRespR);
  // Now we can actually (mock a) request to load the transcript
  const loadReqR = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {name: "differentkey"}});
  const loadResR = httpMocks.createResponse();
  load(loadReqR, loadResR);
  // Validate that both the status code and the output is as expected
  assert.strictEqual(loadResR._getStatusCode(), 404);
  assert.deepStrictEqual(loadResR._getData(), 'no such quiz exists');

  // First branch, error case, staight line (one possible input)
  const saveReq4 = httpMocks.createRequest({method: 'POST', url: '/api/save',
      body: {quizName: "goofykey", quiz: ["pattern value"]}});
  const saveResp4 = httpMocks.createResponse();
  save(saveReq4, saveResp4);
  // Now we can actually (mock a) request to load the transcript
  const loadReq4 = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query:{}});
  const loadRes4 = httpMocks.createResponse();
  load(loadReq4, loadRes4);
  // Validate that both the status code and the output is as expected
  assert.strictEqual(loadRes4._getStatusCode(), 400);
  assert.deepStrictEqual(loadRes4._getData(), 'required argument "name" was missing');

  resetQuizzesForTesting();
})

it('list', function() {
    const saveReqTemp = httpMocks.createRequest({method: 'POST', url: 'api/save', body: {name: 'silly', value: ['silly value']}});
    const saveResTemp = httpMocks.createResponse();
    save(saveReqTemp, saveResTemp);

    const listReq = httpMocks.createRequest({method: 'GET', url: '/api/list'});  
    const listRes = httpMocks.createResponse();
    list(listReq, listRes);
    assert.strictEqual(listRes._getStatusCode(), 200);
    assert.deepEqual(listRes._getData(), {quizzes: ['silly'], scores: []});
    
    const saveReqTemp2 = httpMocks.createRequest({method: 'POST', url: 'api/save', body: {name: 'onemoresilly', value: ['another silly value']}});
    const saveResTemp2 = httpMocks.createResponse();

    const saveScoreReqTemp2 = httpMocks.createRequest({method: 'POST', url: 'api/saveScore', body: {name: 'onemoresilly', quiz: 'sillyquiz', score: 69}});
    const saveScoreResTemp2 = httpMocks.createResponse();
    saveScore(saveScoreReqTemp2, saveScoreResTemp2);

    save(saveReqTemp2, saveResTemp2);

    const listReq2 = httpMocks.createRequest({method: 'GET', url: '/api/list'});  
    const listRes2 = httpMocks.createResponse();
    list(listReq2, listRes2);
    assert.strictEqual(listRes2._getStatusCode(), 200);
    assert.deepEqual(listRes2._getData(), {quizzes: ['silly', 'onemoresilly'], scores: [{quizTaker: 'onemoresilly', quizName: 'sillyquiz', score: 69}]});
    resetQuizzesForTesting();
});


it('saveScore', function() {
    // first branch (error case, 1 possible input)
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {quiz: "A", score: 69}});
    const res1 = httpMocks.createResponse();
    saveScore(req1, res1);
  
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');
    
    // second branch (errror case, 2 tests)
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {quiz: "A", score: 69, name: 69}});
    const res2 = httpMocks.createResponse();
    saveScore(req2, res2);
  
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
    'argument name must be of type string');

    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {quiz: "A", score: 69, name: false}});
    const res4 = httpMocks.createResponse();
    saveScore(req4, res4);
  
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(),
    'argument name must be of type string');

    // third branch (error case, 1 possible input)
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {quiz: "A", name: "hello"}});
    const res3 = httpMocks.createResponse();
    saveScore(req3, res3);
  
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
    'required argument "score" was missing');

    // fourth branch (2 test cases)
    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {quiz: "A", score: false, name: "hello"}});
    const res5 = httpMocks.createResponse();
    saveScore(req5, res5);
  
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(),
    'argument score must be of type number');

    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {quiz: "A", score: "yes", name: "yellow"}});
    const res6 = httpMocks.createResponse();
    saveScore(req6, res6);
  
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
    'argument score must be of type number');

    // fifth branch (error case, 1 possible input)
    const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {name: "A", score: 69}});
    const res7 = httpMocks.createResponse();
    saveScore(req7, res7);
  
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(),
        'required argument "quiz" was missing');
    
    // sixth branch (error case, 2 tests)
    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {quiz: 69, score: 69, name: "hello"}});
    const res8 = httpMocks.createResponse();
    saveScore(req8, res8);
  
    assert.strictEqual(res8._getStatusCode(), 400);
    assert.deepStrictEqual(res8._getData(),
    'argument quiz must be of type string');

    const req9 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {quiz: false, score: 69, name: "hello"}});
    const res9 = httpMocks.createResponse();
    saveScore(req9, res9);
  
    assert.strictEqual(res9._getStatusCode(), 400);
    assert.deepStrictEqual(res9._getData(),
    'argument quiz must be of type string');


    // seventh branch (Success case, 2 tests)
    const req10 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {quiz: "quiz", score: 69, name: "hello"}});
    const res10 = httpMocks.createResponse();
    saveScore(req10, res10);
  
    assert.strictEqual(res10._getStatusCode(), 200);
    assert.deepStrictEqual(res10._getData(),
    {name: req10.body.name});

    const req11 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveScore', body: {quiz: "quizanother", score: 96, name: "yellow"}});
    const res11 = httpMocks.createResponse();
    saveScore(req11, res11);
  
    assert.strictEqual(res11._getStatusCode(), 200);
    assert.deepStrictEqual(res11._getData(),
    {name: req11.body.name});

})

})
