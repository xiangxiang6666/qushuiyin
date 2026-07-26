const express = require("express");
const cors = require("cors");

const douyin = require("./parsers/douyin");
const kuaishou = require("./parsers/kuaishou");
const xiaohongshu = require("./parsers/xiaohongshu");


const app = express();

app.use(cors());
app.use(express.json());



// 首页
app.get("/", (req,res)=>{

    res.json({

        status:"ok",

        message:"去水印API运行正常"

    });

});



// 测试页面
app.get("/test",(req,res)=>{

res.send(`

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>短视频去水印测试</title>

</head>


<body>


<h2>短视频去水印接口测试</h2>


<input id="url" 
style="width:300px;padding:10px"
placeholder="输入视频链接">


<button onclick="parse()">
开始解析
</button>


<pre id="result">
等待测试...
</pre>


<script>


async function parse(){


let url=document.getElementById("url").value;


let res=await fetch("/api/parse",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

url:url

})

});


let data=await res.json();


document.getElementById("result").innerText=
JSON.stringify(data,null,2);


}


</script>


</body>

</html>


`);

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





const PORT=process.env.PORT || 3000;


app.listen(PORT,()=>{

console.log(
"server running:"+PORT
);

});
