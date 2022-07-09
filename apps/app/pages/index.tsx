import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      {session ? (
        <button onClick={() => signOut()} type="button">
          Sign Out
        </button>
      ) : (
        <button onClick={() => signIn()} type="button">
          Sign In
        </button>
      )}
      <h1 className="text-3xl font-bold underline">App</h1>
      {session?.user?.name && `Welcome ${session?.user?.name}`}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => ({
  props: {
    session: await getSession(context),
  },
});
