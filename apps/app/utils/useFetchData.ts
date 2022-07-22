import { useState } from 'react';
import { server } from '../config';
import { ErrorMessage, ReturnDataType } from '../types/types';

interface FetchDataProps {
  method: 'GET' | 'POST';
}

function isError(data: ReturnDataType): data is ErrorMessage {
  return (data as ErrorMessage).error !== undefined;
}

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

        const responseData = (await res.json()) as ReturnDataType;

        // check if successful or if was an error
        if (res.status >= 400 && res.status < 600) {
          // Oh no there was an error! Set to state to show user

          if (isError(responseData)) {
            const { error: resError } = responseData;
            setLoading(false);
            setError(true);
            setMessage(resError);
          }
        } else {
          // everyting worked successfully.

          setData(responseData);
          setLoading(false);
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
