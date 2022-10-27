const axios = require("axios");
const postReleaseMessage = async () => {
  let {GITHUB_TOKEN, tag_name, yandex_auth_token, app_id } = process.env;
  console.log(GITHUB_TOKEN, tag_name, yandex_auth_token, app_id)
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
    console.log(prevTag)
    if (!prevTag) {
      responce = await axios.get(repositoryLink + "/commits", headersGit);
      responce = responce.data;
      console.log(responce.data)
    } else {
      responce = await axios.get(
        repositoryLink + `/${prevTag.data.tag_name}...${curTag}`,
        headersGit
      );
      responce = responce.data.commits;
    }
    let result = "";
    responce.forEach((commit) => {
      result += `${commit.sha} ${commit.commit.author.name} ${commit.commit.message} `;
    });
    console.log(result)
    await axios.post(
      "https://api.tracker.yandex.net/v2/issues/HOMEWORKSHRI-135/comments",
      {
        text: result,
      },
      headersTreker
    );
  } catch (error) {
    console.log(error)
  }
};
postReleaseMessage().then();
