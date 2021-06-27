import { useAuthentication } from "../hoks/authentication";
import Link from "next/link";

export default function Home() {
  const { user } = useAuthentication();
  return (
    <>
      <div>{user?.uid}</div>
      <Link href="/page2">
        <a>Go to page2</a>
      </Link>
    </>
  );
}
