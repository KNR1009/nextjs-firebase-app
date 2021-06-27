import Head from "next/head";
import Link from "next/link";
import { useAuthentication } from "../hoks/authentication";

export default function Home() {
  const { user } = useAuthentication();

  return (
    <div>
      <Head>
        <title>Page2</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p>{user.uid && user.uid}</p>
      <Link href="/">
        <a>Go back</a>
      </Link>
    </div>
  );
}
