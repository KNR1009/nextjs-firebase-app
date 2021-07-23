import { useRouter } from "next/router";
import React, { SetStateAction, useEffect, useState } from "react";
import firebase from "firebase/app";
import { useAuthentication } from "../../hoks/authentication";
import { Question } from "../../models/Question";
import Layout from "../../components/Layout";

const UserQuestionSHow = () => {
  const router = useRouter();
  const { user } = useAuthentication();
  const [question, setQuestion] = useState<Question>();

  const query = typeof router.query.id == "string" ? router.query.id : null;

  useEffect(() => {
    if (!process.browser) {
      return;
    }
    if (user === null) {
      return;
    }

    const getQuestion = async () => {
      const doc = await firebase
        .firestore()
        .collection("questions")
        .doc(query)
        .get();

      const data = (await doc.data()) as SetStateAction<Question>;
      setQuestion(data);
    };
    getQuestion();
    console.log(question);
  }, [router.query.id]);

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
    </Layout>
  );
};

export default UserQuestionSHow;
