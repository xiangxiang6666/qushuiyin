const axios = require("axios");


module.exports = {

    name:"video",


    async parse(url){


        try{


            const response = await axios.post(
                
                "https://qyapi.ipaybuy.cn/api/video",

                {

                    appId: process.env.QIYUN_APPID,

                    appKey: process.env.QIYUN_APPKEY,

                    url:url

                },

                {

                    headers:{

                        "Content-Type":"application/json"

                    }

                }

            );


            const result=response.data;


            if(result.code !== 200){

                return {

                    message:result.msg || "解析失败"

                };

            }



            return {


                title:
                result.data.title || "",


                cover:
                result.data.cover_url || "",


                video:
                result.data.video_url || "",


                author:
                result.data.author || {}


            };



        }catch(error){


            return {

                message:"接口请求失败",

                error:error.message

            };


        }


    }


};
