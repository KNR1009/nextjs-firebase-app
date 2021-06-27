import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Question } from "../../models/Question";

const QuestionReceived = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  return (
    <Layout>
      <div>{questions.length}</div>
    </Layout>
  );
};

export default QuestionReceived;
