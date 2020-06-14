const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.listen(process.env.PORT || 5555,function(){
   console.log("Server started...");
});

app.post("/",function(req,res){
    const fName=req.body.fname;
    const lName=req.body.lname;
    const email=req.body.email;

    const data={  //data to be sent to mailchimp
      members:[    //compulsory field: obtained from mailchimp and it should be "members" not "member" even for single object
        {
          email_address:email,//field elements
          status:"subscribed",
          merge_field:{
            FNAME:fName,//field to be added to mailchimp list
            LNAME:lName //field to be added to mailchimp list
          }
        }
      ]
    };

    const datastringified=JSON.stringify(data);//convert the JSON to string to be sent to mailchimp
    const url=" https://us10.api.mailchimp.com/3.0/lists/bcbfd2df9d";//url of mailchimp with X=10 and listID=bcbfd2df9d

    const options={ //compulsory field
           method:"POST", //tells the request function to post the data to mailchimp
           auth:"abcd:5ac0315b069ff76c7b5024d87fcf975b-us10"//here abcd can be any string and the next is api-key for authorization
    };

    const request=https.request(url,options,function(response){ //used for posting data to mailchimp
          if(response.statusCode===200){//if successful
            res.send("Successfully subscribed!");
          }else
            res.send("Please try again!");
         response.on("data",function(data){// post when "data" is recieved
           console.log(JSON.parse(data));//for confirmation for the developer
         });
    });


    request.write(datastringified);//send the stringfied data
    request.end();//end once posted or written
});

 // bcbfd2df9d --- list id
 // https://usX.api.mailchimp.com/3.0/lists/{list_id}/members/{email_id}/notes/{id}
 // 5ac0315b069ff76c7b5024d87fcf975b-us10 --- api key

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});
