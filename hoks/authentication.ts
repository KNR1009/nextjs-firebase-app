import firebase from "firebase/app";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
// import { User } from "../models/User";

const userState = atom<User>({
  key: "user",
  default: null,
});

type User = {
  uid: string;
  isAnonymous: boolean;
};

export function useAuthentication() {
  const [user, setUser] = useRecoilState<User>(userState);

  useEffect(() => {
    //  ログイン状態だった場合はフックをfirebaseへの認証処理を発火させない
    if (user !== null) {
      console.log("ログイン済み");
      return;
    }

    firebase
      .auth()
      .signInAnonymously()
      .catch(function (error) {
        // Handle Errors here.
        console.error(error);
      });

    firebase.auth().onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) {
        console.log("aaa");
        setUser({
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
        });
      } else {
        // User is signed out.
        setUser(null);
      }
    });
  }, []);

  return { user };
}
