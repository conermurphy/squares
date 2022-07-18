import React from 'react';

interface IProps {
  featureTitle: string;
  featureDescription: string;
  isComingSoon?: boolean;
}

export default function FeatureCard({
  featureTitle,
  featureDescription,
  isComingSoon = false,
}: IProps): JSX.Element {
  const { nonHighlightedWords, highlightedWords } = featureTitle
    .split(' ')
    .reduce(
      (acc, cur, i, arr) => {
        if (i < arr.length - 2) {
          acc.nonHighlightedWords = `${acc.nonHighlightedWords} ${cur}`;
        } else {
          acc.highlightedWords = `${acc.highlightedWords} ${cur}`;
        }

        return acc;
      },
      {
        nonHighlightedWords: '',
        highlightedWords: '',
      }
    );

  return (
    <div className="flex flex-col gap-2 bg-accent pt-7 px-10 pb-11 rounded-2xl max-w-[492px]">
      {isComingSoon ? (
        <span className="bg-brand md:text-xl rounded-lg py-1 px-2 w-max">
          Coming Soon
        </span>
      ) : null}
      <h2 className="font-heading text-3xl md:text-4xl">
        {nonHighlightedWords}
        <span className="text-brand">{highlightedWords}</span>
      </h2>
      <p className="text-xl opacity-75">{featureDescription}</p>
    </div>
  );
}
