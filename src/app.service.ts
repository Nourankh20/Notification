import { Injectable } from '@nestjs/common';
const sgMail = require('@sendgrid/mail')
import { config } from '../config';
import * as AWS from 'aws-sdk';
const { Consumer } = require('sqs-consumer');



async function sendMail(body : any) {
  
  const z = await body.Message
  console.log(z)
  const y = await JSON.parse(z);
  console.log(y.header.event);
  const f = await y.header.event.name
  const msg =  {
    to: y.header.event.email, // Change to your recipient
    from: 'mk.elbaz9248@gmail.com', // Change to your verified sender
    subject: `${f} order`,
    text: `Your order has been confirmed! Order no. ${y.header.event.orderNo}.`,
    html: `Your order has been confirmed! Order no. ${y.header.event.orderNo}.`,
    
  }
  console.log(msg);
  
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
  params = {
    QueueUrl: config.NOTIFICATION_SQS,
  };
  private sqs;
  private sns;
  constructor() {
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: config.ACCESS_KEY_ID,
      secretAccessKey: config.SECRET_ACCESS_KEY,
    });
    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    this.sns = new AWS.SNS({ apiVersion: '2010-03-31' });
  }


  consume() {
    
    Consumer.create({
      queueUrl: config.NOTIFICATION_SQS,
      handleMessage: async (message) => {

        var params = {
          Entries: [ /* required */
            {
              Id: message.MessageId, /* required */
              ReceiptHandle: message.ReceiptHandle/* required */
            },
            /* more items */
          ],
          QueueUrl: config.NOTIFICATION_SQS /* required */
        };

        const x = message.Body
        // console.log(x)
        sendMail(JSON.parse(x))
        this.sqs.deleteMessageBatch(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        });
      },
    }).start()

  }

  orderCreated(to:string, stripeId:string){
    let text = `Your order has been confirmed! Order no. ${stripeId}.`;
    // sendMail(to,'Order Confirmed!',text,text);
  }
  
}
