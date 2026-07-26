const express = require("express");
const cors = require("cors");
const axios = require("axios");

const douyin = require("./parsers/douyin");
const kuaishou = require("./parsers/kuaishou");
const xiaohongshu = require("./parsers/xiaohongshu");


const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (req,res)=>{

    res.json({

        status:"ok",

        message:"去水印API运行正常"

    });

});





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







app.post("/api/parse", async(req,res)=>{


    const url=req.body.url;


    if(!url){

        return res.json({

            success:false,

            message:"请输入链接"

        });

    }




    let platform=detectPlatform(url);



    try{


        let data;



        if(platform==="douyin"){

            data=await douyin.parse(url);

        }


        if(platform==="kuaishou"){

            data=await kuaishou.parse(url);

        }


        if(platform==="xiaohongshu"){

            data=await xiaohongshu.parse(url);

        }





        res.json({

            success:true,

            platform:platform,

            data:data

        });



    }catch(e){


        res.json({

            success:false,

            message:e.message

        });


    }



});










// 视频播放接口

app.get("/api/video", async(req,res)=>{


    const videoUrl=req.query.url;



    try{


        const headers={

            "User-Agent":
            "Mozilla/5.0",

        };



        if(req.headers.range){

            headers.Range=req.headers.range;

        }





        const response=await axios({

            method:"GET",

            url:videoUrl,

            headers:headers,

            responseType:"stream",

            validateStatus:()=>true

        });





        res.status(response.status);



        res.setHeader(

            "Content-Type",

            "video/mp4"

        );


        res.setHeader(

            "Accept-Ranges",

            "bytes"

        );



        if(response.headers["content-range"]){

            res.setHeader(

                "Content-Range",

                response.headers["content-range"]

            );

        }



        response.data.pipe(res);



    }catch(e){


        res.status(500).send(
            "视频加载失败"
        );


    }



});









// 下载接口

app.get("/api/download", async(req,res)=>{


    const videoUrl=req.query.url;



    try{


        const response=await axios({

            method:"GET",

            url:videoUrl,

            headers:{

                "User-Agent":
                "Mozilla/5.0"

            },

            responseType:"stream"

        });




        res.setHeader(

            "Content-Type",

            "video/mp4"

        );



        res.setHeader(

            "Content-Disposition",

            "attachment; filename=qushuiyin.mp4"

        );



        response.data.pipe(res);



    }catch(e){


        res.status(500).send(
            "下载失败"
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
