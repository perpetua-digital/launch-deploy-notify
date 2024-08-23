import express, { Request, Response } from 'express';
import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';
// import { auth } from '@adobe/auth-token';

// Load environment variables from .env file
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Zod schema for validating the incoming requests
const webhookSchema = z.object({
  environment: z.string(),
  status: z.string(),
  name: z.string(),
});

const app = express();
app.use(express.json());

app.post('/publish', (req: Request, res: Response) => {
  // Validate the incoming request
  const parsedResult = webhookSchema.safeParse(req.body);

  if (!parsedResult.success) {
    res.status(400).send('Invalid request payload');
    return;
  }

  const { environment, status, name } = parsedResult.data;

  // Check if the library is published in production
  if (environment === 'production' && status === 'published') {
    sendEmailNotification(name)
      .then(() => {
        res.status(200).send('Notification sent');
      })
      .catch((error) => {
        console.error('Error sending email:', JSON.stringify(error));
        res.status(500).send('Error sending notification');
      });
  } else {
    res.status(200).send('No action needed');
  }
});

app.get('/ok', (req: Request, res: Response) => {
    res.status(200).send('Everything is ok');
});

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('hello world');
});

async function sendEmailNotification(libraryName: string) {
  const msg = {
    to: 'john@perpetua.digital', // this will be passed in somehow?
    from: 'john@perpetua.digital', // Change to your verified sender
    subject: 'Library Published',
    text: `The library "${libraryName}" has been published in the production environment.`,
  };

  await sgMail.send(msg);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook listener running on port ${PORT}`);
});

module.exports = app;