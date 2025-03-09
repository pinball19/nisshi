// アプリケーションのメイン処理

// アプリ初期化
function init() {
  // 各モジュールの初期化
  initAuth();
  initReports();
  initComments();
  
  // 初期画面表示
  showLoginContainer();
  hideLoader();
}

// DOMの読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', init);
