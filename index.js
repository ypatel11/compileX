const express = require("express");
const app = express();
const bparse = require("body-parser")
const compilex = require("compilex")
const options = { stats: true };
const cors = require('cors');

app.use(
    cors({
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    })
  );


compilex.init(options)
app.use(bparse.json())
app.use("/codemirror/codemirror-5.65.16", express.static("E:/LATEST_WEBDEV/CODE_COMPILER/codemirror/codemirror-5.65.16"))

// app.use(express.static("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"))
app.get("/", async (req, res) => {
    try {
        try{
            compilex.flush(function(){
                console.log("DELETED OLD FILES ")
            })
        }
       catch{
        console.log("error in file deletion")
       }
      res.sendFile("E:/LATEST_WEBDEV/CODE_COMPILER/index.html")
    }
    catch {
        console.log("err")
    }
})

app.post("/compile", (req, res) => {
    var code = req.body.code
    var input = req.body.input
    var lang = req.body.lang
    try {
        if (lang =="C++" || lang=="C" ) {
            if (!input) {
                var envData = { OS: "windows", cmd: "g++" ,options:{
                    timeout:10000

                }}; // (uses g++ command to compile )
                //else
                var envData = { OS: "linux", cmd: "gcc" ,options:{
                    timeout:10000

                }}; // ( uses gcc command to compile )
                compilex.compileCPP(envData, code, function (data) {
                    res.send(data);
                    //data.error = error message 
                    //data.output = output value
                });
            }
            else {
                //if windows  
                var envData = { OS: "windows", cmd: "g++" ,options:{
                    timeout:10000

                }}; // (uses g++ command to compile )
                //else
               // ( uses gcc command to compile )
                compilex.compileCPPWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        }

        else if (lang =="JAVA") {
            if (!input) {
                //if windows  
                var envData = { OS: "windows" ,cmd:"java"};
                //else
                // (Support for Linux in Next version)
                compilex.compileJava(envData, code, function (data) {
                    res.send(data);
                });
            }
            else {
                //if windows  
                var envData = { OS: "windows" ,cmd:"string"};
                //else
                 // (Support for Linux in Next version)
                compilex.compileJavaWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        }
        else if (lang =="Python") {
            if (!input) {
                //if windows  
                var envData = { OS: "windows" };
                //else
                var envData = { OS: "linux" };
                compilex.compilePython(envData, code, function (data) {
                    res.send(data);
                });
            }
            else {
                //if windows  
                var envData = { OS: "windows" };
                //else
                var envData = { OS: "linux" };
                compilex.compilePythonWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        }
    }
    catch {
        res.send("ERROR")
    }
 
})
app.listen(3000, () => {
    console.log("RUNNING ")
})