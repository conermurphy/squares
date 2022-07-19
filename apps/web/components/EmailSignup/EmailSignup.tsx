import React from 'react';
import { useEmail, useForm } from '../../utils';

export default function EmailSignup(): JSX.Element {
  const { values, updateValue } = useForm({
    email: '',
    chilliIsCool: '',
  });

  const { loading, message, submitEmail } = useEmail({ values });

  return (
    <div className="flex flex-col gap-8 text-2xl text-center">
      <form
        onSubmit={submitEmail}
        className="flex flex-col sm:flex-row justify-center gap-4"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          onChange={updateValue}
          value={values.email}
          className="rounded-lg w-80 text-background py-3 px-5"
        />
        <input
          type="text"
          name="chilliIsCool"
          onChange={updateValue}
          value={values.chilliIsCool}
          className="hidden"
        />
        <button type="submit" className="bg-brand rounded-lg py-3 px-5">
          {loading ? 'Subscribing..' : 'Subscribe'}
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}
