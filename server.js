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








// 平台识别

function detectPlatform(url){


    url = url.toLowerCase();




    if(

        url.includes("douyin.com") ||

        url.includes("iesdouyin.com")

    ){

        return "douyin";

    }






    if(

        url.includes("kuaishou.com") ||

        url.includes("gifshow.com")

    ){

        return "kuaishou";

    }







    if(

        url.includes("xiaohongshu.com") ||

        url.includes("xhslink.com")

    ){

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







    const platform=detectPlatform(url);





    if(platform==="unknown"){


        return res.json({

            success:false,

            message:"暂不支持该平台"

        });


    }






    try{


        let data=null;





        if(platform==="douyin"){

            data=await douyin.parse(url);

        }




        if(platform==="kuaishou"){

            data=await kuaishou.parse(url);

        }




        if(platform==="xiaohongshu"){

            data=await xiaohongshu.parse(url);

        }






        console.log(
            platform+"解析结果:",
            JSON.stringify(data)
        );






        if(!data || !data.video){


            return res.json({

                success:false,

                message:platform+"视频地址获取失败",

                data:data

            });


        }







        res.json({

            success:true,

            platform:platform,

            data:data

        });





    }catch(error){



        console.log(
            "解析错误:",
            error.message
        );




        res.json({

            success:false,

            message:error.message

        });



    }



});












// 视频播放代理

app.get("/api/video", async(req,res)=>{


    const videoUrl=req.query.url;



    if(!videoUrl){

        return res.status(400).send(
            "缺少视频地址"
        );

    }







    try{


        const headers={


            "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"


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

            response.headers["content-type"] ||

            "video/mp4"

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



        console.log(
            "视频代理错误:",
            error.message
        );



        res.status(500).send(
            "视频加载失败"
        );



    }



});











// 下载接口

app.get("/api/download", async(req,res)=>{


    const videoUrl=req.query.url;





    if(!videoUrl){

        return res.status(400).send(
            "缺少下载地址"
        );

    }






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






    }catch(error){



        console.log(

            "下载错误:",

            error.message

        );



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
