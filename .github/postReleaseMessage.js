const axios = require("axios");
console.log('axios')
const postReleaseMessage = async () => {
  console.log(process.env)
  let {GITHUB_TOKEN, tag_name, yandex_auth_token, app_id, } = process.env;
  let curTag = tag_name;
  let prevTag = null;
  const repositoryLink =
    "https://api.github.com/repos/KremeshevD/infra-template";
  const headersGit = {
    headers: { Authorization: GITHUB_TOKEN },
  };
  const headersTreker = {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `OAuth ${yandex_auth_token}`,
      "X-Org-ID": app_id,
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
