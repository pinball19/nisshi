// 認証関連の処理

// グローバル変数
let currentUser = null;
let isAdmin = false;

// ログイン処理
function handleLogin(e) {
  e.preventDefault();
  showLoader();
  
  const employeeId = document.getElementById('employeeId').value;
  const password = document.getElementById('password').value;
  const loginError = document.getElementById('loginError');
  
  // ローカルの簡易認証
  if (EMPLOYEE_CREDENTIALS[employeeId] && EMPLOYEE_CREDENTIALS[employeeId].password === password) {
    // ログイン成功
    currentUser = {
      id: employeeId,
      name: EMPLOYEE_CREDENTIALS[employeeId].name,
      role: EMPLOYEE_CREDENTIALS[employeeId].role
    };
    
    // 管理者権限確認
    isAdmin = currentUser.role === 'admin';
    
    // UIの更新
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = isAdmin ? '管理者' : '営業担当';
    
    // メイン画面表示
    showMainContainer();
    
    // 日報データ読み込み
    loadReports();
    loadClients();
    
    loginError.textContent = '';
  } else {
    // ログイン失敗
    loginError.textContent = '社員番号またはパスワードが正しくありません。';
    hideLoader();
  }
}

// ログアウト処理
function handleLogout() {
  showLoader();
  
  // ユーザー情報をクリア
  currentUser = null;
  isAdmin = false;
  
  // ログイン画面に戻る
  showLoginContainer();
  hideLoader();
}

// イベントリスナーの登録
function initAuth() {
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  
  loginForm.addEventListener('submit', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
}
