document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveButton').addEventListener('click', saveURL);
    document.getElementById('loadButton').addEventListener('click', loadURLs);
    loadURLs(); // ページロード時にURLリストを読み込む
  });
  
