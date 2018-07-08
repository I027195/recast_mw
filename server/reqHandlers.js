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
	callUrl,
	sendMail,
	nodeMailer = require('nodemailer'),
	axiosBase = require('axios'),
	axios = axiosBase.create({
		baseURL: 'http://mo-ad9aab1ac.mo.sap.corp:8000',
		headers: {
			'ContentType': 'application/json',
			'X-Requested-With': 'XMLHttpRequest'
		},
		responseType: 'json'
	})
	;

// Module Scope Variant <<< End
//===================================


//===================================
// Utility Method >>> Start


// Utility Method <<< End
//===================================


//===================================
// Public Methods >>> Start

callUrl = function ( url, callback, option = null ) {
	axios.get( url ).then( function( response ) {
		console.log('>>> Data part of response by axios >>>');
		console.log( response.data );
		console.log('<<< End of data part of response by axios <<<');

		if ( response.status === 200 ){
			callback();
		}
		else {
			console.log ("!!! Different status from URL, Status: " + response.status );
		}
	})
	.catch( function ( error ) {
		console.log( "!!! Error was happened when calling URL, Error: " + error );
	});
};

sendMail = function ( recastMemory ){
	const
		mailService = 'Zoho',
		mailUserSender = 'm.fukuda@zoho.com',
		mailUserReceiver = 'sap.solman.hd@sap.com',
		mailPass = 'sapjapan';
	var
		mailSubject = "Incident:" + recastMemory.ordertype.value + "の" + recastMemory.operation.value + "でエラーが発生",
		mailContents = "ユーザーI021259が" + recastMemory.time.value + "頃に" + recastMemory.ordertype.value + "の" + recastMemory.operation.value + "でエラーが発生しています";

	console.log('>>> Mail information >>>');
	console.log( "Subject: " + mailSubject );
	console.log( "Contents: " + mailContents );
	console.log('<<< Mail information ');

	nodeMailer.createTestAccount( function( err, account ) {
		// Create reusable transporter object using the default SMTP transport
		let transporter = nodeMailer.createTransport({
			service: mailService,
			auth: {
				user: mailUserSender,
				pass: mailPass
			}
		});
		console.log('This is just after CreateTransport');

		// Setup email data with unicode symbols
	    let mailOptions = {
	        from: mailUserSender, // sender address
	        to: mailUserReceiver, // list of receivers
	        subject: mailSubject,
	        text: mailContents
			//html: '<b>Hello world?</b>' // html body
	    };
	    console.log('This is just after mailOptions');

	    // send mail with defined transport object
	    transporter.sendMail( mailOptions, (error, info) => {
			console.log ('Error: ' + error );
			console.log ('Info: ' + info );
	        if (error) {
	            return console.log('Error: ' + error );
	        }
			
	        console.log('Message sent: %s', info.messageId);
	        // Preview only available when sending through an Ethereal account
	        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

	        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	    });
	});
}

module.exports = {
	callUrl : callUrl,
	sendMail : sendMail
};

// Public Methods <<< End
//===================================

