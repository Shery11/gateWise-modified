const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
admin.initializeApp(functions.config().firebase);
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: 'b0580eb4',
  apiSecret: '46872c23e22e7a59',
  applicationId: '0da7dcd6-8525-4463-8320-7bcabf86e858',
  privateKey: './private.key',

});



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.get_gates = functions.https.onRequest((request, response) => {

  var sKey = request.body.secretKeyId;
  console.log(sKey);
  admin.database().ref('keys/'+sKey+'/gates/').once("value", (snapShot)=>{

  	  if(snapShot.val() === null){
        
  	  	response.json({success: false,data: snapShot.val()});

  	  }else{
      	 response.json({success: true,data: snapShot.val()});

  	  }
    
    

    })

});



exports.open_gate = functions.https.onRequest((request, response) => {


	 var sKey = request.body.secretKeyId;
	 var gKey = request.body.secretgateId
     console.log(sKey);
     console.log(gKey);
     
     admin.database().ref('keys/'+sKey+'/gates/'+gKey+'/').once("value", (snapShot)=>{
    
        if(snapShot.val() === null){

  	    	response.json({success: false,data: snapShot.val()});

  	    }else{


  	    	    console.log(moment().unix());

  	    	    var timeStamp = moment().unix()
                var data = snapShot.val();

                if(data.timeUsed > 0 ){

                	// check if unix timestamp is with in range

                	  admin.database().ref('keys/'+sKey+'/').once("value", (snapShot)=>{

                	  	var keyData = snapShot.val();

                	  	var ts_end = keyData.ts_end;
                	  	var ts_start = keyData.ts_start;
                        var fromNumber = data.from;
                        var toNumber = data.to; 
                	  	
                	  	console.log(fromNumber,toNumber);

                	  	if(timeStamp > ts_start && timeStamp < ts_end ){
                	  		console.log("Within range");
                	  		 response.json({success: true,data: data});

                             // all conditions satisfied now make nexmo call



                	  	}else{
                              response.json({success: false,data: "timestamp, not in range"});
                	  	}


                	  	

                	  })



                	

                }else{

                	response.json({success: false,data: "Time used is equal to 0"});

                }

  	 

  	    	   

  	    }

     })



});



exports.get_status = functions.https.onRequest((request, response) => {

 

});