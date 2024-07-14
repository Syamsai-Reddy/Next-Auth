import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest , NextResponse } from "next/server";


connect();

export async function POST(request : NextRequest){
    try {
        const reqBody = await request.json();
        const {token} = reqBody;  //taking token from req
        console.log(token);

        //checking in databases if the token is there and expiery date is greater or not
        const user = await User.findOne({verifyToken : token , verifyTokenExpiry : {$gt : Date.now()}})  
        

        if(!user){
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 500 }
            );
        }

        console.log(user);

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save()
        return NextResponse.json(
          {
            message:"Email verified Successfully",
            success:true
          },
          {
            status:200
          }
        );
        
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}