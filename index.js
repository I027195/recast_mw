const express = require('express')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

const app = express()
const port = 3000
app.use(bodyParser.json())

// axios を require してインスタンスを生成する
const axiosBase = require('axios');
const axios = axiosBase.create({
  baseURL: 'http://mo-ad9aab1ac.mo.sap.corp:8000', // CHK の URL:port を指定する
  headers: {
    'ContentType': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
});

// 待機時間を演出する
//      function sleep(delay) {
//        var start = new Date().getTime();
//        while (new Date().getTime() < start + delay);
//      }


app.post('/unlock_user', (req, res) => {

  console.log('The beginning of app.post_unlock_user')
  console.log('The beginning of body part of unlock_user')
  console.log(req.body)
  console.log('The end of body part of unlock_user')

  const memory2 = req.body.conversation.memory;
  
  var unlock_target;
  unlock_target = "/sap/bc/webrfc?_FUNCTION=ZFKD_TEST_WEBRFC&_Name=" + memory2.sapuserid.value;
  
//  axios.get('/sap/bc/webrfc?_FUNCTION=ZFKD_TEST_WEBRFC&_Name=fukuda2')
  axios.get(unlock_target)
  .then(function(response) {
    console.log('The beginning of GET of response.data');
    console.log(response.data);
    console.log('The end of GET of response.data');

//  日本語文字化けのため、下記の行を追加したがNGだった。解決策は、jsファイル自体のフォーマットをutf-8にする事だった。		
//   res.header('Content-Type', 'text/plain;charset=utf-8');
   
   res.send({
    replies: [{
      type: 'text',
	  content: 'ユーザーのアンロックが完了しました。ログオン可能かご確認下さい。'
//      content: 'User is successfully unlocked.',
    }],
    conversation: {
      memory: { key: 'value' }
    }
  })

  })
  .catch(function(error) {
    console.log(error);
  });


//  res.send({
//    replies: [{
//      type: 'text',
//      content: 'ユーザーをアンロックしますので少々お待ちください',
//    }],
//    conversation: {
//      memory: { key: 'value' }
//    }
//  })
})

app.post('/create_incident', (req, res) => {

  console.log(req.body);
  const memory = req.body.conversation.memory;
  console.log('This is ordertype Info');
  console.log(memory.ordertype);
  console.log(memory.ordertype.value);
  console.log('This is time Info');
  console.log(memory.time);
  console.log(memory.time.value);

  const hiragana_no = 'の';
  
  var mail_subject;
  mail_subject = "incident:" + memory.ordertype.value + "の" + memory.operation.value + "でエラーが発生";
  var mail_content;
  mail_content = "ユーザーI021259が" + memory.time.value + "頃に" + memory.ordertype.value + "の" + memory.operation.value + "でエラーが発生しています";
//  mail_content = "ユーザーI021259が" + memory.time.value + "頃に" memory.ordertype.value + "の" + memory.operation.value + "でエラーが発生しています";
  
  console.log(mail_subject);
  console.log(mail_content);
  
  
  
  
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
		 service: 'Zoho',
//        host: 'mailsin.sap.corp',
//        port: 25,
//        secure: false, // true for 465, false for other ports
        auth: {
        //    user: account.user, // generated ethereal user
        //    pass: account.pass // generated ethereal password
		    user: 'm.fukuda@zoho.com',
            pass: 'sapjapan' 
        }
    });

	console.log('This is just after CreateTransport');
	
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'm.fukuda@zoho.com', // sender address
//		to: 'm.fukuda@sap.com', // list of receivers
        to: 'sap.solman.hd@sap.com', // list of receivers
        subject: mail_subject,
//        subject: 'incident: Sales Order cannot be created', // Subject line
        text: mail_content
//        text: 'Sales Order cannot be created as an error is happening when tried to save it. Please solve it ASAP!' // plain text body
//       html: '<b>Hello world?</b>' // html body
    };
	
    console.log('This is just after mailOptions');

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
		console.log (error);
		console.log (info);
        if (error) {
            return console.log(error);
        }
		
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    })
})

   res.send({
    replies: [{
      type: 'text',
      content: 'インシデントが正常に登録されました。明日12時までに担当者よりご連絡差し上げます。なお、お急ぎの場合は 0120-XXX-XXX までご連絡頂けます様お願い致します。'
//      content: 'Incident was successfully created. Please wait for a contact from message processor',
    }],
    conversation: {
      memory: { key: 'value' }
    }
  })


})

app.post('/errors', (req, res) => {
  console.log(req.body)
  res.send()
})

app.listen(port, () => {
  console.log('Server is running on port 3000')
})
