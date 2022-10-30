const axios = require("axios");
const postReleaseMessage = async () => {
  let { GITHUB_TOKEN, tag_name, yandex_auth_token, app_id, commit_author, GITHUB_REPOSITORY } =
    process.env;
  let curTag = tag_name;
  let prevTag = null;

  const repositoryLink =
    `https://api.github.com/repos/${GITHUB_REPOSITORY}`;
  const headersGit = {
    headers: { Authorization: GITHUB_TOKEN },
  };

  const headersTreker = {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: yandex_auth_token,
      "X-Org-ID": app_id,
    },
  };

  try {
    //получаем предыдущий релизный  тэг
    prevTag = await axios.get(repositoryLink + "/releases/latest", headersGit);
    if (!prevTag) {
      //получаем все коммиты
      responce = await axios.get(repositoryLink + "/commits", headersGit);
      responce = responce.data;
    } else {
      //сравниваем предыдущий релиз и текущий
      responce = await axios.get(
        repositoryLink + `/compare/${prevTag.data.tag_name}...${curTag}`,
        headersGit
      );
      responce = responce.data.commits;
    }
    let result = responce
      .map(
        (commit) =>
          `${commit.sha} ${commit.commit.author.name} ${commit.commit.message}`
      )
      .join("\n");
    //постим информацию о релизе
    const post = await axios.patch(
      "https://api.tracker.yandex.net/v2/issues/HOMEWORKSHRI-135",
      {
        summary: `${curTag}  ${new Date().toLocaleDateString()}`,
        description: `Ответственный за релиз ${commit_author},  коммиты, попавшие в релиз: \n ${result}`,
      },
      headersTreker
    );
    //добавляем комментарий
    const comment = await axios.post(
      "https://api.tracker.yandex.net/v2/issues/HOMEWORKSHRI-135/comments",
      {
        text: `Собрали Docker контейнер с Тэгом ${curTag}`,
      },
      headersTreker
    );
  } catch (error) {}
};
postReleaseMessage().then();
