const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());


// 测试接口
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "去水印API运行正常"
  });
});


// 解析接口
app.post("/api/parse", async (req, res) => {

  try {

    const { url } = req.body;

    if (!url) {
      return res.json({
        success: false,
        message: "缺少视频链接"
      });
    }


    // 这里暂时返回测试结果
    // 后面接入真正解析接口

    res.json({
      success: true,
      message: "收到视频链接",
      url:url
    });


  } catch (error) {

    res.json({
      success:false,
      message:"服务器错误"
    });

  }

});


const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

  console.log(
    `API running on port ${PORT}`
  );

});
