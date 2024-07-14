import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken  = (request : NextRequest)=>{
    try {
        
        const token = request.cookies.get("token")?.value || "";
        const decodedToken:any = jwt.verify(token , process.env.TOKEN_SECRET!)

        //in decodedToken we will get payload data that we have wrote in login route

        return decodedToken.id


    } catch (error) {
        throw new Error((error as Error).message);
    }
}