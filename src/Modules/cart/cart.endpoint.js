import { roles } from "../../Middleware/auth.middleware.js"
export const endPoint={
create:[roles.User,roles.Admin],
update:[roles.Admin],
get: [roles.Admin,roles.User],
}

