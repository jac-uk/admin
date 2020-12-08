## Admin

[![CircleCI](https://circleci.com/gh/jac-uk/apply-admin.svg?style=svg)](https://circleci.com/gh/jac-uk/apply-admin)

This is the Vue SPA for managing exercises and candidates. By default, it deploys to `digital-staging-apply-admin`.

## Clone repository onto local machine
```
git clone git@github.com:jac-uk/admin.git
```
### Change directory into project directory
```
cd admin
```
## Project setup
```
npm install
```

## Add environment variables to root project

create .env.develop.local file in root directory + credentials

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

## Project deploy

By default `firebase deploy` deploys to `staging`.

### Manually deploy to production

To manually deploy to production use either:

```
firebase deploy --project production
```

**or**

```
firebase use production
firebase deploy
```

### Continuous deployment

Merging to `master` automatically triggers a deploy to `production`.

Merging to `staging` automatically triggers a deploy to `staging`.


### CircleCI configuration

The CircleCI instance has to have a `FIREBASE_DEPLOY_TOKEN` set.  This is tied to a specific firebase user.  If that user leaves
the organisation, the token will need to be reset.  To do so run `firebase login:ci` and follow the instructions there and then on
CircleCI.

CircleCI environment variables are defined here:

https://circleci.com/gh/jac-uk/apply-admin/edit#env-vars

Firebase environment variables bound to the CircleCI environment variables defined here:

https://console.firebase.google.com/project/platform-production-9207d/settings/general/web:YmM4YmQ2YzItYjAyNy00MTVkLWI0MmQtNmNhZDE2ZDQwMjcw



