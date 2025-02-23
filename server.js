const http = require("http");
const fs = require("fs");
const port = 3000;
const ip = "172.28.246.224";//"192.168.124.17";
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
				console.log("SEND 500 - Sorry, internet error\n ERROR: "+ err)
            }else{

                if (response.headersSent) return

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
					// console.log(response)
                    response.setHeader("Content-Type", "image/ico;");
                }else if (pathname.substr(-3) === "ico"){
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
	console.log(request.method + " request recieved:" + request.url)

    if (request.method === "GET"){ //GET
        const requestUrl = new URL(request.url, `http://${ip}:${port}`);
        const pathname = requestUrl.pathname;

        if (response.headersSent) return

        if (pathname.substr(-3) === "css"){
			console.log("GET 200 - success")
            sendResponse(pathname, 200, response)
			return
        }
		
		if (pathname.substr(-2) === "js"){
			console.log("GET 200 - success")
            sendResponse(pathname, 200, response)
			return
        }
		
		if (pathname.substr(-3) === "ico"){
			console.log("GET 200 - success")
            sendResponse(pathname, 200, response)
			return
        }
		
		if (pathname.substr(-3) === "txt"){
			console.log("GET 200 - success")
            sendResponse(pathname, 200, response)
			return
        }
		
		if (pathname.substr(-3) === "png"){
			console.log("GET 200 - success")
            sendResponse(pathname, 200, response)
            return
        }

		//html

		if (pathname === "/"){
			console.log("GET 200 - success")
			sendResponse("/home.html", 200, response)
			return
		}
		
		var slash_count = 0;
		var pos_of_last_slash = 0;
		var direc=".";
		for(i=0; i<pathname.length; i++){
			if(pathname[i]==="/"){
				slash_count++;
				pos_of_last_slash = i;
			}
		}
		if(slash_count>1){
			direc="."+pathname.substring(0,pos_of_last_slash);
		}
		
		fs.readdir(direc, (err, data) => {
			if (err){
				console.log("GET 404 - site not found\nERROR: "+err)
				sendResponse("/404.html", 404, response)
				return
			}
			
			var files = []
			for (i=0; i < data.length; i++){
				if (data[i].substr(-4) === "html"){
					files.push(data[i]);
				}
			}
			
			for (i = 0; i < files.length; i++){
				if (pathname.substring(pos_of_last_slash+1) === files[i]){
					sendResponse(pathname, 200, response)
					return
				}
				
				if (pathname.substring(pos_of_last_slash+1) === files[i].substring(0, files[i].length-5)){
					var repathname = `${pathname}.html`;
					sendResponse(repathname, 200, response)
					return
				}
			}

			console.log("GET 404 - site not found")
			sendResponse("/404.html", 404, response)
			return
		})
    }else{ //POST
        if (request.url === "/process-login"){
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