import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({
cloud_name:process.env.CLOUD_NAME ||"dwaf3uzd5",
api_key:process.env.CLOUD_API_KEY||"121557529677688",
api_secret:process.env.CLOUD_API_SECRET||"O8IhTeXjx8e8EKOGqXKHiLsE79w"
})

const cloudresult=async (localfilepath)=>{
try {
    
        if(!localfilepath){
            console.log("localpath aayena ");
                        return null
                    } 
      
        console.log("cloudinary ma upload garnu vanda agadi ")
        const response=await  cloudinary.uploader.upload(localfilepath,{resource_type:"auto"})
        console.log("file is uploaded on clodinary succesfully",response.url)
        fs.unlinkSync(localfilepath);

    return response
} catch (error) {
    console.log("there is error in uploading msg to the cloudinary",error.message)
    fs.unlinkSync(localfilepath)
}   
}
export {cloudresult}