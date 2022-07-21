import { Contributor } from '@prisma/client';
import { useState } from 'react';
import { server } from '../config';

interface FetchDataProps {
  method: 'GET' | 'POST';
}

type ReturnDataType = {
  [k: string]: number | string | (string | number)[];
};

export default function useFetchData({ method }: FetchDataProps) {
  // Setting state to be returned depending on the outcome of the submission.
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ReturnDataType | null>();
  const [message, setMessage] = useState<string | null>('');
  const [error, setError] = useState<boolean | null>();

  async function fetchData({ endpoint }: { endpoint: string }) {
    setLoading(true);
    setError(null);
    setData(null);
    setMessage(null);

    switch (method) {
      case 'GET': {
        const res = await fetch(`${server}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseText = (await res.json()) as ReturnDataType;

        // check if successful or if was an error
        if (res.status >= 400 && res.status < 600) {
          // Oh no there was an error! Set to state to show user

          if (responseText?.error) {
            const { error: resError } = responseText;
            setLoading(false);
            setError(true);
            setMessage(resError as string);
          }
        } else {
          // everyting worked successfully.

          setLoading(false);
          setData(responseText);
        }
        break;
      }
      default:
        break;
    }
  }

  return {
    error,
    loading,
    data,
    message,
    fetchData,
  };
}
