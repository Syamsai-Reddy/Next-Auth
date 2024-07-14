import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest , NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

connect();

export async function POST(request: NextRequest){
    try {
        const reqBody =await request.json();
        const { email, password} = reqBody;

        //validation 
        console.log(reqBody);

        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({error : "User doesn't exist"} ,{status: 400} )
        }

        console.log("User exists");

        //checking creedientals is crct or not

        const validPassword = await bcryptjs.compare(password , user.password)

        if(!validPassword){
            return NextResponse.json({error:"Check your credientials"} , {status : 400})
        }

        

        //creating payload for jwt token making 

        const tokenData = {
            id : user._id,
            username:user.username,
            email:user.email

        }

        //creating jwt token 
        const token =  jwt.sign(tokenData , process.env.TOKEN_SECRET! , {expiresIn:'1d'})

        const response = NextResponse.json({
            message:"Logged In Success",
            success:true
        })

        //user will allow to read only
        response.cookies.set("token" , token ,  {
            httpOnly:true
        })

        return response;

    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}