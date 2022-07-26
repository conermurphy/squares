import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { handleAuthRedirect } from '@/utils';
import { GeneralSettings, SEO } from '@/components';
import { GoSettings } from 'react-icons/go';

export default function Settings() {
  return (
    <>
      <SEO
        metaTitle="Settings"
        metaDescription="All the settings to control your Squares experience"
      />
      <div className="flex flex-col gap-9 max-w-full">
        <h1 className="text-4xl font-heading mx-5 md:mx-10 lg:m-0">Settings</h1>
        <div className="flex flex-col gap-9 w-full">
          <GeneralSettings
            headerData={{
              heading: 'General Settings',
              description: 'Settings to customise/control your experience.',
              icon: <GoSettings size="20px" />,
            }}
          />
        </div>
      </div>
    </>
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
