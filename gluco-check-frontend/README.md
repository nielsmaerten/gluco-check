# Gluco Check Frontend Client

## This is a merged repository
Prior to **2021-04-17**, gluco-check-frontend was being developed in a [separate repository](https://github.com/ddamico/gluco-check-frontend). 

The package got merged into this repo in e67d36ec. If you're looking for commits prior to **2021-04-17**, check out: https://github.com/ddamico/gluco-check-frontend

### Remaining TODOs:
- [x] Remove .gitignore
- [ ] Update the docs
- [ ] Can we move firebase.json and .firebaserc to the root ?
- [ ] Explore: maybe use `git-crypt` for .env files ?
- [ ] [NEXT] Merge GitHub workflows (/.github)
- [ ] Issue: vscode-jest support? (Workaround: open frontend in its own window)
- [ ] Explore: how to deploy to Firebase now?
- [ ] Merge husky and lint-staged config into main repo, remove from this repo
- [ ] ...

- [x] git clone gluco-check-frontend into this folder
- [x] delete .gitignore, .git/, and yarn.lock
- [x] run yarn install in the root
- [x] verify build, test and serve are working
- [ ] delete this section

## Intro

This repo contains the frontend app for user-management of Gluco Check settings. It is a plain old Create React App app, built in [Typescript](http://typescriptlang.org).

We've used [i18n](https://www.i18next.com) for supporting multiple languages in the frontend. The translation files are hosted directly in the project for now, but should be moving out to crowdin soon enough.

We've used [react testing library](https://testing-library.com/docs/react-testing-library/intro/) for testing the app.

Please refer to the main contributors guide for more information on getting started. Not affiliated with the Nightscout Project.

## Environment Variables

### Firebase

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_DB_URL`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

### i18next

- `REACT_APP_I18N_DEBUG`
- `REACT_APP_I18N_FALLBACK_LANGUAGE`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test:cov`

Runs a test coverage report.

### `yarn test:debug`

Launches the tests running in debug mode.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.
