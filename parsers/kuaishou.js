const axios = require("axios");


module.exports = {

    name:"kuaishou",


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


            return {

                title:
                result.data?.title || "",


                cover:
                result.data?.cover_url || "",


                video:
                result.data?.video_url || "",


                author:
                result.data?.author || {}

            };


        }catch(error){


            return {

                message:"快手解析失败",

                error:error.message

            };


        }


    }


};
