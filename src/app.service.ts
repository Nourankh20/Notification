import { Injectable } from '@nestjs/common';
const sgMail = require('@sendgrid/mail')
// import { config } from '../config';
import * as AWS from 'aws-sdk';
const { Consumer } = require('sqs-consumer');





async function sendMail(body: any) {

  const z = await body
  //console.log(z)
  // const y = await JSON.parse(z);
  // console.log(y.header.event);
  // const f = await y.header.event.name
  const msg = {
    to: z.email, // Change to your recipient
    from: 'mk.elbaz9248@gmail.com', // Change to your verified sender
    subject: `${z.item} order`,
    text: `Your order has been confirmed! Order no. ${z._id}.`,
    html: `Your order has been confirmed! Order no. ${z._id}.`,

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
    QueueUrl: process.env.NOTIFICATION_SQS_K,
  };
  private sqs;
  private sns;
  constructor() {
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: process.env.ACCESS_KEY_ID_K,
      secretAccessKey: process.env.SECRET_ACCESS_KEY_K,
    });
    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    this.sns = new AWS.SNS({ apiVersion: '2010-03-31' });
  }

  getHello(): string {
    return 'Hello World!';
  }

  async consume() {
    console.log("consumer start")
    Consumer.create({
      queueUrl: process.env.NOTIFICATION_SQS_K,
      handleMessage: async (message) => {
     console.log("handleMessage start")

        var params = {
          Entries: [ /* required */
            {
              Id: message.MessageId, /* required */
              ReceiptHandle: message.ReceiptHandle/* required */
            },
            /* more items */
          ],
          QueueUrl: process.env.NOTIFICATION_SQS_K /* required */
        };
        console.log("consumer");
        var x = await JSON.parse(message.Body);
        var y = await JSON.parse(x.Message);
        
        console.log(y);
        sendMail(y);
        this.sqs.deleteMessageBatch(params, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else console.log("deleted ",data);           // successful response
        });
        
      },
    }).start()

  }

  orderCreated(to: string, stripeId: string) {
    let text = `Your order has been confirmed! Order no. ${stripeId}.`;
    // sendMail(to,'Order Confirmed!',text,text);
  }

}
