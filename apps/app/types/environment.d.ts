namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    NEXT_PUBLIC_RESULTS_PER_PAGE: string;
    API_MAX_RETRY: string;
  }
}
