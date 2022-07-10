const axios = require('axios');

async function vercel() {
  const [action] = process.argv.slice(2);

  try {
    const apiVersion = action === 'alias' ? 'v2' : 'v13';
    const url = `https://api.vercel.com/${apiVersion}/deployments${
      process.env.BUILD_ID ? `/${process.env.BUILD_ID}` : ''
    }${action === 'alias' ? '/aliases' : ''}`;

    const alias = `staging-sqrs-app.vercel.app`;

    const config = {
      method: action === 'check' ? 'GET' : 'POST',
      url,
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
    };

    // eslint-disable-next-line
    console.log(process.env.GITHUB_REF_NAME);

    switch (action) {
      case 'trigger':
        await axios({
          ...config,
          data: {
            name: 'sqrs-app',
            project: 'sqrs-app',
            gitSource: {
              type: 'github',
              repoId: process.env.REPO_ID,
              ref: process.env.GITHUB_REF_NAME,
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
  } catch (e) {
    // eslint-disable-next-line
    console.error("Request failed");
  }
}

vercel();
