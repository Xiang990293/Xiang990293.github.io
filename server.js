const http = require("http");
const fs = require("fs");
const port = 3000;
const ip = "127.0.0.1";//"192.168.124.17";
const qs = require("querystring");
const express = require("express");
const app = express();
const jquary = require("jquery");
const path = require("path");

//宣告響應函數
const sendResponse = (pathname, statusCode, response) => {
    
    if (pathname.substr(-3) === "ico"){

        response.setHeader("Content-Type", "image/ico");

        fs.readFile(`${pathname.substr(1)}`, (err, data) => {
            if (err){
                response.end("picture not found");
            }else{
                response.end(data);
            }
        })

    }else{

        fs.readFile(`${pathname.substr(1)}`, (err, data) => {
            if (err){

                response.statusCode = 500;
                response.setHeader("Content-Type", "text/plain");
                response.end("Sorry, internet error");

            }else{

                response.statusCode = statusCode;

                if (pathname.substr(-4) === "html"){
                    response.setHeader("Content-Type", "text/html; charset=UTF-8");
                }else if (pathname.substr(-3) === "css"){
                    response.setHeader("Content-Type", "text/css; charset=UTF-8");
                }else if (pathname.substr(-2) === "js"){
                    response.setHeader("Content-Type", "text/javascript; charset=UTF-8");
                }else if (pathname.substr(-3) === "txt"){
                    response.setHeader("Content-Type", "text/plain; charset=UTF-8");
                }else if (pathname.substr(-3) === "png"){
                    response.setHeader("Content-Type", "image/ico;");
                }else{
                    response.setHeader("Content-Type", "text/plain; charset=UTF-8");
                }

                response.write(``);
                response.end(data);

            }
        });
    }
};


//請求起點
const server = http.createServer((request, response) => {
    
    // console.log(request.url, request.method);

    if (request.method === "GET"){ //GET
       
        const requestUrl = new URL(request.url, `http://${ip}:${port}`);
        const pathname = requestUrl.pathname;

        if (pathname.substr(-3) === "css"){
            //css
            sendResponse(pathname, 200, response);

        }else if (pathname.substr(-2) === "js"){
            //js
            sendResponse(pathname, 200, response);

        }else if (pathname.substr(-3) === "ico"){
            //ico
            sendResponse(pathname, 200, response);

        }else if (pathname.substr(-3) === "txt"){
            //txt
            sendResponse(pathname, 200, response);

        }else if (pathname.substr(-3) === "png"){
            //txt
            sendResponse(pathname, 200, response);

        }else{
            //html
            var isPathExist = false;

            if (isPathExist === false && pathname === "/"){

                isPathExist = true;
                sendResponse("/home.html", 200, response);

            }else if (isPathExist === false && pathname != "/"){
                var slash_count = 0;
                var pos_of_last_slash = 0;
                for(i=0; i<pathname.length; i++){
                    if(pathname[i]==="/"){
                        slash_count++;
                        pos_of_last_slash = i;
                    }
                }

                var direc=".";
                if(slash_count>1){
                    direc="."+pathname.substring(0,pos_of_last_slash);
                }
                
                fs.readdir(direc, (err, data) => {
                    if (err){
                        sendResponse("/404.html", 404, response);
                    }else{
                        var files = [];
                        for (i=0; i < data.length; i++){
                            if (data[i].substr(-4) === "html"){
                                files.push(data[i]);
                            }
                        }
                        for (i = 0; i < files.length; i++){
                            if (isPathExist === false && pathname.substring(pos_of_last_slash+1) === files[i]){
                                isPathExist = true;
                                sendResponse(pathname, 200, response);
                                break;
                            }else if (isPathExist === false && pathname.substring(pos_of_last_slash+1) === files[i].substring(0, files[i].length-5)){
                                isPathExist = true;
                                var repathname = `${pathname}.html`;
                                sendResponse(repathname, 200, response);
                                break;
                            }
                        }
                        if (isPathExist === false){
                            sendResponse("/404.html", 404, response);
                        }
                    }
                })
            }
        }
    }else{ //POST
        if (requestUrl === "/process-login"){
            let body = [];

            request,on("data", (chunk) => {
                body.push(chunk);
            });

            // request.on("end", () => {
            //     body = Buffer.concat(body.toString);
            //     body = qs.parse(body);
            //     console.log(body);

            //     if (body.username === "jhon" && body.password === "jhon123"){
            //         response.statusCode = 301;
            //         response.setHeader("Location", "/login-success.html");
            //     }else{
            //         response.statusCode = 301;
            //         response.setHeader("Location", "/login-success.html");

            //     }
            // });
        }
    }
});

server.listen(port, ip, () =>{
    console.log(`Server start running! At http://${ip}:${port}`);
});