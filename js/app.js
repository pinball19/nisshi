// アプリケーションのメイン処理

// アプリ初期化
function init() {
  try {
    console.log('アプリ初期化開始');
    
    // まずローダーを非表示にする（重要）
    hideLoader();
    
    // 各モジュールの初期化
    initAuth();
    initReports();
    initComments();
    
    // 初期画面表示
    showLoginContainer();
    
    console.log('アプリ初期化完了');
  } catch (error) {
    console.error('初期化エラー:', error);
    // エラーが発生してもローダーを非表示にする
    hideLoader();
    showLoginContainer();
  }
}

// DOMの読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', init);
