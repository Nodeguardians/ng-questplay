![Node Guardians: Quests](./media/banner.png)

Welcome guardian. The road out will be treacherous, but remember, fortune favors the brave.

`ng-questplay` is a lightweight CLI-based application that helps you manage your quests as you venture out into [the wilderness](nodeguardians.io) to complete quests and fulfill your duty as a **Node Guardian**.

## Getting Started

Clone the repo onto your local device: 

```
git clone https://github.com/Nodeguardians/ng-questplay.git`
cd ng-questplay
```

Then install the necessary packages and symlink:

```
npm install
npm link
```

Create a [Github authentication token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with **public repo access** only. Then, add it into a `.credentials` file.

```
echo {AUTH_TOKEN} > ./credentials
```

> ⚠️ Take care to not share / upload this file to anyone or anywhere.

## Finding a Quest

Run the following command to find and download a specific quest into your repo.

```
quest find
```

Alternatively, you can immediately specify the quest name (hypenated, no spaces).

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

## Updating CLI

Remember to pull the latest version of this repo to keep yourself up to date with the latest changes.
