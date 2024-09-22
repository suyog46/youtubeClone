npm init

pck.json
type:"module"


"start":node index.js ......kun command le run hunxa 
  "scripts": {
    "dev": "nodemon index.js"
 },


 npm install --save-dev nodemon   (--save-dev ni lekhnu cause save nahuni raixa kahile kahi)
 npm i cookie-parser  (biccha ma - xa )


 for testting
 username:five
 email:test@gmail.com
 pasword:Test1@123

username:channel
email:channel@gmail.com
password:Channel@123

 http://localhost:4000


     [{
          $match: {
             title:{ $regex:"", $options: 'i' }
          }
        },
        {
          $sort: { createdAt:1} 
        },
        {
          $skip: (1 - 1) * 3  
        },
        {
          $limit: 3
        },{
            $lookup:  {
                from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"result"
        }
    } ] 