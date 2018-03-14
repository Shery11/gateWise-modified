const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
admin.initializeApp(functions.config().firebase);
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: 'b0580eb4',
  apiSecret: '46872c23e22e7a59',
  applicationId: 'b5484819-09d7-4819-811a-299c728d913b',
  privateKey:'./private1.key' 

  // "-----BEGIN PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCzeZIvHVFFtsAelmIWQyW7hsjh/GnataY1VvxBu6TJM9qYwJDhRcvrzDQjQDkvz+/7EBG0Q0w36CUH/2y2Gq5K2F5pg243hJ8e3hq96SNokIRXj6teI7d0li3cM8KPCCCN+/mYzhp/J1KzG57a+nPN9h8gWeIyLYw2Z70wR4KI2xLI3DIGNrlzxeuRvdlen9MVwUOEbEeSF5818sm/LIQ8VLJYkT9GLneUjJVp09EcEHK4SEIHT43V2ZZxW0mBpUwicidrXsH8AiOV1v7Pp7Z3Y9zd8mStYOBtDI4tDVK2zK7IwyVzPcqEscNql76DXRohS4dinZSkX3NWiBwVOfXAgMBAAECggEAC8nmC7TL6/hsHGVLEcNBzchvAAF0EEuY3Prca4Od4G2z155SPr/JHWueqqA905n3Q6gKY76266Q81XnyImaSXs5PQctYvT1DJSFbsi12WdPd56sqY9kN3EKkd8Vt4hKtbPPxoqGSgmd1JVelv/ZR2eZpRW+XUmHDFMW2pt0g8kADTlQi04gghJyV3BU9u35SppOavcQBGkPyowTvuvdwyJ4yPRQf/OjADdFAs7/vqzkJ6SultVBE6nTEL9SHH1pGbwLC+G0/3gn9rMxV+xYWzngC+pyiyZe2chihV9SOTojnREI+VVVQSf18Ia7MZzRONU+kmGpvfq80KQKHdzQksQKBgQD72AojuCe8e8tfA+wg/UnkYAV6P+vHGbpP40kIB0FZDWIKtXXjpUvDhBTmJFkmrZRIz9tX8C2HPMfU2zByoxq6RyeyZ8hDVPalclV13u+cptPsS7Ic7sJJTH0HgoXChFk3UMBou9hbAQJJh1tEQIF/WbIaKpK6N2JmuaefHyGTqwKBgQDGBOK/VbjUQ7sCVj3Nc60LsjVQXWXj7sx7XdAqiYQcNI2tVkGEAN7YPHZ0RvPT9KrXqPH6FqWZHEaWO4jIK9HKj/h8ggxxtbHBr9K6YkZdsYAOIwU6ofs6m4UthaW5tWOHJyg/9Ra3UNdK19amqoaSteLVdlJ++IpvwMW1v3mQhQKBgD7NbiHgL5CSMnH8UWscnsujoloNDKf2434+iJzG6mXhr3xKKh7dvpoAGxIVKGI70QmjQ+iXDVN3NcH/8wHzaJvhWKXluYwI6QTzERq2wHwJIjn/2mfapnqO53Ly+pY6WOExcvnrNhXjl4VsirbneyOd44sg6LwlSZWiYImOwtnHAoGBAJPnnFHbvnVVrb4+GmV2DH/a+TVwvaU1fah71vuewX2rx1L8RW1KlSigaL3LLV5Ytq7ksvDgr4ogc5zNFQqmqEmLpceh/5eDZiVMpbKvqu1aolJs2AAGczdAaIYq+DExCgkuN0MmVnRQPq7ZbqwIXQICN07H1TCfhg+YxlRNk4hdAoGAPDIKgx1rulT0JMMYHbFlTWZk7g5uErse0Rt/rtye9ReMmShOluTWOEn6KDQNBpV5lSmzIUpzIf4niJCJjPZJSSS0vZwhxLOLhANbMYSzuhIwy91Er//z1J5mv4UPcViX9Q69/EmjX/DJDcE8LtSKjANeCq+Uuc6dkU8tcEcI2wo=-----END PRIVATE KEY-----",

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
                                number: '19014979356'

                                //19014979356
                              }],
                              from: {
                                type: 'phone',
                                number: '12014935230'
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



});



exports.get_status = functions.https.onRequest((request, response) => {

  var uuid = request.body.uuid;

  nexmo.calls.get(uuid, (err,res)=>{
    if(err){

      response.json({success: false,error: err});

    }else{

      response.json({success: true,data: res});

    }
  });

 

});


// exports.event_url = functions.https.onRequest((request, response) => {


//    console.log(request.body);
//    response.json(request.body.status);
 

// });