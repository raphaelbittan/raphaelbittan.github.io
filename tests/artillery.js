/*
 * Artillery Custom Functions
 * The JS file is expected to be a standard Node.js module
 */

module.exports = {
	checkStatus: checkStatus,
    setJSONBody: setJSONBody,
    logHeaders: logHeaders
}

/*
 * action, beforeScenario and afterScenario
 * Functions invoked with a function action, beforeScenario and afterScenario
 *		function myFunction(context, ee, next) {}
 * Where =>
 *  context is the virtual user's context, context.vars is a dictionary containing all defined variables
 *  ee is an event emitter that can be used to communicate with Artillery
 *  next is the callback which must be called for the scenario to continue; it takes no arguments
 */

function checkStatus(context, next) {
  const continueLooping = context.vars.status !== 'ready';
  return next(continueLooping); // call back with true to loop again
}

function setupSomeData(context, events, done) {
  context.vars['query'] = 'foo'; // set the "query" variable for the virtual user
  return done();
}

/*
 * beforeRequest
 * A function invoked in a beforeRequest hook should have the following signature:
 *		function myBeforeRequestHandler(requestParams, context, ee, next) {}
 * Where =>
 *  requestParams is an object given to the Request library. Use this parameter to customize what is sent in the request (headers, body, cookies etc)
 *  context is the virtual user's context, context.vars is a dictionary containing all defined variables
 *  ee is an event emitter that can be used to communicate with Artillery
 *  next is the callback which must be called for the scenario to continue; it takes no arguments
 */

function setJSONBody(requestParams, context, ee, next) {
  return next(); // MUST be called for the scenario to continue
}

/*
 * afterResponse
 * A function invoked in an afterResponse hook should have the following signature:
 * 		function myAfterResponseHandler(requestParams, response, context, ee, next) {}
 * Where =>
 * 	requestParams is an object given to the Request library. Use this parameter to customize what is sent in the request (headers, body, cookies etc)
 *	response is likewise the response object from the Request library. This object contains response headers, body etc.
 *	context is the virtual user's context, context.vars is a dictionary containing all defined variables
 *	ee is an event emitter that can be used to communicate with Artillery
 *	next is the callback which must be called for the scenario to continue; it takes no arguments
 */

function logHeaders(requestParams, response, context, ee, next) {
  console.log(response.headers);
  return next(); // MUST be called for the scenario to continue
}