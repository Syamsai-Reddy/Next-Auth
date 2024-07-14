import nodemailer from "nodemailer"
import bcryptjs from "bcryptjs"
import User from "@/models/userModel"


export const sendEmail = async({email , emailType , userId} :any) =>
{
    try {
         // create a hased token
         const hashedToken = await bcryptjs.hash(userId.toString(), 10)

         if (emailType === "VERIFY") {
             await User.findByIdAndUpdate(userId, 
                 {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
         } else if (emailType === "RESET"){
             await User.findByIdAndUpdate(userId, 
                 {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
         }



       
         var transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "2bc912b9d94d4f",
            pass: "df044149d2f0a0"
          }
        });


          const mailOptions = {
            from: 'syamsai@syamsai.ai', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password", 
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>` 
          }

          const mailResponse  = await transport.sendMail(mailOptions);

          return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}