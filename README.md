## Apply Admin

This is the Vue SPA for managing exercises and candidates. 

## Project setup
```
npm install
```

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

### Run your tests
```
npm run test
```

### Deployment

The CircleCI instance has to have a `FIREBASE_DEPLOY_TOKEN` set.  This is tied to a specific firebase user.  If that user leaves
the organisation, the token will need to be reset.  To do so run `firebase login:ci` and follow the instructions there and then on
CircleCI.


