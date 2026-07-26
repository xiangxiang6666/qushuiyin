const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// 首页检测
app.get("/", (req, res) => {

    res.json({
        status: "ok",
        message: "去水印API运行正常"
    });

});


// 浏览器测试页面
app.get("/test", (req, res) => {

    res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>去水印接口测试</title>

<style>

body{
    font-family: Arial;
    padding:30px;
}

input{
    width:90%;
    padding:10px;
    font-size:16px;
}

button{
    margin-top:15px;
    padding:10px 25px;
    font-size:16px;
}

pre{
    background:#f5f5f5;
    padding:15px;
    margin-top:20px;
    white-space:pre-wrap;
}

</style>

</head>


<body>


<h2>短视频去水印接口测试</h2>


<input id="url" placeholder="请输入视频链接">


<br>


<button onclick="send()">
开始解析
</button>


<pre id="result">
等待测试...
</pre>



<script>


async function send(){


let url=document.getElementById("url").value;


if(!url){

alert("请输入视频链接");

return;

}


let response = await fetch("/api/parse",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

url:url

})

});


let data = await response.json();


document.getElementById("result").innerText =
JSON.stringify(data,null,2);


}


</script>


</body>

</html>
    `);

});



// 解析接口
app.post("/api/parse",(req,res)=>{


    const {url}=req.body;


    if(!url){

        return res.json({

            success:false,

            message:"请输入视频链接"

        });

    }



    // 当前为测试版本
    // 后续这里接入真实解析程序


    res.json({

        success:true,

        message:"链接接收成功",

        data:{

            original:url,

            title:"测试视频",

            cover:"",

            video:""

        }

    });


});




// 启动服务

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        "Server running on port "+PORT
    );

});
