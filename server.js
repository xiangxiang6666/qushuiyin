const express = require("express");
const cors = require("cors");
const axios = require("axios");


const douyin = require("./parsers/douyin");
const kuaishou = require("./parsers/kuaishou");
const xiaohongshu = require("./parsers/xiaohongshu");


const app = express();


app.use(cors());

app.use(express.json());



// 首页

app.get("/",(req,res)=>{

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

app.post("/api/parse",async(req,res)=>{


    const {url}=req.body;



    if(!url){

        return res.json({

            success:false,

            message:"请输入视频链接"

        });

    }



    const platform=detectPlatform(url);



    if(platform==="unknown"){

        return res.json({

            success:false,

            message:"暂不支持该平台"

        });

    }




    let result;



    if(platform==="douyin"){

        result=await douyin.parse(url);

    }


    if(platform==="kuaishou"){

        result=await kuaishou.parse(url);

    }


    if(platform==="xiaohongshu"){

        result=await xiaohongshu.parse(url);

    }




    res.json({

        success:true,

        platform:platform,

        data:result

    });


});







// 视频代理接口

app.get("/api/download",async(req,res)=>{


    const videoUrl=req.query.url;



    if(!videoUrl){

        return res.status(400).send(
            "缺少视频地址"
        );

    }



    try{


        const response = await axios({

            method:"GET",

            url:videoUrl,

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



    }catch(error){


        res.status(500).send(
            "视频获取失败"
        );


    }


});







const PORT =
process.env.PORT || 3000;



app.listen(PORT,()=>{


console.log(
"server running:"+PORT
);


});
