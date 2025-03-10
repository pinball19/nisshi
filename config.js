// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyBICy52kNVrkK_qOwo9o8j4xcFVBLyyhcU",
  authDomain: "nisshi-e8110.firebaseapp.com",
  projectId: "nisshi-e8110",
  storageBucket: "nisshi-e8110.firebasestorage.app",
  messagingSenderId: "147725626433",
  appId: "1:147725626433:web:6b8f7f1ff93a313a786ac0",
  measurementId: "G-V8DJ3LF5NK"
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
