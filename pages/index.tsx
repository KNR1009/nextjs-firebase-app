import { useAuthentication } from "../hoks/authentication";
import Link from "next/link";
import React from "react";
import Layout from "../components/Layout";

export default function Home() {
  const { user } = useAuthentication();
  return (
    <Layout>
      <div>{user?.uid}</div>
      <Link href={`users/${user?.uid}`}>
        <a>ユーザー詳細ページへ</a>
      </Link>
    </Layout>
  );
}
