import Img from 'next/image';
import {
  CustomLink,
  EmailSignup,
  FeatureCard,
  Header,
  SEO,
} from '../components';

function LinkGroup(): JSX.Element {
  return (
    <div className="flex flex-col gap-4 sm:flex-row md:gap-12">
      <CustomLink href="https://app.squares.so" isExternal>
        Get Started
      </CustomLink>
      <CustomLink
        href="https://github.com/conermurphy/squares"
        isAccentBackground
      >
        Visit Repo
      </CustomLink>
    </div>
  );
}

export default function Web() {
  return (
    <>
      <SEO
        metaTitle="Home"
        metaDescription="See your GitHub data like you've never seen before!"
      />
      <div className="flex flex-col items-center bg-background min-h-screen text-text px-4">
        {/* Header */}
        <Header />
        {/* Intro Title & Sign up section */}
        <section className="flex flex-col items-center justify-center mt-44 mb-32">
          <div className="relative w-24 h-24 mb-9">
            <Img src="/logo.svg" layout="fill" />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl max-w-screen-md text-center mb-10">
            See <span className="text-brand">GitHub data</span> like you&apos;ve
            never seen before
          </h1>
          <LinkGroup />
        </section>
        {/* Commit graph image */}
        <div className="relative max-w-[1016px] block h-full w-full mb-16">
          <Img
            src="/commit-graph.png"
            layout="responsive"
            objectFit="contain"
            width={1016}
            height={454}
          />
        </div>
        {/* Feature Card grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <FeatureCard
            featureTitle="Explore your stats"
            featureDescription="Insightful charts and visuals to show your GitHub data like never before."
          />
          <FeatureCard
            featureTitle="Powerful granular data"
            featureDescription="Explore your commits, repos and languages at a granular level."
          />
          <FeatureCard
            featureTitle="Custom Chart Builder"
            featureDescription="This isn’t just a tool for viewing your data, you can explore and build your own charts to."
            isComingSoon
          />
          <FeatureCard
            featureTitle="GitHub User Explorer"
            featureDescription="Don’t just view your own data, search and look for others data as well to see what they’re up to."
            isComingSoon
          />
        </section>
        {/* Closing Sign Up section */}
        <section
          id="signup"
          className="flex flex-col items-center justify-center mt-32 mb-36"
        >
          <h2 className="font-heading text-4xl md:text-6xl max-w-screen-lg text-center mb-10">
            Sign up and see <br /> your{' '}
            <span className="text-brand">dashboard</span> today.
          </h2>
          <LinkGroup />
        </section>
      </div>
    </>
  );
}
