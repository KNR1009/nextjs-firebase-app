import { useAuthentication } from "../hoks/authentication";
import Link from "next/link";

export default function Home() {
  const { user } = useAuthentication();
  return (
    <>
      <div>{user?.uid}</div>
      <Link href={`users/${user?.uid}`}>
        <a>ユーザー詳細ページへ</a>
      </Link>
    </>
  );
}
