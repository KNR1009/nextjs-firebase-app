import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import firebase from "firebase/app";

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
  return <div>{user ? user.name : "ロード中…"}</div>;
};

export default UserShow;
