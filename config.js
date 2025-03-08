// Firebase設定
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebaseの初期化
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// シンプルなログイン用マッピング
// 実際の環境では、この部分はサーバーサイドで管理するか、Firebaseの認証機能を活用すべきです
const EMPLOYEE_CREDENTIALS = {
  "1001": { password: "pass1001", role: "admin", name: "管理者 太郎" },
  "1002": { password: "pass1002", role: "sales", name: "営業 一郎" },
  "1003": { password: "pass1003", role: "sales", name: "営業 二郎" },
  "1004": { password: "pass1004", role: "sales", name: "営業 三郎" },
  "1005": { password: "pass1005", role: "sales", name: "営業 四郎" }
};
