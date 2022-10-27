const axios = require("axios");
console.log('axios')
const postReleaseMessage = async () => {
  console.log(process.env.github)
  let github = process.env.github;
  let curTag = github.ref_name;
  let prevTag = null;
  const repositoryLink =
    "https://api.github.com/repos/KremeshevD/infra-template";
  const headersGit = {
    headers: { Authorization: github.secrets.GITHUBAPI_TOKEN },
  };
  const headersTreker = {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `OAuth ${github.secrets.YANDEX_AUTH_TOKEN}`,
      "X-Org-ID": github.secrets.APP_ID,
    },
  };

  try {
    prevTag = await axios.get(repositoryLink + "/releases/latest", headersGit);

    if (!prevTag) {
      responce = await axios.get(repositoryLink + "/commits", headersGit);
      responce = responce.data;
    } else {
      responce = await axios.get(
        `https://api.github.com/repos/nyamzmeya/infra-template/compare/${prevTag.data.tag_name}...${curTag}`,
        headersGit
      );
      responce = responce.data.commits;
    }
    let result = "";
    responce.forEach((commit) => {
      result += `${commit.sha} ${commit.commit.author.name} ${commit.commit.message} `;
    });

    await axios.post(
      "https://api.tracker.yandex.net/v2/issues/HOMEWORKSHRI-135/comments",
      {
        text: result,
      },
      headersTreker
    );
  } catch (error) {}
};
postReleaseMessage().then();
