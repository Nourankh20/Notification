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

  sgMail.setApiKey(process.env.sendgrid_api_key);
  await sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
      return response[0].statusCode;
    })
    .catch((error) => {
      console.error(error)
      return error
    })
    

}
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  orderCreated(to:string, stripeId:string){
    let text = `Your order has been confirmed! Order no. ${stripeId}.`;
    // sendMail(to,'Order Confirmed!',text,text);
    return 5;
  }
  
}
