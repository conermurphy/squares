const axios = require('axios');

async function vercel() {
  const [action, project] = process.argv.slice(2);

  const apiVersion = action === 'alias' ? 'v2' : 'v13';
  const url = `https://api.vercel.com/${apiVersion}/deployments${
    process.env.BUILD_ID ? `/${process.env.BUILD_ID}` : ''
  }${action === 'alias' ? '/aliases' : ''}`;

  const alias = `staging-${project}.vercel.app`;

  const config = {
    method: action === 'check' ? 'GET' : 'POST',
    url,
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
    },
  };

  switch (action) {
    case 'trigger':
      await axios({
        ...config,
        data: {
          project,
          gitSource: {
            type: 'github',
            repoId: process.env.GITHUB_REPOSITORY,
            sha: process.env.GITHUB_SHA,
          },
        },
      }).then((res) => {
        // eslint-disable-next-line
        console.log(res.data.id);
      });
      break;

    case 'alias':
      await axios({
        ...config,
        data: {
          alias,
        },
      }).then((res) => {
        // eslint-disable-next-line
        console.log(res.data.alias);
      });
      break;

    case 'check':
      await axios(config).then((res) => {
        // eslint-disable-next-line
        console.log(res.data.status);
      });
      break;

    default:
      break;
  }
}

vercel();
