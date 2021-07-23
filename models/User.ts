// firebaseの認証で取得する型を定義する
export type User = {
  uid: string;
  isAnonymous: boolean;
  name: string;
};
