<img src="assets/squares-app-signin.png" title="Header Banner" alt="Header Banner"/>&emsp;

# Squares

Welcome to Squares, a GitHub analytics tool that lets you explore and visualise your GitHub data.

Using Squares you can see an overview of your commits and repositories in various ways and the stats about them.

[Check it out for free here.](https://app.squares.so/auth/signin)

## Tech Stack 👩‍💻

Here is the tech used for Squares

### Frontend

- React
  - Next.js
- TailwindCSS

### Backend

- Prisma
- PlanetScale

## Local Setup

To run the project locally, do the following steps:

- Clone the repo and npm install from the root of the monorepo
- [Sign up for an account with PlanetScale](https://planetscale.com) and create a new database
- Create a GitHub OAuth App
- Create a `.env` file at `~/apps/app`, this will contain the various variables required for the app to run. (See example and explanation below)
- Open a connection to PlanetScale in one terminal window.
- Start Squares using `npm run dev`.

Read a [getting started guide for Prisma and PlanetSclae here.](https://docs.planetscale.com/docs/tutorials/prisma-quickstart)

### Example Env for apps/app

```
DATABASE_URL -> This is your localhost planetscale connection URL
GITHUB_ID -> ID for a GitHub OAuth App
GITHUB_SECRET -> Secret for the GitHub OAuth App above
NEXTAUTH_URL -> localhost URL for apps/app
NEXTAUTH_SECRET -> Generated random string for Next Auth
NEXT_PUBLIC_RESULTS_PER_PAGE -> Number of results to show per page for commits and repo tables.
```

Read more about the [`NEXTAUTH` secrets here on their documentation](https://next-auth.js.org/configuration/options)

## Contributing 👥

Any PRs or Issues raised are appreciated greatly. Please feel free to contribute if you would like to. 😄

---

Squares was made as an entry to the [PlanetScale](https://planetscale.com/?utm_source=hashnode&utm_medium=hackathon&utm_campaign=announcement_article) and [Hashnode](https://hashnode.com/?source=planetscale_hackathon_announcement) hackathon in July 2022.
