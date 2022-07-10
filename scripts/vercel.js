const axios = require('axios');

async function vercel() {
  const [action] = process.argv.slice(2);

  try {
    const apiVersion = action === 'alias' ? 'v2' : 'v13';
    const url = `https://api.vercel.com/${apiVersion}/deployments${
      process.env.BUILD_ID ? `/${process.env.BUILD_ID}` : ''
    }${action === 'alias' ? '/aliases' : ''}`;

    const alias = `staging-squares-app.vercel.app`;

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
            name: 'squares-app',
            project: 'squares-app',
            gitSource: {
              type: 'github',
              repoId: parseInt(process.env.REPO_ID),
              ref: process.env.GITHUB_HEAD_REF.replace('#', '%23'),
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
    /* eslint-disable */
    console.error(e);
    console.error("Request failed");
    /* eslint-enable */
  }
}

vercel();
