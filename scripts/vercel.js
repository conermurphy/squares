const axios = require('axios');

async function vercel() {
  const [action] = process.argv.slice(2);

  try {
    let url = '';
    let method = '';

    switch (action) {
      case 'trigger':
        method = 'POST';
        url = `https://api.vercel.com/v13/deployments${
          process.env.BUILD_ID ? `/${process.env.BUILD_ID}` : ''
        }?teamId=${process.env.VERCEL_TEAM_ID}`;
        break;
      case 'alias':
        method = 'POST';
        url = `https://api.vercel.com/v2/deployments${
          process.env.BUILD_ID ? `/${process.env.BUILD_ID}` : ''
        }/aliases?teamId=${process.env.VERCEL_TEAM_ID}`;
        break;
      case 'getAlias':
        method = 'GET';
        url = `https://api.vercel.com/v2/deployments${
          process.env.BUILD_ID ? `/${process.env.BUILD_ID}` : ''
        }/aliases?teamId=${process.env.VERCEL_TEAM_ID}`;
        break;
      case 'removeStagingAlias':
        method = 'DELETE';
        url = `https://api.vercel.com/v2/aliases${
          process.env.STAGING_ALIAS_UID
            ? `/${process.env.STAGING_ALIAS_UID}`
            : ''
        }?teamId=${process.env.VERCEL_TEAM_ID}`;
        break;
      case 'check':
        method = 'GET';
        url = `https://api.vercel.com/v13/deployments${
          process.env.BUILD_ID ? `/${process.env.BUILD_ID}` : ''
        }?teamId=${process.env.VERCEL_TEAM_ID}`;
        break;
      default:
        break;
    }

    const stagingURL = `staging.squares.so`;

    const config = {
      method,
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
            target:
              process.env.GITHUB_REF_NAME === 'main' ? 'production' : undefined,
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
            alias: stagingURL,
          },
        }).then((res) => {
          // eslint-disable-next-line
          console.log(res.data.alias);
        });
        break;

      case 'getAlias':
        await axios({
          ...config,
        }).then((res) => {
          // eslint-disable-next-line
          console.log(res.data.aliases.find(({alias}) => alias === stagingURL).uid);
        });
        break;

      case 'removeStagingAlias':
        await axios({
          ...config,
        }).then((res) => {
          // eslint-disable-next-line
          console.log(res.data.status);
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
    console.error("Request failed");
    console.error(e.response.data);
    /* eslint-enable */
  }
}

vercel();
