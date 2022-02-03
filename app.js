const express = require("express");
const bodyParser = require("body-parser");
const  https = require('https');

const app = express();

app.use(express.static("public"));

app.use( bodyParser.urlencoded({extended:true}) );

app.get("/" , function(req,res){
   res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    //make data object as per mailchimp api documentation
    const data = {
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                     FNAME:firstName,
                     LNAME:lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/f6fba9265e";

    //unique listId or audience id get from mailchimp
    const listID = "f6fba9265e";
    //as per node https method make ready option method parameter for mailchimp post and auth 
    const option = {
        method:"POST",
        auth:"atib_shaikh:708290c4c0cb986caf617857d6564441-us14"

    }
    const request = https.request(url,option,function(response){
        
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");

        }

        
        response.on("data", function(data){
             console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end(); 

    console.log(firstName,lastName,email);

    
})

app.listen(3000,function(){
    console.log('server started on 3000');
})

// MAILCHIMP API KEY
// 708290c4c0cb986caf617857d6564441-us14

// list id
// f6fba9265e