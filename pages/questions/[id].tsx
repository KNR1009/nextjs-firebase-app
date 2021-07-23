import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import Layout from "../../components/Layout";
import { Question } from "../../models/Question";
import { useAuthentication } from "../../hoks/authentication";

type Query = {
  id: string;
};

export default function QuestionsShow() {
  const router = useRouter();
  const query = router.query as Query;
  const { user } = useAuthentication();
  const [question, setQuestion] = useState<Question>(null);

  const loadData = async () => {
    if (query.id === undefined) {
      return;
    }

    const questionDoc = await firebase
      .firestore()
      .collection("questions")
      .doc(query.id)
      .get();
    if (!questionDoc.exists) {
      return;
    }

    const gotQuestion = questionDoc.data() as Question;
    gotQuestion.id = questionDoc.id;
    setQuestion(gotQuestion);
  };

  useEffect(() => {
    loadData();
  }, [query.id]);

  const onSubmit = (e: FormEvent<HTMLFontElement>) => {
    e.preventDefault();
    firebase.firestore().runTransaction(async (t) => {
      t.set(firebase.firestore().collection("answers").doc(), {
        uid: user.uid,
        questionId: question.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      t.update(firebase.firestore().collection("questions").doc(question.id), {
        isReplied: true,
      });
    });
  };

  return (
    <Layout>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          {question && (
            <div className="card">
              <div className="card-body">{question.body}</div>
            </div>
          )}
        </div>
      </div>
      <section className="text-center mt-4">
        <h2 className="h4">回答する</h2>
        <form onSubmit={onSubmit}>
          <textarea
            className="form-control"
            placeholder="おげんきですか？"
            rows={6}
            required
          ></textarea>
          <div className="m-3">
            <button type="submit" className="btn btn-primary">
              回答する
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
}
