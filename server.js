const express = require("express");
const cors = require("cors");
const axios = require("axios");

const douyin = require("./parsers/douyin");
const kuaishou = require("./parsers/kuaishou");
const xiaohongshu = require("./parsers/xiaohongshu");


const app = express();


app.use(cors());

app.use(express.json());



// 测试

app.get("/", (req,res)=>{

    res.json({

        status:"ok",

        message:"去水印API运行正常"

    });

});




// 判断平台

function detectPlatform(url){

    if(url.includes("douyin.com")){

        return "douyin";

    }


    if(url.includes("kuaishou.com")){

        return "kuaishou";

    }


    if(url.includes("xiaohongshu.com")){

        return "xiaohongshu";

    }


    return "unknown";

}






// 解析接口

app.post("/api/parse", async(req,res)=>{


    const url=req.body.url;


    if(!url){

        return res.json({

            success:false,

            message:"请输入链接"

        });

    }




    let platform=detectPlatform(url);



    let data;



    try{


        if(platform==="douyin"){

            data=await douyin.parse(url);

        }



        if(platform==="kuaishou"){

            data=await kuaishou.parse(url);

        }



        if(platform==="xiaohongshu"){

            data=await xiaohongshu.parse(url);

        }




        if(!data){

            return res.json({

                success:false,

                message:"解析失败"

            });

        }




        res.json({

            success:true,

            platform,

            data

        });



    }catch(e){


        res.json({

            success:false,

            message:e.message

        });


    }


});









// 视频代理

app.get("/api/video", async(req,res)=>{


    const url=req.query.url;



    if(!url){

        return res.status(400).send("没有视频地址");

    }



    try{


        const headers={


            "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",


            "Referer":
            "https://www.douyin.com/",



        };



        if(req.headers.range){

            headers.Range=req.headers.range;

        }






        const response=await axios({

            method:"GET",

            url:url,

            headers:headers,

            responseType:"stream",

            validateStatus:function(){

                return true;

            }

        });






        res.status(response.status);



        res.setHeader(
            "Content-Type",
            response.headers["content-type"] || "video/mp4"
        );



        res.setHeader(
            "Accept-Ranges",
            "bytes"
        );



        if(response.headers["content-length"]){

            res.setHeader(
                "Content-Length",
                response.headers["content-length"]
            );

        }



        if(response.headers["content-range"]){

            res.setHeader(
                "Content-Range",
                response.headers["content-range"]
            );

        }




        response.data.pipe(res);



    }catch(error){


        console.log(error.message);


        res.status(500).send(
            "视频代理失败"
        );


    }


});








const PORT =
process.env.PORT || 3000;



app.listen(PORT,()=>{


console.log(
"server running "+PORT
);


});
