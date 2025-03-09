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
      
      const commentEl = document.createElement('div');
      commentEl.className = 'card mb-2';
      commentEl.innerHTML = `
        <div class="card-body py-2">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold">${comment.authorName}</span>
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
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection('reports').doc(currentReportId)
      .collection('comments').add(commentData);
    
    document.getElementById('newComment').value = '';
    loadComments(currentReportId);
    
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
