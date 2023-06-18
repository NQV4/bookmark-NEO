document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('saveButton').addEventListener('click', saveURL);
  document.getElementById('loadButton').addEventListener('click', loadURLs);
  document.getElementById('searchInput').addEventListener('input', searchURLs);

  loadURLs();
});

function saveURL() {
  var urlInput = document.getElementById('urlInput');
  var nameInput = document.getElementById('nameInput');
  var memoInput = document.getElementById('memoInput');

  if (!urlInput || !nameInput || !memoInput) return;

  var url = urlInput.value.trim();
  var name = nameInput.value.trim();
  var memo = memoInput.value.trim();

  if (!url || !name || !memo) return;

  chrome.storage.sync.get('urls', function(result) {
    var urls = result.urls || [];

    if (urls.some(item => item.url === url)) {
      alert('URLは既に保存されています。');
      return;
    }

    urls.push({ url, name, memo });
    chrome.storage.sync.set({ 'urls': urls }, function() {
      urlInput.value = '';
      nameInput.value = '';
      memoInput.value = '';
      loadURLs();
    });
  });
}

function loadURLs() {
  var urlList = document.getElementById('urlList');
  
  if (!urlList) return;

  urlList.innerHTML = '';

  chrome.storage.sync.get('urls', function(result) {
    var urls = result.urls || [];

    urls.forEach(function(item, index) {
      var li = createURLListItem(item, index);
      urlList.appendChild(li);
    });
  });
}

function createURLListItem(item, index) {
  var li = document.createElement('li');
  li.classList.add('url-item');

  var nameSpan = document.createElement('span');
  nameSpan.textContent = '名前: ';
  nameSpan.classList.add('label');

  var nameLink = document.createElement('a');
  nameLink.textContent = item.name;
  nameLink.href = item.url;
  nameLink.target = '_blank';
  nameLink.classList.add('name');

  var urlSpan = document.createElement('span');
  urlSpan.textContent = 'URL: ' + item.url;
  urlSpan.classList.add('url');

  var memoSpan = document.createElement('span');
  memoSpan.textContent = 'メモ: ' + item.memo;
  memoSpan.classList.add('memo');

  var editButton = document.createElement('button');
  editButton.textContent = '編集';
  editButton.dataset.index = index.toString();
  editButton.addEventListener('click', editURL);

  var deleteButton = document.createElement('button');
  deleteButton.textContent = '削除';
  deleteButton.dataset.index = index.toString();
  deleteButton.addEventListener('click', deleteURL);

  li.appendChild(nameSpan);
  li.appendChild(nameLink);
  li.appendChild(document.createElement('br'));
  li.appendChild(urlSpan);
  li.appendChild(document.createElement('br'));
  li.appendChild(memoSpan);
  li.appendChild(document.createElement('br'));
  li.appendChild(editButton);
  li.appendChild(deleteButton);

  return li;
}

function editURL(event) {
  var index = parseInt(event.target.dataset.index, 10);

  if (isNaN(index)) return;

  chrome.storage.sync.get('urls', function(result) {
    var urls = result.urls || [];

    if (index >= 0 && index < urls.length) {
      var item = urls[index];
      var newURL = prompt('新しいURLを入力してください', item.url);
      var newName = prompt('新しい名前を入力してください', item.name);
      var newMemo = prompt('新しいメモを入力してください', item.memo);

      if (newURL && newName && newMemo) {
        item.url = newURL.trim();
        item.name = newName.trim();
        item.memo = newMemo.trim();
        chrome.storage.sync.set({ 'urls': urls }, function() {
          loadURLs();
        });
      }
    }
  });
}

function deleteURL(event) {
  var index = parseInt(event.target.dataset.index, 10);

  if (isNaN(index)) return;

  chrome.storage.sync.get('urls', function(result) {
    var urls = result.urls || [];

    if (index >= 0 && index < urls.length) {
      urls.splice(index, 1);
      chrome.storage.sync.set({ 'urls': urls }, function() {
        loadURLs();
      });
    }
  });
}

function searchURLs() {
  var searchInput = document.getElementById('searchInput');
  var keyword = searchInput.value.trim().toLowerCase();

  chrome.storage.sync.get('urls', function(result) {
    var urls = result.urls || [];
    var searchResults = [];

    urls.forEach(function(item) {
      var url = item.url.toLowerCase();
      var name = item.name.toLowerCase();
      var memo = item.memo.toLowerCase();

      if (url.includes(keyword) || name.includes(keyword) || memo.includes(keyword)) {
        searchResults.push(item);
      }
    });

    displaySearchResults(searchResults);
  });
}

function displaySearchResults(results) {
  var urlList = document.getElementById('urlList');
  
  if (!urlList) return;

  urlList.innerHTML = '';

  results.forEach(function(item, index) {
    var li = createURLListItem(item, index);
    urlList.appendChild(li);
  });
}

