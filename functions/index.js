const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
admin.initializeApp(functions.config().firebase);
const Nexmo = require('nexmo');
const cors = require('cors')({origin: true});



const nexmo = new Nexmo({
  apiKey: 'b0580eb4',
  apiSecret: '46872c23e22e7a59',
  applicationId: 'b5484819-09d7-4819-811a-299c728d913b',
  privateKey:'./private1.key' 
});



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//  
exports.get_gates = functions.https.onRequest((request, response) => {

  cors(request, response, () => {

  var sKey = request.body.secretKeyId;
  console.log(sKey);
  admin.database().ref('keys/'+sKey+'/gates/').once("value", (snapShot)=>{

      if(snapShot.val() === null){
        
        response.json({success: false,data: snapShot.val()});

      }else{
         response.json({success: true,data: snapShot.val()});

      }
    
    

    })

  })

});



exports.open_gate = functions.https.onRequest((request, response) => {

  cors(request, response, () => {


   var sKey = request.body.secretKeyId;
   var gKey = request.body.secretgateId
     console.log(sKey);
     console.log(gKey);
     
     admin.database().ref('keys/'+sKey+'/gates/'+gKey+'/').once("value", (snapShot)=>{
    
        if(snapShot.val() === null){

          response.json({success: false,error: snapShot.val()});

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
                         // response.json({success: true,data: data});

                             // all conditions satisfied now make nexmo call

                         

                         nexmo.calls.create({
                              to: [{
                                type: 'phone',
                                number: toNumber

                                //19014979356
                              }],
                              from: {
                                type: 'phone',
                                number: fromNumber
                              },
                              answer_url: ["http://example.com/answer"]
                            },(error, res) => {
                              if (error) {
                                response.json({success: false,error: error});
                              } else {

                                 // decrement timeused

                                 var tu = data.timeUsed - 1;

                                 admin.database().ref('keys/'+sKey+'/gates/'+gKey+'/').update({
                                   timeUsed: tu
                                 }).then((data)=>{

                                   response.json({success: true,data: res});

                                 });

                                
                              }
                            });

 

                      }else{
                              response.json({success: false,error: "timestamp, not in range"});
                      }

                })

               }else{

                  response.json({success: false,error: "Time used is equal to 0"});

                }

     

             

        }

     })


   })



});



exports.get_status = functions.https.onRequest((request, response) => {

 cors(request, response, () => {

  var uuid = request.body.uuid;


    nexmo.calls.get(uuid, (err,res)=>{
      if(err){

        response.json({success: false,error: err});

      }else{

        response.json({success: true,data: res});

      }
    });

  })

 

});


// exports.event_url = functions.https.onRequest((request, response) => {


//    console.log(request.body);
//    response.json(request.body.status);
 

// });