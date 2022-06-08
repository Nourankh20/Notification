import { Injectable } from '@nestjs/common';
const sgMail = require('@sendgrid/mail')

async function sendMail(to:string, subject:string, text:string,  html:string,) {
  const msg = {
    to: to, // Change to your recipient
    from: 'mk.elbaz9248@gmail.com', // Change to your verified sender
    subject: subject,
    text: text,
    html: html
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => {
      console.error(error)
    })

}
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  orderCreated(to:string, stripeId:string){
    let text = `Your order has been confirmed! Order no. ${stripeId}.`;
    sendMail(to,'Order Confirmed!',text,text);
    return "hello";
  }
  
}
