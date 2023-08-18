import { roles } from "../../Middleware/auth.middleware.js"
export const AllRoles=(req,res,next)=>{
    const Roles=['Admin','User','Hr']
    for(const role of Roles){
        if(!role){
            return next(new Error('not authrized user',{cause:401}))
        }
   
     return role
    
    }
    }
export const endPoint={
create:[roles.Admin],
update:[roles.Admin],
get: AllRoles(),
softdelete:[roles.Admin],
forcedelete:[roles.Admin],
restore:[roles.Admin],

}
