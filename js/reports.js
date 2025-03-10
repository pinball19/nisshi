// 日報関連の処理

// グローバル変数
let allReports = [];
let allClients = [];
let currentReportId = null;
let editMode = false;

// 日報データ読み込み
async function loadReports() {
  try {
    showLoader();
    let query = db.collection('reports');
    
    if (!isAdmin) {
      // 管理者以外は自分の日報のみ表示
      query = query.where('authorId', '==', currentUser.id);
    }
    
    // 日付の新しい順にソート
    query = query.orderBy('reportDate', 'desc');
    
    const snapshot = await query.get();
    allReports = [];
    snapshot.forEach(doc => {
      allReports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    renderReportsList(allReports);
    hideLoader();
  } catch (error) {
    console.error('日報データの読み込みエラー:', error);
    showError('日報データの読み込みに失敗しました');
    hideLoader();
  }
}

// クライアントデータ読み込み
async function loadClients() {
  try {
    const snapshot = await db.collection('clients').get();
    allClients = [];
    snapshot.forEach(doc => {
      allClients.push(doc.data().name);
    });
  } catch (error) {
    console.error('クライアントデータの読み込みエラー:', error);
  }
}

// 日報リスト表示
function renderReportsList(reports) {
  const reportsListContainer = document.getElementById('reportsListContainer');
  reportsListContainer.innerHTML = '';
  
  if (reports.length === 0) {
    reportsListContainer.innerHTML = '<div class="text-center p-3">日報がありません</div>';
    return;
  }
  
  reports.forEach(report => {
    const formattedDate = formatDate(report.reportDate);
    
    const item = document.createElement('a');
    item.className = 'list-group-item list-group-item-action';
    item.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h6 class="mb-1">${report.clientName}</h6>
        <small>${formattedDate}</small>
      </div>
      <p class="mb-1">${report.purpose}</p>
      <small>${report.authorName}</small>
    `;
    
    item.addEventListener('click', () => {
      // アクティブ状態の切り替え
      document.querySelectorAll('.list-group-item').forEach(el => {
        el.classList.remove('active');
      });
      item.classList.add('active');
      
      loadReportDetail(report.id);
    });
    
    reportsListContainer.appendChild(item);
  });
}

// 日報詳細の読み込み
async function loadReportDetail(reportId) {
  try {
    showLoader();
    currentReportId = reportId;
    
    const reportDoc = await db.collection('reports').doc(reportId).get();
    if (!reportDoc.exists) {
      console.error('日報が見つかりません');
      hideLoader();
      return;
    }
    
    const report = {
      id: reportDoc.id,
      ...reportDoc.data()
    };
    
    renderReportDetail(report);
    loadComments(reportId);
    hideLoader();
  } catch (error) {
    console.error('日報詳細の読み込みエラー:', error);
    showError('日報詳細の読み込みに失敗しました');
    hideLoader();
  }
}

// 日報詳細表示
function renderReportDetail(report) {
  // フォームを隠して詳細を表示
  const reportForm = document.getElementById('reportForm');
  const reportDetail = document.getElementById('reportDetail');
  const commentsSection = document.getElementById('commentsSection');
  const editReportBtn = document.getElementById('editReportBtn');
  const saveReportBtn = document.getElementById('saveReportBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  
  reportForm.classList.add('hidden');
  reportDetail.classList.remove('hidden');
  commentsSection.classList.remove('hidden');
  
  // 詳細情報を設定
  document.getElementById('detailDate').textContent = formatDate(report.reportDate);
  document.getElementById('detailClient').textContent = report.clientName;
  document.getElementById('detailPurpose').textContent = report.purpose;
  document.getElementById('detailContent').textContent = report.content;
  document.getElementById('detailResult').textContent = report.result;
  document.getElementById('detailNextAction').textContent = report.nextAction;
  document.getElementById('detailAuthor').textContent = report.authorName;
  document.getElementById('detailUpdated').textContent = formatDateTime(report.updatedAt);
  
  // 編集ボタンの表示（管理者または自分の日報のみ編集可能）
  if (isAdmin || report.authorId === currentUser.id) {
    editReportBtn.classList.remove('hidden');
  } else {
    editReportBtn.classList.add('hidden');
  }
  
  saveReportBtn.classList.add('hidden');
  cancelEditBtn.classList.add('hidden');
  
  // 現在の日報データをフォームにも設定（編集用）
  const reportDate = new Date(report.reportDate.seconds * 1000);
  document.getElementById('reportDate').valueAsDate = reportDate;
  document.getElementById('clientName').value = report.clientName;
  document.getElementById('purpose').value = report.purpose;
  document.getElementById('reportContent').value = report.content;
  document.getElementById('result').value = report.result;
  document.getElementById('nextAction').value = report.nextAction;
}

// 新規日報作成
function handleCreateReport() {
  // リセット
  currentReportId = null;
  editMode = true;
  
  const reportForm = document.getElementById('reportForm');
  const reportDetail = document.getElementById('reportDetail');
  const commentsSection = document.getElementById('commentsSection');
  const editReportBtn = document.getElementById('editReportBtn');
  const saveReportBtn = document.getElementById('saveReportBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  
  // フォームをリセット
  document.getElementById('reportDate').valueAsDate = new Date();
  document.getElementById('clientName').value = '';
  document.getElementById('purpose').value = '';
  document.getElementById('reportContent').value = '';
  document.getElementById('result').value = '';
  document.getElementById('nextAction').value = '';
  
  // UIの表示設定
  reportDetail.classList.add('hidden');
  commentsSection.classList.add('hidden');
  reportForm.classList.remove('hidden');
  editReportBtn.classList.add('hidden');
  saveReportBtn.classList.remove('hidden');
  cancelEditBtn.classList.remove('hidden');
  
  // アクティブな項目を解除
  document.querySelectorAll('.list-group-item').forEach(el => {
    el.classList.remove('active');
  });
}

// 日報編集
function handleEditReport() {
  editMode = true;
  
  const reportForm = document.getElementById('reportForm');
  const reportDetail = document.getElementById('reportDetail');
  const commentsSection = document.getElementById('commentsSection');
  const editReportBtn = document.getElementById('editReportBtn');
  const saveReportBtn = document.getElementById('saveReportBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  
  // UIの表示設定
  reportDetail.classList.add('hidden');
  commentsSection.classList.add('hidden');
  reportForm.classList.remove('hidden');
  editReportBtn.classList.add('hidden');
  saveReportBtn.classList.remove('hidden');
  cancelEditBtn.classList.remove('hidden');
}

// 日報保存
async function handleSaveReport(e) {
  e.preventDefault();
  
  try {
    showLoader();
    
    const reportDate = document.getElementById('reportDate').valueAsDate;
    const clientName = document.getElementById('clientName').value;
    const purpose = document.getElementById('purpose').value;
    const content = document.getElementById('reportContent').value;
    const result = document.getElementById('result').value;
    const nextAction = document.getElementById('nextAction').value;
    
    // バリデーション
    if (!reportDate || !clientName || !purpose || !content || !result || !nextAction) {
      showError('すべての項目を入力してください');
      hideLoader();
      return;
    }
    
    const reportData = {
      reportDate: firebase.firestore.Timestamp.fromDate(reportDate),
      clientName,
      purpose,
      content,
      result,
      nextAction,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    if (!currentReportId) {
      // 新規作成
      reportData.authorId = currentUser.id;
      reportData.authorName = currentUser.name;
      reportData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      
      const docRef = await db.collection('reports').add(reportData);
      currentReportId = docRef.id;
      
      // クライアント名が新規の場合は保存
      if (!allClients.includes(clientName)) {
        await db.collection('clients').add({
          name: clientName,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        allClients.push(clientName);
      }
    } else {
      // 更新
      await db.collection('reports').doc(currentReportId).update(reportData);
      
      // クライアント名が新規の場合は保存
      if (!allClients.includes(clientName)) {
        await db.collection('clients').add({
          name: clientName,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        allClients.push(clientName);
      }
    }
    
    // 日報一覧を再読み込み
    await loadReports();
    
    // 詳細画面に戻る
    loadReportDetail(currentReportId);
    editMode = false;
    
    hideLoader();
  } catch (error) {
    console.error('日報保存エラー:', error);
    showError('日報の保存に失敗しました');
    hideLoader();
  }
}

// 編集キャンセル
function handleCancelEdit() {
  const reportForm = document.getElementById('reportForm');
  const reportDetail = document.getElementById('reportDetail');
  const commentsSection = document.getElementById('commentsSection');
  const saveReportBtn = document.getElementById('saveReportBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  
  if (currentReportId) {
    loadReportDetail(currentReportId);
  } else {
    reportForm.classList.add('hidden');
    
    // 新規作成のキャンセル時は一覧のみ表示
    reportDetail.classList.add('hidden');
    commentsSection.classList.add('hidden');
    saveReportBtn.classList.add('hidden');
    cancelEditBtn.classList.add('hidden');
  }
  
  editMode = false;
}

// 検索処理
function handleSearch() {
  const searchText = document.getElementById('searchInput').value.toLowerCase();
  
  if (!searchText) {
    renderReportsList(allReports);
    return;
  }
  
  const filteredReports = allReports.filter(report => {
    return (
      report.clientName.toLowerCase().includes(searchText) ||
      report.purpose.toLowerCase().includes(searchText) ||
      report.content.toLowerCase().includes(searchText) ||
      report.authorName.toLowerCase().includes(searchText)
    );
  });
  
  renderReportsList(filteredReports);
}

// クライアント自動補完
function handleClientAutocomplete() {
  const input = document.getElementById('clientName');
  const suggestionsContainer = document.getElementById('clientSuggestions');
  const value = input.value.toLowerCase();
  
  suggestionsContainer.innerHTML = '';
  
  if (!value) {
    return;
  }
  
  // 部分一致する候補を抽出
  const filteredClients = allClients.filter(client => 
    client.toLowerCase().includes(value)
  );
  
  // 候補を表示
  filteredClients.slice(0, 5).forEach(client => {
    const div = document.createElement('div');
    div.innerHTML = client;
    div.addEventListener('click', () => {
      input.value = client;
      suggestionsContainer.innerHTML = '';
    });
    suggestionsContainer.appendChild(div);
  });
  
  // 入力フィールド以外をクリックしたときに候補を非表示
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.innerHTML = '';
    }
  });
}

// 日報関連のイベントリスナーを登録
function initReports() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const createReportBtn = document.getElementById('createReportBtn');
  const editReportBtn = document.getElementById('editReportBtn');
  const saveReportBtn = document.getElementById('saveReportBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const clientNameInput = document.getElementById('clientName');
  
  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('input', handleSearch);
  createReportBtn.addEventListener('click', handleCreateReport);
  editReportBtn.addEventListener('click', handleEditReport);
  saveReportBtn.addEventListener('click', handleSaveReport);
  cancelEditBtn.addEventListener('click', handleCancelEdit);
  
  // クライアント名の自動補完
  clientNameInput.addEventListener('input', handleClientAutocomplete);
  
  // 日付の初期設定
  document.getElementById('reportDate').valueAsDate = new Date();
}
