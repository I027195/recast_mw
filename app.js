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

const nodePort = 8080;

var
	http = require( 'http' ),
	express = require( 'express' ),
	app = express(),
	server = http.createServer( app ),
	bodyParser = require( 'body-parser' ),
	methodOverride = require('method-override'),
	logger = require('morgan'),
	errorHandler = require('errorhandler'),
	nodeMailer = require('nodemailer'),
	axiosBase = require('axios'),
	axios = axiosBase.create({
		baseURL: 'http://mo-ad9aab1ac.mo.sap.corp:8000',
		headers: {
			'ContentType': 'application/json',
			'X-Requested-With': 'XMLHttpRequest'
		},
		responseType: 'json'
	}),
	i18n = require( 'i18n' ),
	// My libraries
	routes = require( './server/routes' )
	;

// Module Scope Variant <<< End
//===================================

//===================================
// Server Configuration >>> Start

// Configuration of Middleware methods.
app.use( bodyParser.json() );
app.use( methodOverride() );
//app.use( express.static( __dirname + '/frontend' ) );
// app.use( app.router ); // Deprecated in Express 4.

i18n.configure({
	locales: ['en', 'ja'],
	directory: __dirname + '/locales',
	objectNotation: true
});
app.use( i18n.init );

switch ( app.get('env') )
{
	case 'development':
		app.use( logger( 'combined' ) );
		app.use( errorHandler(
		{
			dumpExceptions : true,
			showStack : true
		}) );
		break;
	case 'production':
		app.use( errorHandler() );
		break;
}

routes.configRoutes( app, server, axios, nodeMailer );

// Server Configuration <<< End
//===================================

//===================================
// Start Server >>> Start

server.listen( nodePort );

console.log(
	'Express server listening on port %d in %s mode',
	 server.address().port,
	 app.settings.env
);

// Start Server <<< End
//===================================