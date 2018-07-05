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
	configRoutes;
	//crud = require( './crud' ),
	//chat = require( './chat' ),
	//makeMongoId = crud.makeMongoId;

// Module Scope Variant <<< End
//===================================

//===================================
// Utility Method >>> Start

// Utility Method <<< End
//===================================


//===================================
// Public Method >>> Start

configRoutes = function( app, server, axios, nodeMailer )
{
	/*
	app.get( '/', function ( request, response )
	{
		response.redirect( '/index.html' );
	});
	*/
	/*
	app.all( '/*', function ( request, response, next ){
		response.contentType ( 'json' );
		next();
	});
	*/
	app.post( '/unlock_user', function( request, response ){
		
		var
			recastMemory = request.body.conversation.memory,
			unlockTarget = "/sap/bc/webrfc?_FUNCTION=ZFKD_TEST_WEBRFC&_Name=" + recastMemory.sapuserid.value;

		console.log('### The beginning of "unlock_user". ###');
		console.log('>>> Body part of "unlock_user". >>>');
		console.log( request.body );
		console.log('<<< End of body part of "unclock_user". <<<');

		axios.get( unlockTarget ).then( function( res ) {
			console.log('>>> Data part of "response.data". >>>');
			console.log( res.data );
			console.log('<<< End of data part of "response.data". <<<');

			response.send({
				replies: [{
					type: 'text',
					content: 'ユーザーのアンロックが完了しました。ログオン可能かご確認下さい。'
				}],
				conversation: {
					memory: { key: 'value' }
				}
			});
		})
		.catch( function ( error ) {
			console.log( error );
		});

	});
	app.post( '/create_incident', function( request, response ){

		const
			mailService = 'Zoho',
			mailUserSender = 'm.fukuda@zoho.com',
			mailUserReceiver = 'sap.solman.hd@sap.com',
			mailPass = 'sapjapan';

		var
			recastMemory = request.body.conversation.memory,
			mailSubject = "Incident:" + recastMemory.ordertype.value + "の" + recastMemory.operation.value + "でエラーが発生",
			mailContents = "ユーザーI021259が" + recastMemory.time.value + "頃に" + recastMemory.ordertype.value + "の" + recastMemory.operation.value + "でエラーが発生しています";

		console.log('### The beginning of "create_incident". ###');
		console.log('>>> Order Type information >>>');
		console.log( recastMemory.ordertype );
		console.log( recastMemory.ordertype.value );
		console.log('>>> Time information >>>');
		console.log( recastMemory.time );
		console.log( recastMemory.time.value );
		console.log('>>> Mail information >>>');
		console.log( mailSubject );
		console.log( mailContents );

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

		response.send({
			replies: [{
				type: 'text',
				content: 'インシデントが正常に登録されました。明日12時までに担当者よりご連絡差し上げます。なお、お急ぎの場合は 0120-XXX-XXX までご連絡頂けます様お願い致します。'
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