# AppDev Core JavaScript Libraries

This is an NPM package in which we store our shared JavaScript code. These abstractions are usually common to all our JavaScript backends.

## Build

To build, run the following:

```
npm install
npm run build
```

This will build the latest version of the library. You can `npm link` this library globally, and then test its functionality in other Node.js projects by linking the package (`npm link appdev`).
