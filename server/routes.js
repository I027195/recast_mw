/*
* app.js
*/
/*jslint node : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/
/*global */

'use strict';

//===================================
// Module Scope Variant >>> Start

var
	configRoutes,
	_loggingUU,
	_loggingCI,
	reqHandlers = require( './reqHandlers' )
	;

// Module Scope Variant <<< End
//===================================

//===================================
// Utility Method >>> Start

_loggingUU = function ( reqBody ) {
	console.log('### The beginning of "unlock_user". ###');
	console.log('>>> Body part of "unlock_user". >>>');
	console.log( reqBody );
	console.log('<<< End of body part of "unclock_user". <<<');
};

_loggingCI = function ( recastMemory ) {
	console.log('### The beginning of "create_incident". ###');
	console.log('>>> Order Type information >>>');
	console.log( recastMemory.ordertype );
	console.log( recastMemory.ordertype.value );
	console.log('<<< Order Type information <<<');
	console.log('>>> Time information >>>');
	console.log( recastMemory.time );
	console.log( recastMemory.time.value );
	console.log('<<< Time information <<<');
};

// Utility Method <<< End
//===================================


//===================================
// Public Method >>> Start

configRoutes = function( app, server )
{
	app.all( '/*', function ( request, response, next ){
		//response.contentType ( 'json' );
		response.setLocale(request.body.conversation.language)
		next();
	});
	/*
	app.get( '/', function ( request, response )
	{
		response.redirect( '/index.html' );
	});
	*/
	app.post( '/unlock_user', function( request, response ){
		
		var
			recastMemory = request.body.conversation.memory,
			unlockTarget = "/sap/bc/webrfc?_FUNCTION=ZFKD_TEST_WEBRFC&_Name=" + recastMemory.sapuserid.value;

		_loggingUU( request.body );

		reqHandlers.callUrl( unlockTarget, function(){
			response.send({
				replies: [{
					type: 'text',
					content: response.__('unlockUser.msgSuccess')
				}],
				conversation: {
					memory: { key: 'value' }
				}
			});
		});

	});
	app.post( '/create_incident', function( request, response ){

		var
			recastMemory = request.body.conversation.memory
			;

		_loggingCI( recastMemory );

		reqHandlers.sendMail( recastMemory );

		response.send({
			replies: [{
				type: 'text',
				content: response.__('createIncicdent.msgSuccess')
			}],
			conversation: {
				memory: { key: 'value' }
			}
		});
	});

	app.post('/errors', function( request, response ){
		console.log( request.body );
		response.send();
	});

};


// Public Method <<< End
//===================================


//===================================
// Module Initialization >>> Start

module.exports = { configRoutes : configRoutes };

// Module Initialization <<< End
//===================================