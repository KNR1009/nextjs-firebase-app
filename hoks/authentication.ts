import firebase from "firebase/app";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
// import { User } from "../models/User";

type User = {
  uid: string;
  isAnonymous: boolean;
};

const userState = atom<User>({
  key: "user",
  default: null,
});

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
        const loginUser = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
        };
        setUser(loginUser);

        createUserIfNotFound(loginUser);
      } else {
        // User is signed out.
        setUser(null);
      }
    });
  }, []);

  return { user };
}

export const createUserIfNotFound = async (user: User) => {
  const userRef = firebase.firestore().collection("user").doc(user.uid);

  const doc = await userRef.get();

  if (doc.exists) {
    return;
  }

  await userRef.set({
    name: "taro" + new Date().getTime(),
  });
};
