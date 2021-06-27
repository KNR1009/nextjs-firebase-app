import firebase from "firebase/app";

function authenticate() {
  // ユーザー認証が通っているかのチェック
  firebase
    .auth()
    .signInAnonymously()
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.toJSON());
      console.log(user.uid);
      console.log(user.isAnonymous);
    } else {
      // User is signed out.
      // ...
      console.log("ログインしていません");
    }
    // ...
  });
}

if (process.browser) {
  authenticate();
}
