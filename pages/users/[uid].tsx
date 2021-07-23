import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { User } from "../../models/User";
import firebase from "firebase/app";
import Layout from "../../components/Layout";
import { toast } from "react-toastify";

type Query = {
  uid: string;
};

const UserShow = () => {
  const [user, setUser] = useState<User>(null);
  const [body, setBody] = useState<string>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
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
      // dataの中にuidのオブジェクトを追加して、stateを更新関数で更新
      data.uid = doc.id;
      setUser(data);
    };
    loadUser();
  }, [query.uid]);

  // firebaseへ質問を登録
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ローディング処理の値
    setIsSending(true);

    await firebase.firestore().collection("questions").add({
      senderUid: firebase.auth().currentUser.uid,
      receiverUid: user.uid,
      body: body,
      isReplied: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setIsSending(false);

    setBody("");

    // 送信完了時にフラッシュが出てくるようにする
    toast.success("質問を送信しました。", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <Layout>
      <div className="container">
        {user && (
          <div className="text-center">
            <div className="h4">{user.name}さんのページ</div>
            <div className="m-5">{user.name}さんに質問をしよう</div>
          </div>
        )}
        <div className="row justify-content-center mb-3">
          <div className="col-12 col-md-6">
            <form onSubmit={onSubmit}>
              {" "}
              <textarea
                className="form-control"
                placeholder="おげんきですか？"
                rows={6}
                required
                onChange={(e) => {
                  setBody(e.target.value);
                }}
              ></textarea>
              <div className="m-3">
                {isSending ? (
                  <p>送信中です</p>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    質問を送信する
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserShow;
