const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// 首页测试
app.get("/", (req,res)=>{
    res.json({
        status:"ok",
        message:"去水印API运行正常"
    });
});


// 视频解析接口
app.post("/api/parse",(req,res)=>{

    const {url} = req.body;


    if(!url){

        return res.json({
            success:false,
            message:"请输入视频链接"
        });

    }


    // 临时测试返回
    res.json({

        success:true,

        message:"收到视频链接",

        data:{
            original:url,
            title:"测试视频",
            cover:"",
            video:""
        }

    });


});


const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        "server running:"+PORT
    );

});
