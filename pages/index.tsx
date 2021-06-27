import styles from "../styles/Home.module.css";
import { useAuthentication } from "../hoks/authentication";

export default function Home() {
  const { user } = useAuthentication();
  return <div>{user?.uid}</div>;
}
