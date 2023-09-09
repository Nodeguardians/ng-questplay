![Node Guardians: Quests](./media/banner.webp)

Welcome guardian. The road out will be treacherous, but remember, fortune favors the brave.

`ng-questplay` is a lightweight CLI-based application that helps you manage your quests as you venture out into [the wilderness](https://nodeguardians.io/) to complete quests and fulfill your duty as a _Node Guardian_.

## Getting Started

We **highly recommend** that you set up Questplay by following [our tutorial](https://nodeguardians.io/dev-hub?s=devhub-campaigns&sc=tutorial). But here are the brief steps anyways.

1. Create a new private repository `ng-questplay` on Github and leave it empty for now. Then, install [our Github application](https://github.com/apps/node-guardians) on it.

    > ⚠ Your repository must be private!

2. Download this repository onto your local device, and push it to the Github repository you have created.

    - **If Using GitHub HTTPS:**

        ```
        git clone https://github.com/Nodeguardians/ng-questplay.git
        cd ng-questplay
        git remote set-url origin https://github.com/{GITHUB_USERNAME}/ng-questplay.git
        git push -u origin main
        ```

    - **If Using Github SSH**

        ```
        git clone git@github.com:github.com/Nodeguardians/ng-questplay.git
        cd ng-questplay
        git remote set-url origin git@github.com:{GITHUB_USERNAME}/ng-questplay.git
        git push -u origin main
        ```

    > 💡 Replace `{GITHUB_USERNAME}` with your Github username!

3. Next, run the following command to install the required dependencies.

    ```
    npm run start-adventure
    ```

4. Create a [Github authentication token](https://nodeguardians.io/?s=home-faq&sf=devhub--why-and-how-do-i-create-a-github-token) with **public repo access**. Then, create a `.env` file in your root folder and add a `GITHUB_TOKEN` variable:

    ```bash
    # In .env file
    GITHUB_TOKEN = "ghp_..." # Add token here
    ```

    > ⚠️ Take care to not share / upload your `.env` file to anyone or anywhere.

## Finding a Quest

Run the following command to find and download a specific quest into your repo.

```
quest find
```

Alternatively, you can immediately specify the quest name (hyphenated, no spaces).

```
quest find using-signatures
```

## Running a Local Test

To run a local test in a quest, first make sure you are in the quest folder. Then:

```
# Run local tests in Part 1
quest test 1
```

```
# Run all local tests
quest test
```

If you have Foundry installed, our quests also support local Foundry tests. To configure your preferred framework to Foundry:

```
quest set-framework foundry
```

After which, running `quest test` will trigger Foundry tests to run instead. The native command `forge test` also triggers Foundry tests, albeit in a less readable format. However, using `forge` gives you access to Foundry's many features (e.g., `-vvv` flag).

## Submitting a Quest

To submit a quest for verification, first make sure you are in the quest folder.
Commit all your changes into your local repository. Then run:

```
quest submit
```

This command pushes your code to your remote repository in Github for verification.

## Running the Cross-Chain Bridge

Certain quests require you to run a cross-chain bridge from **Avalanche Fuji** to **Ethereum Goerli**. These quests will provide you a way to obtain a 32-byte bridge hash. Then, run the following command.

> 💡 Replace `{BRIDGE_HASH}` with your 32-byte bridge hash!

If the bridge hash is valid, you will be given a signature required to process any cross-chain transaction.

## Updating CLI

To update the CLI, run:

```
quest update
```
