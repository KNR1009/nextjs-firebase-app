import firebase from "firebase/app";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { User } from "../models/User";

const userState = atom<User>({
  key: "user",
  default: null,
});

export const useAuthentication = () => {
  const [user, setUser] = useRecoilState<User>(userState);

  useEffect(() => {
    //  ログイン状態だった場合はフックをfirebaseへの認証処理を発火させない
    if (user !== null) {
      return;
    }

    // 自動認証
    firebase
      .auth()
      .signInAnonymously()
      .catch(function (error) {
        // Handle Errors here.
      });

    // 引数でブラウザに振られたユーザー情報を取得
    firebase.auth().onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) {
        const loginUser = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
          name: "",
        };
        setUser(loginUser);

        // ログインユーザー情報をfirebaseへ格納
        createUserIfNotFound(loginUser);
      } else {
        // User is signed out.
        setUser(null);
      }
    });
  }, []);

  return { user };
};

// firebase側に値を保存
export const createUserIfNotFound = async (user: User) => {
  const userRef = firebase.firestore().collection("user").doc(user.uid);

  const doc = await userRef.get();

  // データがない場合はそのまま処理を終わらせる
  if (doc.exists) {
    return;
  }

  // フィールドの中に名前を追加する
  await userRef.set({
    name: "taro" + new Date().getTime(),
  });
};
