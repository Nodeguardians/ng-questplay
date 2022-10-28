# Downloading a Quest

> _You have gotten your gear. Now, find the training fields._

As you might have noticed, your Questplay repo does not have any quests at the moment. To embark on our first quest, we have to first download one.

## Setting a Github token

Questplay will require a [Github authentication token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to download quests from Github.

1. Create a Github authentication token with **public and private repo access**.

2. In Questplay's root folder, create a file named `.env`.

3. Add a `GITHUB_TOKEN` variable into your `.env` file.

    ```bash
    # In .env file
    GITHUB_TOKEN = "ghp_..." # Add your token here
    ```

Never share your Github token to anyone or anywhere! `.env` is in `.gitignore` so that your token will not be published onto your forked Questplay repository on Github.

## Downloading the Tutorial Quest

After adding your Github token, Questplay can now freely download quests from Github, without worrying about exceeding Github's download limit.

Let us try downloading this tutorial quest now.

1. Open the Questplay repository using your favourite IDE (e.g. VSCode).
2. In the terminal, run `quest find build-tutorial`. 
3. You should be prompted to allow a download. Accept the download, and you should find the quest in Questplay at `./campaigns/standalone-quests/build-tutorial`.

## Your Task

Download the tutorial quest.