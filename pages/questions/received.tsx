import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import Layout from "../../components/Layout";
import { Question } from "../../models/Question";
import { useAuthentication } from "../../hoks/authentication";
import dayjs from "dayjs";
import Link from "next/link";

const QuestionReceived = () => {
  const { user } = useAuthentication();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!process.browser) {
      return;
    }
    if (user === null) {
      return;
    }

    async function loadQuestions() {
      const snapshot = await firebase
        .firestore()
        .collection("questions")
        .where("receiverUid", "==", user.uid)
        .orderBy("createdAt", "desc")
        .get();

      if (snapshot.empty) {
        return;
      }
      // mapで新しい配列を自動で作成してくれる
      const gotQuestions = snapshot.docs.map((doc) => {
        const question = doc.data() as Question;
        question.id = doc.id;
        return question;
      });

      setQuestions(gotQuestions);
    }

    loadQuestions();
  }, [process.browser, user]);
  return (
    <Layout>
      <h1 className="h4">受け取った質問一覧</h1>

      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          {questions.map((question) => (
            <div className="card my-3" key={question.id}>
              <div className="card-body">
                <div className="text-truncate">{question.body}</div>
                <div className="text-muted text-end">
                  <small>
                    {dayjs(question.createdAt.toDate()).format(
                      "YYYY/MM/DD HH:mm"
                    )}
                  </small>
                </div>

                <Link href={`${question.id}`} key={question.id}>
                  <a>質問詳細ページへ</a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default QuestionReceived;
