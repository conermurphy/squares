import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { UseFormValues } from '../../types';

interface ExtendedNextApiRequest extends NextApiRequest {
  body: UseFormValues;
}

interface ExtendedNextApiResponse extends NextApiResponse {
  message: string;
}

type TBodyFields = {
  [key: string]: string;
};

export default async function emailSignup(
  req: ExtendedNextApiRequest,
  res: ExtendedNextApiResponse
) {
  const { body }: { body: TBodyFields } = req;

  // If the honeypot chilliIsCool has been populated then return error.
  if (body.chilliIsCool) {
    res
      .status(400)
      .json({ message: 'Boop beep bop zssss good bye. Error Code: A1234' });
  }

  // Checking we have data from the email input
  const requiredFields = ['email'];

  for (const field of requiredFields) {
    if (!body[field]) {
      res.status(400).json({
        message: `Oops! You are missing the ${field} field, please fill it in and retry.`,
      });
    }
  }

  // Setting vars for posting to API
  const endpoint = process.env.CONVERTKIT_ENDPOINT;
  const APIKey = process.env.CONVERTKIT_PUBLIC_KEY;
  const formID = process.env.CONVERTKIT_SIGNUP_FORM;

  // Config for axios request
  const config = {
    headers: {
      'Content-Type': 'application/json',
      charset: 'utf-8',
    },
  };

  // posting to the Convertkit API
  await axios
    .post(
      `${endpoint || ''}${formID || ''}/subscribe`,
      {
        email: body.email,
        api_key: APIKey,
      },
      config
    )
    .catch((error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        res.status(error?.response?.status || 400).json({
          message: `Oops! There has been an error: ${
            error?.response?.statusText || ''
          }`,
        });
      }
    });

  res.status(200).json({ message: 'Success! Thank you for subscribing!' });
}
