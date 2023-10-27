const router = require("express").Router()
const UserToken = require("./models/UserIpTokenModule")
const {v4: uuidv4} = require("uuid")

router.get("/givetoken",async(req,res)=>{
    try{
        let userIPList = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        userIPList = userIPList.split(",")
        const userIP = userIPList[0]
        console.log(userIP)
        const token = uuidv4()
        const isMyIp = await UserToken.find({userIp:userIP})
        if(isMyIp.length==0){
            const newuser = await new UserToken({
                userIp:userIP,
                token:token
            })
            newuser.save()
            console.log(newuser)
            return res.status(200).json({
                yourIp:userIP,
                token:token,
            })
        }else{
            await UserToken.updateOne({userIp:userIP},{
                token:token
            })
            return res.status(200).json({
                yourIp:userIP,
                token:token
            })
        }
    }catch(error){
        return res.status(500).json("error")
    }
})
module.exports = router