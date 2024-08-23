import { Router, Request, Response } from 'express';
import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';
// import { auth } from '@adobe/auth-token';

const router = Router();

async function sendEmailNotification(libraryName: string, data: any) {
    const msg = {
      to: 'john@perpetua.digital', // this will be passed in somehow?
      from: 'john@perpetua.digital', // Change to your verified sender
      subject: 'Library Published',
      text: `The library "${libraryName}" has been published in the production environment. \n
      ${JSON.stringify(data)}
      `,
    };
  
    await sgMail.send(msg);
  }

// Zod schema for validating the incoming requests
const webhookSchema = z.object({
    environment: z.string(),
    status: z.string(),
    name: z.string(),
  });

// Define a route for getting all users
router.post('/', (req: Request, res: Response) => {
    // Validate the incoming request
    const parsedResult = webhookSchema.safeParse(req.body);

    const { environment, status, name } = req.body
    const data = req.body

    sendEmailNotification(name, data)
        .then(() => {
          res.status(200).send(`Notification sent`);
        })
        .catch((error) => {
          console.error('Error sending email:', JSON.stringify(error));
          res.status(500).send('Error sending notification');
        });
  
    // if (!parsedResult.success) {
    //   res.status(400).send(`Invalid request payload ${JSON.stringify(req.body)}`);
    //   return;
    // }
  
    // const { environment, status, name } = parsedResult.data;
  
    // Check if the library is published in production
    // if (environment === 'production' && status === 'published') {
    //   sendEmailNotification(name)
    //     .then(() => {
    //       res.status(200).send(`Notification sent`);
    //     })
    //     .catch((error) => {
    //       console.error('Error sending email:', JSON.stringify(error));
    //       res.status(500).send('Error sending notification');
    //     });
    // } else {
    //   res.status(200).send(`No action needed \n ${JSON.stringify(req.body)}`);
    // }
  });

export default router;
