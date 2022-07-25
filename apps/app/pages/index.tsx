import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { useSession, signIn, signOut } from 'next-auth/react';
import { handleAuthRedirect } from '@/utils';

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
      <h1 className="text-3xl font-heading font-bold underline text-brand">
        App
      </h1>
      <p className="text-accent font-body">
        {session?.user?.name && `Welcome ${session?.user?.name}`}
      </p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => {
  const { redirect, session } = await handleAuthRedirect({
    context,
    path: context?.resolvedUrl,
  });

  return redirect?.destination
    ? { redirect }
    : {
        props: { session },
      };
};
