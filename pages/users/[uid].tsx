import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { User } from "../../models/User";
import firebase from "firebase/app";
import Layout from "../../components/Layout";

type Query = {
  uid: string;
};

const UserShow = () => {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();
  const query = router.query as Query;

  //  firebaseとのアクセスを行いデータを取得する
  useEffect(() => {
    // 初回にレンダリングされないようにする
    if (query.uid === undefined) {
      return;
    }
    const loadUser = async () => {
      const doc = await firebase
        .firestore()
        .collection("user")
        .doc(query.uid)
        .get();

      if (!doc) {
        return;
      }

      const data = doc.data() as User;
      setUser(data);
    };
    loadUser();
  }, [query.uid]);
  return (
    <Layout>
      <div className="container">
        {user && (
          <div className="text-center">
            <div className="h4">{user.name}さんのページ</div>
            <div className="m-5">{user.name}さんに質問をしよう</div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserShow;
