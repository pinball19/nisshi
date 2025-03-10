// コメント関連の処理

// コメント読み込み
async function loadComments(reportId) {
  try {
    const commentsList = document.getElementById('commentsList');
    
    const snapshot = await db.collection('reports').doc(reportId)
      .collection('comments')
      .orderBy('createdAt', 'asc')
      .get();
    
    commentsList.innerHTML = '';
    
    if (snapshot.empty) {
      commentsList.innerHTML = '<div class="text-center text-muted my-3">コメントはありません</div>';
      return;
    }
    
    snapshot.forEach(doc => {
      const comment = doc.data();
      const commentDate = new Date(comment.createdAt.seconds * 1000);
      
      const isAdmin = comment.authorId !== currentUser.id && 
                       (comment.authorRole === 'admin' || 
                        EMPLOYEE_CREDENTIALS[comment.authorId]?.role === 'admin');
      
      const commentEl = document.createElement('div');
      commentEl.className = 'card mb-2';
      
      // 管理者からのコメントは強調表示
      if (isAdmin) {
        commentEl.classList.add('border-danger');
      }
      
      commentEl.innerHTML = `
        <div class="card-body py-2 ${isAdmin ? 'bg-light' : ''}">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold ${isAdmin ? 'text-danger' : ''}">${comment.authorName} ${isAdmin ? '(管理者)' : ''}</span>
            <small class="text-muted">${commentDate.toLocaleString('ja-JP')}</small>
          </div>
          <p class="mb-0">${comment.text}</p>
        </div>
      `;
      
      commentsList.appendChild(commentEl);
    });
  } catch (error) {
    console.error('コメントの読み込みエラー:', error);
    showError('コメントの読み込みに失敗しました');
  }
}

// コメント追加
async function handleAddComment(e) {
  e.preventDefault();
  
  const commentText = document.getElementById('newComment').value.trim();
  if (!commentText || !currentReportId) return;
  
  try {
    showLoader();
    
    const commentData = {
      text: commentText,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection('reports').doc(currentReportId)
      .collection('comments').add(commentData);
    
    // コメント対象の日報情報を取得
    const reportDoc = await db.collection('reports').doc(currentReportId).get();
    const reportData = reportDoc.data();
    
    // 自分以外のユーザーの既読状態をリセット
    if (reportData && reportData.authorId !== currentUser.id) {
      // 日報作成者の既読状態をリセット（自分が作成者でない場合）
      await db.collection('reports').doc(currentReportId)
        .collection('readStatus')
        .doc(reportData.authorId)
        .delete();
    }
    
    // 管理者からのコメントの場合、未読としてマーク
    if (isAdmin) {
      // 全ての営業担当者の既読状態をリセット
      for (const empId in EMPLOYEE_CREDENTIALS) {
        if (EMPLOYEE_CREDENTIALS[empId].role === 'sales' && empId !== currentUser.id) {
          await db.collection('reports').doc(currentReportId)
            .collection('readStatus')
            .doc(empId)
            .delete();
        }
      }
    }
    
    document.getElementById('newComment').value = '';
    await loadComments(currentReportId);
    
    // 自分の既読状態を更新
    await updateReadStatus(currentReportId);
    
    hideLoader();
  } catch (error) {
    console.error('コメント追加エラー:', error);
    showError('コメントの追加に失敗しました');
    hideLoader();
  }
}

// コメント関連のイベントリスナーを登録
function initComments() {
  const commentForm = document.getElementById('commentForm');
  commentForm.addEventListener('submit', handleAddComment);
}
