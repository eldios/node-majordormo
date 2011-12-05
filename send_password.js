#!/usr/bin/env node
var util=require('util'),
    events=require('events'),
    mailer = require('/usr/lib/node_modules/nodemailer/'),
    config = require('./configML.js') ;

mailer.SMTP = {
    host: config.SMTPhost ,
    port: config.SMTPport,
    ssl:  config.SMTPssl ,
    use_authentication: config.SMTPuseAuth ,
    user: config.myMailAddress,
    pass: config.myPassword
}

// Message object
var message = {
    sender:   config.myMailAddress ,
    to:       config.myMailAddress ,
    subject:  config.mailSubject,
    debug:  false,
    headers: {
      "X-Mailer": config.MUA
    }
};

var recipientsML = config.recipientsML ;

var mailFlusher = function(maxConn){
  var maxConnections = maxConn || 3 ,
      runningSend = 0 ;
  events.EventEmitter.call(this);
};
util.inherits(mailFlusher,events.EventEmitter);

mailFlusher.prototype.sendMail = function(msg,rec,mailer){
  var exitCB = function(error,success){
    if(error){
      this.emit("sendError");
    };
    if(success){
      this.emit("sendSuccess");
    }
    if(!success){
      this.emit("sendFailed");
    };
  };

  if (rec.length <= 0){
    return ;
  };
  if (rec.length > 0 && this.runningSend < this.maxConnections){
    var dest = rec.pop();
    console.log('User data is: <' + dest.address + 
                '> -> ' +dest.password);
    msg['body']=dest.address;
    try {
      this.runningSend = this.runningSend+1;
      mailer.send_mail(msg,exitCB);
    } catch(e){
      console.log(e);
    }
  };
};

var MF = new mailFlusher(3);

MF.on('sendError',function(err,succ){
  console.log(e);
});
MF.on('sendSuccess',function(err,succ){
  this.runningSend = this.runningSend-1;
  console.log(e);
});
MF.on('sendFailed',function(err,succ){
  console.log(e);
});

MF.sendMail(message,recipientsML,mailer);