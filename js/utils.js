// ユーティリティ関数

// UI表示/非表示
function showLoginContainer() {
  document.getElementById('loginContainer').classList.remove('hidden');
  document.getElementById('mainContainer').classList.add('hidden');
}

function showMainContainer() {
  document.getElementById('loginContainer').classList.add('hidden');
  document.getElementById('mainContainer').classList.remove('hidden');
}

function showLoader() {
  document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
}

// 日付フォーマット
function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString('ja-JP');
}

function formatDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString('ja-JP');
}

// エラー表示
function showError(message) {
  console.error(message);
  alert(message);
}
