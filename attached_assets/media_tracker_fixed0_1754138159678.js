// ===== COMPLETE MEDIA TRACKER - FIXED & ENHANCED =====
// Make sure to SAVE and REFRESH your spreadsheet after adding this

// ===== MENU SETUP =====
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📺 Media Tracker')
    .addItem('➕ Add New Media', 'showAddMediaDialog')
    .addItem('⚡ Quick Update', 'showQuickUpdateSidebar')
    .addItem('📊 Dashboard', 'createDashboard')
    .addItem('🔍 Search All Media', 'showSearchDialog')
    .addItem('📈 Progress Charts', 'showProgressCharts')
    .addItem('🎲 Random Picker', 'showRandomPicker')
    .addItem('📅 Watch Calendar', 'showWatchCalendar')
    .addItem('⏰ Time Tracker', 'showTimeTracker')
    .addSeparator()
    .addItem('💡 Get Recommendations', 'showRecommendations')
    .addItem('🏆 Achievements', 'showAchievements')
    .addItem('📋 Watchlist Planner', 'showWatchlistPlanner')
    .addItem('🔄 Sync Status', 'showSyncStatus')
    .addSeparator()
    .addItem('📥 Import from CSV', 'importFromCSV')
    .addItem('📤 Export All Data', 'exportAllData')
    .addItem('💾 Backup to Drive', 'performBackup')
    .addItem('🔧 Batch Operations', 'showBatchOperations')
    .addSeparator()
    .addItem('⚙️ Settings', 'showSettings')
    .addItem('🎨 Themes', 'showThemes')
    .addItem('⌨️ Keyboard Shortcuts', 'showShortcuts')
    .addItem('🛠️ Setup Sheets', 'setupMediaTracker')
    .addToUi();
}

// ===== SHEET SETUP FUNCTION =====
function setupMediaTracker() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Define sheet configurations
  var sheetConfigs = {
    'Anime': {
      headers: ['Name/Title', 'Status', 'Progress', 'Season', 'Episode', 'Genre', 'Date Added', 'Notes'],
      statusOptions: ['To Watch', 'In Progress', 'Watched', 'Dropped']
    },
    'Manhwa': {
      headers: ['Name/Title', 'Status', 'Progress', 'Chapters', 'Genre', 'Date Added', 'Notes'],
      statusOptions: ['To Read', 'In Progress', 'Read', 'Dropped']
    },
    'Pornhwa': {
      headers: ['Name/Title', 'Status', 'Progress', 'Chapters', 'Genre', 'Date Added', 'Notes'],
      statusOptions: ['To Read', 'In Progress', 'Read', 'Dropped']
    },
    'Novels': {
      headers: ['Name/Title', 'Status', 'Progress', 'Chapters', 'Genre', 'Date Added', 'Notes'],
      statusOptions: ['To Read', 'In Progress', 'Read', 'Dropped']
    },
    'Movies': {
      headers: ['Name/Title', 'Status', 'Genre', 'Date Added', 'Notes'],
      statusOptions: ['To Watch', 'Watched', 'Dropped']
    },
    'TV Shows': {
      headers: ['Name/Title', 'Status', 'Progress', 'Season', 'Episode', 'Genre', 'Date Added', 'Notes'],
      statusOptions: ['To Watch', 'In Progress', 'Watched', 'Dropped']
    },
    'Archive': {
      headers: ['Media Type', 'Name/Title', 'Status', 'Progress', 'Season/Chapters', 'Episode', 'Genre', 'Date Added', 'Notes'],
      statusOptions: ['Dropped']
    }
  };
  
  var genreOptions = ['Fantasy', 'Sci-Fi', 'Romance', 'Slice of Life', 'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Mystery', 'Thriller'];
  
  // Create and setup each sheet
  Object.keys(sheetConfigs).forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    var config = sheetConfigs[sheetName];
    
    // Set headers
    var headerRange = sheet.getRange(1, 1, 1, config.headers.length);
    headerRange.setValues([config.headers]);
    headerRange.setBackground('#7A1927');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    // Set up data validation
    if (sheetName !== 'Archive') {
      // Status dropdown
      var statusCol = config.headers.indexOf('Status') + 1;
      if (statusCol > 0) {
        var statusRange = sheet.getRange(2, statusCol, 999, 1);
        var statusRule = SpreadsheetApp.newDataValidation()
          .requireValueInList(config.statusOptions)
          .build();
        statusRange.setDataValidation(statusRule);
      }
      
      // Genre dropdown
      var genreCol = config.headers.indexOf('Genre') + 1;
      if (genreCol > 0) {
        var genreRange = sheet.getRange(2, genreCol, 999, 1);
        var genreRule = SpreadsheetApp.newDataValidation()
          .requireValueInList(genreOptions)
          .build();
        genreRange.setDataValidation(genreRule);
      }
    }
    
    // Format the sheet
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, config.headers.length);
  });
  
  SpreadsheetApp.getUi().alert('✅ Media Tracker setup complete! All sheets, formatting, and dropdowns have been created.');
}

// ===== ADD MEDIA FUNCTION =====
function showAddMediaDialog() {
  var html = createAddMediaForm();
  var htmlOutput = HtmlService.createHtmlOutput(html)
      .setWidth(400)
      .setHeight(600);
  SpreadsheetApp.getUi()
      .showModalDialog(htmlOutput, 'Add New Media');
}

function createAddMediaForm() {
  return `
    <style>
      body { 
        font-family: Arial, sans-serif; 
        padding: 20px; 
        background: #1a1a1a; 
        color: white; 
        margin: 0;
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #fff;
      }
      input, select, textarea {
        width: 100%;
        padding: 10px;
        background: #2a2a2a;
        border: 1px solid #7A1927;
        border-radius: 4px;
        color: white;
        font-size: 14px;
        box-sizing: border-box;
      }
      input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #ff6b6b;
        box-shadow: 0 0 5px rgba(255, 107, 107, 0.3);
      }
      button {
        background: #7A1927;
        color: white;
        padding: 12px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        width: 100%;
        margin-top: 10px;
      }
      button:hover {
        background: #8B1E2E;
      }
      .quick-buttons {
        display: flex;
        gap: 5px;
        margin-top: 5px;
      }
      .quick-btn {
        flex: 1;
        padding: 5px;
        font-size: 12px;
        background: #3a3a3a;
        border: 1px solid #7A1927;
      }
      .quick-btn:hover {
        background: #7A1927;
      }
      .success {
        background: #2a4a2a;
        border: 1px solid #4a8a4a;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 15px;
        display: none;
      }
    </style>
    
    <div id="success" class="success">
      <strong>✅ Media added successfully!</strong>
    </div>
    
    <form id="mediaForm">
      <div class="form-group">
        <label for="type">Media Type:</label>
        <select id="type" name="type" onchange="updateFormFields()" required>
          <option value="">Select Type</option>
          <option value="Anime">Anime</option>
          <option value="Manhwa">Manhwa</option>
          <option value="Pornhwa">Pornhwa</option>
          <option value="Novels">Novels</option>
          <option value="Movies">Movies</option>
          <option value="TV Shows">TV Shows</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" name="title" required>
      </div>
      
      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" name="status" required>
          <option value="">Select Status</option>
        </select>
        <div class="quick-buttons">
          <button type="button" class="quick-btn" onclick="setStatus('planned')">To Watch/Read</button>
          <button type="button" class="quick-btn" onclick="setStatus('progress')">In Progress</button>
          <button type="button" class="quick-btn" onclick="setStatus('completed')">Completed</button>
        </div>
      </div>
      
      <div class="form-group" id="progressGroup" style="display: none;">
        <label for="progress">Progress:</label>
        <input type="text" id="progress" name="progress" placeholder="e.g., Ch25 or S1E12">
      </div>
      
      <div class="form-group" id="seasonGroup" style="display: none;">
        <label for="season">Season:</label>
        <input type="number" id="season" name="season" min="1" value="1">
      </div>
      
      <div class="form-group" id="episodeGroup" style="display: none;">
        <label for="episode">Episode/Chapter:</label>
        <input type="number" id="episode" name="episode" min="0" value="0">
      </div>
      
      <div class="form-group">
        <label for="genre">Genre:</label>
        <select id="genre" name="genre">
          <option value="">Select Genre</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Romance">Romance</option>
          <option value="Slice of Life">Slice of Life</option>
          <option value="Action">Action</option>
          <option value="Adventure">Adventure</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
          <option value="Mystery">Mystery</option>
          <option value="Thriller">Thriller</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="notes">Notes (Optional):</label>
        <textarea id="notes" name="notes" rows="3"></textarea>
      </div>
      
      <button type="button" onclick="addMedia()">Add Media</button>
    </form>
    
    <script>
      function updateFormFields() {
        var type = document.getElementById('type').value;
        var statusSelect = document.getElementById('status');
        var progressGroup = document.getElementById('progressGroup');
        var seasonGroup = document.getElementById('seasonGroup');
        var episodeGroup = document.getElementById('episodeGroup');
        
        // Clear existing options
        statusSelect.innerHTML = '<option value="">Select Status</option>';
        
        // Hide all conditional fields
        progressGroup.style.display = 'none';
        seasonGroup.style.display = 'none';
        episodeGroup.style.display = 'none';
        
        if (type === 'Movies') {
          statusSelect.innerHTML += '<option value="To Watch">To Watch</option>';
          statusSelect.innerHTML += '<option value="Watched">Watched</option>';
          statusSelect.innerHTML += '<option value="Dropped">Dropped</option>';
        } else if (type === 'Anime' || type === 'TV Shows') {
          statusSelect.innerHTML += '<option value="To Watch">To Watch</option>';
          statusSelect.innerHTML += '<option value="In Progress">In Progress</option>';
          statusSelect.innerHTML += '<option value="Watched">Watched</option>';
          statusSelect.innerHTML += '<option value="Dropped">Dropped</option>';
          progressGroup.style.display = 'block';
          seasonGroup.style.display = 'block';
          episodeGroup.style.display = 'block';
        } else if (type === 'Manhwa' || type === 'Pornhwa' || type === 'Novels') {
          statusSelect.innerHTML += '<option value="To Read">To Read</option>';
          statusSelect.innerHTML += '<option value="In Progress">In Progress</option>';
          statusSelect.innerHTML += '<option value="Read">Read</option>';
          statusSelect.innerHTML += '<option value="Dropped">Dropped</option>';
          progressGroup.style.display = 'block';
          episodeGroup.style.display = 'block';
          document.querySelector('label[for="episode"]').textContent = 'Chapter:';
        }
      }
      
      function setStatus(type) {
        var statusSelect = document.getElementById('status');
        var mediaType = document.getElementById('type').value;
        
        if (type === 'planned') {
          statusSelect.value = mediaType === 'Movies' ? 'To Watch' : 
                              (mediaType === 'Anime' || mediaType === 'TV Shows' ? 'To Watch' : 'To Read');
        } else if (type === 'progress') {
          statusSelect.value = 'In Progress';
        } else if (type === 'completed') {
          statusSelect.value = mediaType === 'Movies' ? 'Watched' : 
                              (mediaType === 'Anime' || mediaType === 'TV Shows' ? 'Watched' : 'Read');
        }
      }
      
      function addMedia() {
        var form = document.getElementById('mediaForm');
        var formData = new FormData(form);
        
        if (!formData.get('type') || !formData.get('title') || !formData.get('status')) {
          alert('Please fill in all required fields');
          return;
        }
        
        var mediaData = {
          type: formData.get('type'),
          title: formData.get('title'),
          status: formData.get('status'),
          genre: formData.get('genre'),
          notes: formData.get('notes')
        };
        
        // Handle progress formatting
        var season = formData.get('season');
        var episode = formData.get('episode');
        var progress = formData.get('progress');
        
        if (mediaData.type === 'Anime' || mediaData.type === 'TV Shows') {
          if (season && episode) {
            mediaData.progress = 'S' + season + 'E' + episode;
            mediaData.season = season;
            mediaData.episode = episode;
          }
        } else if (mediaData.type === 'Manhwa' || mediaData.type === 'Pornhwa' || mediaData.type === 'Novels') {
          if (episode) {
            mediaData.progress = 'Ch' + episode;
            mediaData.chapter = episode;
          }
        }
        
        google.script.run
          .withSuccessHandler(function(result) {
            document.getElementById('success').style.display = 'block';
            form.reset();
            setTimeout(function() {
              document.getElementById('success').style.display = 'none';
            }, 3000);
          })
          .withFailureHandler(function(error) {
            alert('Error adding media: ' + error.toString());
          })
          .addMedia(mediaData);
      }
    </script>
  `;
}

function addMedia(mediaData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(mediaData.type);
  
  if (!sheet) {
    throw new Error('Sheet not found: ' + mediaData.type + '. Please run Setup Sheets first.');
  }
  
  var row = [];
  var dateAdded = new Date().toLocaleDateString();
  
  // Track time if starting
  if (mediaData.status === 'In Progress') {
    PropertiesService.getUserProperties().setProperty(
      'startTime_' + mediaData.title, 
      new Date().getTime().toString()
    );
  }
  
  switch(mediaData.type) {
    case 'Anime':
    case 'TV Shows':
      row = [
        mediaData.title,
        mediaData.status,
        mediaData.progress || '',
        mediaData.season || '',
        mediaData.episode || '',
        mediaData.genre || '',
        dateAdded,
        mediaData.notes || ''
      ];
      break;
      
    case 'Manhwa':
    case 'Pornhwa':
    case 'Novels':
      row = [
        mediaData.title,
        mediaData.status,
        mediaData.progress || '',
        mediaData.chapter || '',
        mediaData.genre || '',
        dateAdded,
        mediaData.notes || ''
      ];
      break;
      
    case 'Movies':
      row = [
        mediaData.title,
        mediaData.status,
        mediaData.genre || '',
        dateAdded,
        mediaData.notes || ''
      ];
      break;
  }
  
  sheet.appendRow(row);
  
  // Check for achievements
  checkAchievements('add', mediaData);
  
  // Auto-archive if dropped
  if (mediaData.status === 'Dropped') {
    moveToArchive(sheet, sheet.getLastRow());
  }
  
  return true;
}

// ===== QUICK UPDATE SIDEBAR =====
function showQuickUpdateSidebar() {
  var html = createQuickUpdateSidebar();
  var htmlOutput = HtmlService.createHtmlOutput(html)
      .setTitle('Quick Update')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function createQuickUpdateSidebar() {
  return `
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 15px;
        background: #1a1a1a;
        color: white;
        margin: 0;
      }
      .item {
        background: #2a2a2a;
        border: 1px solid #7A1927;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 10px;
      }
      .item-title {
        font-weight: bold;
        margin-bottom: 5px;
        color: #ff6b6b;
      }
      .item-info {
        font-size: 12px;
        color: #ccc;
        margin-bottom: 8px;
      }
      .buttons {
        display: flex;
        gap: 5px;
      }
      .btn {
        flex: 1;
        padding: 6px 8px;
        background: #7A1927;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      }
      .btn:hover {
        background: #8B1E2E;
      }
      .complete-btn {
        background: #2a4a2a;
      }
      .complete-btn:hover {
        background: #3a5a3a;
      }
      .refresh-btn {
        width: 100%;
        margin-bottom: 15px;
        padding: 10px;
        background: #3a3a3a;
      }
      .no-items {
        text-align: center;
        color: #888;
        padding: 20px;
      }
    </style>
    
    <button class="btn refresh-btn" onclick="loadItems()">🔄 Refresh</button>
    <div id="items"></div>
    
    <script>
      function loadItems() {
        google.script.run
          .withSuccessHandler(displayItems)
          .getInProgressItems();
      }
      
      function displayItems(items) {
        var container = document.getElementById('items');
        
        if (items.length === 0) {
          container.innerHTML = '<div class="no-items">No items in progress</div>';
          return;
        }
        
        var html = '';
        items.forEach(function(item) {
          html += '<div class="item">';
          html += '<div class="item-title">' + item.title + '</div>';
          html += '<div class="item-info">' + item.type + ' - ' + item.currentProgress + '</div>';
          html += '<div class="buttons">';
          html += '<button class="btn" onclick="increment(\'' + item.type + '\', \'' + item.title + '\')">+1</button>';
          html += '<button class="btn complete-btn" onclick="markComplete(\'' + item.type + '\', \'' + item.title + '\')">✓</button>';
          html += '</div>';
          html += '</div>';
        });
        
        container.innerHTML = html;
      }
      
      function increment(type, title) {
        google.script.run
          .withSuccessHandler(function(newProgress) {
            if (newProgress) {
              loadItems(); // Refresh the list
            }
          })
          .incrementProgress(type, title);
      }
      
      function markComplete(type, title) {
        google.script.run
          .withSuccessHandler(function() {
            loadItems(); // Refresh the list
          })
          .markItemComplete(type, title);
      }
      
      // Load items on page load
      loadItems();
    </script>
  `;
}

function getInProgressItems() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'TV Shows'];
  var items = [];
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === 'In Progress' && data[i][0]) {
        items.push({
          type: sheetName,
          title: data[i][0],
          currentProgress: data[i][2] || 'No progress',
          row: i + 1
        });
      }
    }
  });
  
  return items;
}

function incrementProgress(type, title) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(type);
  if (!sheet) return null;
  
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === title) {
      var currentProgress = data[i][2] || '';
      var newProgress = '';
      
      if (type === 'Anime' || type === 'TV Shows') {
        var match = currentProgress.match(/S(\d+)E(\d+)/);
        if (match) {
          var season = parseInt(match[1]);
          var episode = parseInt(match[2]) + 1;
          newProgress = 'S' + season + 'E' + episode;
          sheet.getRange(i + 1, 3).setValue(newProgress);
          sheet.getRange(i + 1, 5).setValue(episode);
        } else {
          // Default to S1E1 if no progress set
          newProgress = 'S1E1';
          sheet.getRange(i + 1, 3).setValue(newProgress);
          sheet.getRange(i + 1, 4).setValue(1);
          sheet.getRange(i + 1, 5).setValue(1);
        }
      } else {
        var match = currentProgress.match(/Ch(\d+)/);
        if (match) {
          var chapter = parseInt(match[1]) + 1;
          newProgress = 'Ch' + chapter;
          sheet.getRange(i + 1, 3).setValue(newProgress);
          sheet.getRange(i + 1, 4).setValue(chapter);
        } else {
          // Default to Ch1 if no progress set
          newProgress = 'Ch1';
          sheet.getRange(i + 1, 3).setValue(newProgress);
          sheet.getRange(i + 1, 4).setValue(1);
        }
      }
      
      // Track progress for achievements
      checkAchievements('progress', {type: type, title: title});
      
      return newProgress;
    }
  }
  return null;
}

function markItemComplete(type, title) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(type);
  if (!sheet) return false;
  
  var data = sheet.getDataRange().getValues();
  var completedStatus = (type === 'Anime' || type === 'Movies' || type === 'TV Shows') ? 'Watched' : 'Read';
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === title && data[i][1] === 'In Progress') {
      sheet.getRange(i + 1, 2).setValue(completedStatus);
      
      // Track completion for achievements
      checkAchievements('complete', {type: type, title: title});
      
      return true;
    }
  }
  return false;
}

// ===== DASHBOARD & ANALYTICS =====
function createDashboard() {
  var stats = getDetailedStats();
  var html = createDashboardHTML(stats);
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(600)
    .setHeight(800);
    
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Media Dashboard');
}

function createDashboardHTML(stats) {
  var totalCompleted = (stats.byStatus['Watched'] || 0) + (stats.byStatus['Read'] || 0);
  var completionRate = stats.total > 0 ? Math.round((totalCompleted / stats.total) * 100) : 0;
  
  return `
    <style>
      body { 
        font-family: Arial, sans-serif; 
        padding: 20px; 
        background: #1a1a1a; 
        color: white; 
        margin: 0;
      }
      .stat-card {
        background: #2a2a2a;
        padding: 15px;
        margin: 10px 0;
        border-radius: 8px;
        border-left: 3px solid #7A1927;
      }
      .big-number {
        font-size: 36px;
        color: #ff6b6b;
        font-weight: bold;
      }
      .progress-bar {
        background: #3a3a3a;
        height: 20px;
        border-radius: 10px;
        overflow: hidden;
        margin: 10px 0;
      }
      .progress-fill {
        background: #7A1927;
        height: 100%;
        transition: width 0.3s;
      }
      .genre-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
      }
      .type-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .mini-card {
        background: #3a3a3a;
        padding: 10px;
        border-radius: 4px;
        text-align: center;
      }
    </style>
    
    <h1>📊 Your Media Dashboard</h1>
    
    <div class="stat-card">
      <div class="big-number">${stats.total}</div>
      <div>Total Items Tracked</div>
    </div>
    
    <div class="stat-card">
      <div class="big-number">${completionRate}%</div>
      <div>Completion Rate</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${completionRate}%"></div>
      </div>
      <div>Completed: ${totalCompleted} / ${stats.total}</div>
    </div>
    
    <div class="stat-card">
      <h3>Status Breakdown</h3>
      ${Object.keys(stats.byStatus).map(status => 
        `<div class="genre-item">
          <span>${status}:</span>
          <strong>${stats.byStatus[status]}</strong>
        </div>`
      ).join('')}
    </div>
    
    <div class="stat-card">
      <h3>By Media Type</h3>
      <div class="type-stats">
        ${Object.keys(stats.byType).map(type => 
          `<div class="mini-card">
            <div><strong>${type}</strong></div>
            <div>${stats.byType[type].total} items</div>
            <div style="font-size: 12px; color: #ccc;">
              ${stats.byType[type].completed} completed
            </div>
          </div>`
        ).join('')}
      </div>
    </div>
    
    <div class="stat-card">
      <h3>Top Genres</h3>
      ${stats.topGenres.slice(0, 5).map(genre => 
        `<div class="genre-item">
          <span>${genre.name}:</span>
          <strong>${genre.count} items</strong>
        </div>`
      ).join('')}
    </div>
    
    <div class="stat-card">
      <h3>Currently In Progress</h3>
      <div>${stats.inProgressCount} items currently being watched/read</div>
    </div>
  `;
}

function getDetailedStats() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows'];
  var stats = {
    total: 0,
    byStatus: {},
    byType: {},
    byGenre: {},
    topGenres: [],
    inProgressCount: 0,
    recentlyAdded: []
  };
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    
    stats.byType[sheetName] = {
      total: 0,
      completed: 0,
      inProgress: 0,
      planned: 0,
      dropped: 0
    };
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) { // Has title
        stats.total++;
        stats.byType[sheetName].total++;
        
        // Status tracking
        var status = data[i][1];
        if (status) {
          stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
          
          if (status === 'Watched' || status === 'Read') {
            stats.byType[sheetName].completed++;
          } else if (status === 'In Progress') {
            stats.byType[sheetName].inProgress++;
            stats.inProgressCount++;
          } else if (status === 'To Watch' || status === 'To Read') {
            stats.byType[sheetName].planned++;
          } else if (status === 'Dropped') {
            stats.byType[sheetName].dropped++;
          }
        }
        
        // Genre tracking
        var genreCol = (sheetName === 'Movies') ? 2 : 
                       (sheetName === 'Anime' || sheetName === 'TV Shows') ? 5 : 4;
        var genre = data[i][genreCol];
        if (genre) {
          stats.byGenre[genre] = (stats.byGenre[genre] || 0) + 1;
        }
        
        // Recent items
        var dateCol = (sheetName === 'Movies') ? 3 : 
                      (sheetName === 'Anime' || sheetName === 'TV Shows') ? 6 : 5;
        var dateAdded = data[i][dateCol];
        if (dateAdded) {
          stats.recentlyAdded.push({
            title: data[i][0],
            type: sheetName,
            date: dateAdded
          });
        }
      }
    }
  });
  
  // Convert genres to sorted array
  stats.topGenres = Object.keys(stats.byGenre)
    .map(genre => ({name: genre, count: stats.byGenre[genre]}))
    .sort((a, b) => b.count - a.count);
  
  // Sort recent items
  stats.recentlyAdded.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  
  return stats;
}

// ===== RANDOM PICKER =====
function showRandomPicker() {
  var html = createRandomPickerHTML();
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(450)
    .setHeight(500);
    
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Random Picker');
}

function createRandomPickerHTML() {
  return `
    <style>
      body { font-family: Arial; padding: 20px; background: #1a1a1a; color: white; }
      button { background: #7A1927; color: white; padding: 10px 20px; border: none; 
               border-radius: 4px; cursor: pointer; margin: 5px; }
      button:hover { background: #8B1E2E; }
      .result { background: #2a2a2a; padding: 20px; margin: 20px 0; border-radius: 8px; 
                text-align: center; font-size: 18px; min-height: 100px; 
                display: flex; flex-direction: column; justify-content: center; }
      select { padding: 8px; margin: 10px; background: #2a2a2a; color: white; 
               border: 1px solid #7A1927; border-radius: 4px; }
      .filters { margin-bottom: 20px; }
      .big-button { font-size: 18px; padding: 15px 30px; }
    </style>
    
    <h2>🎲 What Should I Watch/Read?</h2>
    
    <div class="filters">
      <div>
        <label>Media Type:</label>
        <select id="filterType">
          <option value="all">All Types</option>
          <option value="Anime">Anime Only</option>
          <option value="Manhwa">Manhwa Only</option>
          <option value="Pornhwa">Pornhwa Only</option>
          <option value="Novels">Novels Only</option>
          <option value="Movies">Movies Only</option>
          <option value="TV Shows">TV Shows Only</option>
        </select>
      </div>
      
      <div>
        <label>Status Filter:</label>
        <select id="filterStatus">
          <option value="planned">Not Started (To Watch/Read)</option>
          <option value="inprogress">In Progress</option>
          <option value="all">All Status</option>
        </select>
      </div>
    </div>
    
    <button class="big-button" onclick="pickRandom()">🎲 Pick Random!</button>
    
    <div id="result" class="result">Click to get a suggestion!</div>
    
    <script>
      function pickRandom() {
        var type = document.getElementById('filterType').value;
        var status = document.getElementById('filterStatus').value;
        
        document.getElementById('result').innerHTML = '🎲 Picking something for you...';
        
        google.script.run
          .withSuccessHandler(function(item) {
            if (item) {
              document.getElementById('result').innerHTML = 
                '<div style="margin-bottom: 10px;"><strong>' + item.type + '</strong></div>' +
                '<h3 style="color: #ff6b6b; margin: 10px 0;">' + item.title + '</h3>' +
                '<div>Status: ' + item.status + '</div>' +
                (item.progress ? '<div>Progress: ' + item.progress + '</div>' : '') +
                (item.genre ? '<div>Genre: ' + item.genre + '</div>' : '');
            } else {
              document.getElementById('result').innerHTML = 
                '<div style="color: #888;">No items found with those filters!</div>' +
                '<div style="font-size: 14px; margin-top: 10px;">Try changing your filters or add more media.</div>';
            }
          })
          .withFailureHandler(function(error) {
            document.getElementById('result').innerHTML = 
              '<div style="color: #ff6b6b;">Error: ' + error.toString() + '</div>';
          })
          .getRandomItem(type, status);
      }
    </script>
  `;
}

function getRandomItem(filterType, filterStatus) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = filterType === 'all' ? 
    ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows'] : 
    [filterType];
  
  var candidates = [];
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) { // Has title
        var status = data[i][1];
        var include = false;
        
        if (filterStatus === 'all') {
          include = true;
        } else if (filterStatus === 'planned') {
          include = (status === 'To Watch' || status === 'To Read');
        } else if (filterStatus === 'inprogress') {
          include = (status === 'In Progress');
        }
        
        if (include) {
          var genreCol = (sheetName === 'Movies') ? 2 : 
                         (sheetName === 'Anime' || sheetName === 'TV Shows') ? 5 : 4;
          
          candidates.push({
            type: sheetName,
            title: data[i][0],
            status: status,
            progress: data[i][2] || '',
            genre: data[i][genreCol] || ''
          });
        }
      }
    }
  });
  
  if (candidates.length === 0) return null;
  
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ===== ACHIEVEMENTS SYSTEM =====
function checkAchievements(action, data) {
  var achievements = PropertiesService.getUserProperties();
  var stats = getDetailedStats();
  
  var newAchievements = [];
  
  // Check various achievements
  if (stats.total >= 100 && !achievements.getProperty('ach_collector')) {
    achievements.setProperty('ach_collector', 'true');
    newAchievements.push('📚 Collector - Added 100 items!');
  }
  
  var totalCompleted = (stats.byStatus['Watched'] || 0) + (stats.byStatus['Read'] || 0);
  if (totalCompleted >= 50 && !achievements.getProperty('ach_dedicated')) {
    achievements.setProperty('ach_dedicated', 'true');
    newAchievements.push('🏆 Dedicated - Completed 50 items!');
  }
  
  if (stats.inProgressCount >= 20 && !achievements.getProperty('ach_juggler')) {
    achievements.setProperty('ach_juggler', 'true');
    newAchievements.push('🤹 Juggler - 20 items in progress at once!');
  }
  
  // First item achievement
  if (stats.total === 1 && !achievements.getProperty('ach_first')) {
    achievements.setProperty('ach_first', 'true');
    newAchievements.push('🌟 First Steps - Added your first item!');
  }
  
  // Show new achievements
  if (newAchievements.length > 0) {
    SpreadsheetApp.getUi().alert(
      '🎉 New Achievement!', 
      newAchievements.join('\n'), 
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

function showAchievements() {
  var achievements = PropertiesService.getUserProperties();
  var allAchievements = [
    {id: 'ach_first', name: '🌟 First Steps', desc: 'Add your first item'},
    {id: 'ach_collector', name: '📚 Collector', desc: 'Add 100 items'},
    {id: 'ach_dedicated', name: '🏆 Dedicated', desc: 'Complete 50 items'},
    {id: 'ach_juggler', name: '🤹 Juggler', desc: '20 items in progress'},
    {id: 'ach_binger', name: '📺 Binger', desc: 'Update 10 items in one day'},
    {id: 'ach_explorer', name: '🗺️ Explorer', desc: 'Try all media types'},
    {id: 'ach_completionist', name: '✅ Completionist', desc: '90% completion rate'},
    {id: 'ach_speed_reader', name: '⚡ Speed Reader', desc: 'Read 100 chapters in a week'},
    {id: 'ach_loyal', name: '💗 Loyal', desc: 'Use tracker for 30 days'},
    {id: 'ach_organized', name: '📋 Organized', desc: 'Use all features'}
  ];
  
  var html = '<div style="font-family: Arial; background: #1a1a1a; color: white; padding: 20px;">';
  html += '<h2>🏆 Your Achievements</h2>';
  var earned = 0;
  
  allAchievements.forEach(function(ach) {
    var hasAch = achievements.getProperty(ach.id) === 'true';
    if (hasAch) earned++;
    
    html += '<div style="padding: 10px; background: ' + (hasAch ? '#2a2a2a' : '#1a1a1a') + 
            '; margin: 5px 0; border-radius: 4px; opacity: ' + (hasAch ? '1' : '0.5') + 
            '; border: 1px solid ' + (hasAch ? '#7A1927' : '#333') + ';">';
    html += '<strong>' + ach.name + '</strong> - ' + ach.desc;
    html += hasAch ? ' ✅' : ' 🔒';
    html += '</div>';
  });
  
  html = '<div style="text-align: center; margin-bottom: 20px; font-size: 18px;">Progress: ' + earned + '/' + 
         allAchievements.length + '</div>' + html;
  html += '</div>';
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(400)
    .setHeight(500);
    
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Achievements');
}

// ===== BATCH OPERATIONS =====
function showBatchOperations() {
  var html = createBatchOperationsHTML();
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(500)
    .setHeight(600);
    
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Batch Operations');
}

function createBatchOperationsHTML() {
  return `
    <style>
      body { font-family: Arial; padding: 20px; background: #1a1a1a; color: white; }
      .operation { background: #2a2a2a; padding: 15px; margin: 10px 0; border-radius: 8px; }
      button { background: #7A1927; color: white; padding: 8px 16px; border: none; 
               border-radius: 4px; cursor: pointer; margin: 5px; }
      button:hover { background: #8B1E2E; }
      select, input { padding: 8px; margin: 5px; background: #2a2a2a; color: white; 
                      border: 1px solid #7A1927; border-radius: 4px; }
      .result { margin-top: 20px; padding: 10px; background: #2a2a2a; border-radius: 4px; display: none; }
    </style>
    
    <h2>🔧 Batch Operations</h2>
    
    <div class="operation">
      <h3>Mark Multiple as Watched/Read</h3>
      <select id="batchType">
        <option value="Anime">Anime</option>
        <option value="Manhwa">Manhwa</option>
        <option value="Pornhwa">Pornhwa</option>
        <option value="Novels">Novels</option>
        <option value="Movies">Movies</option>
        <option value="TV Shows">TV Shows</option>
      </select>
      <button onclick="markAllComplete()">Mark All In Progress as Complete</button>
    </div>
    
    <div class="operation">
      <h3>Bulk Genre Update</h3>
      <input type="text" id="genreSearch" placeholder="Search title contains...">
      <input type="text" id="newGenre" placeholder="New genre">
      <button onclick="bulkGenreUpdate()">Update Genres</button>
    </div>
    
    <div class="operation">
      <h3>Clean Up</h3>
      <button onclick="removeDuplicates()">Remove Duplicates</button>
      <button onclick="cleanEmptyRows()">Clean Empty Rows</button>
      <button onclick="standardizeProgress()">Fix Progress Format</button>
    </div>
    
    <div id="result" class="result"></div>
    
    <script>
      function showResult(message) {
        var result = document.getElementById('result');
        result.style.display = 'block';
        result.innerHTML = message;
      }
      
      function markAllComplete() {
        var type = document.getElementById('batchType').value;
        google.script.run
          .withSuccessHandler(function(count) {
            showResult('✅ Marked ' + count + ' items as complete!');
          })
          .batchMarkComplete(type);
      }
      
      function bulkGenreUpdate() {
        var search = document.getElementById('genreSearch').value;
        var genre = document.getElementById('newGenre').value;
        if (!search || !genre) {
          showResult('❌ Please fill both fields');
          return;
        }
        google.script.run
          .withSuccessHandler(function(count) {
            showResult('✅ Updated genre for ' + count + ' items!');
          })
          .batchUpdateGenre(search, genre);
      }
      
      function removeDuplicates() {
        google.script.run
          .withSuccessHandler(function(count) {
            showResult('✅ Removed ' + count + ' duplicates!');
          })
          .removeDuplicateEntries();
      }
      
      function cleanEmptyRows() {
        google.script.run
          .withSuccessHandler(function(count) {
            showResult('✅ Cleaned ' + count + ' empty rows!');
          })
          .cleanupEmptyRows();
      }
      
      function standardizeProgress() {
        google.script.run
          .withSuccessHandler(function(count) {
            showResult('✅ Fixed progress format for ' + count + ' items!');
          })
          .standardizeProgressFormat();
      }
    </script>
  `;
}

function batchMarkComplete(type) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(type);
  if (!sheet) return 0;
  
  var data = sheet.getDataRange().getValues();
  var count = 0;
  
  var status = (type === 'Anime' || type === 'Movies' || type === 'TV Shows') ? 'Watched' : 'Read';
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === 'In Progress') {
      sheet.getRange(i + 1, 2).setValue(status);
      count++;
    }
  }
  
  return count;
}

function batchUpdateGenre(searchTerm, newGenre) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows'];
  var count = 0;
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    var genreCol = (sheetName === 'Movies') ? 2 : 
                   (sheetName === 'Anime' || sheetName === 'TV Shows') ? 5 : 4;
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toLowerCase().includes(searchTerm.toLowerCase())) {
        sheet.getRange(i + 1, genreCol + 1).setValue(newGenre);
        count++;
      }
    }
  });
  
  return count;
}

function removeDuplicateEntries() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows'];
  var totalRemoved = 0;
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    var seen = {};
    var toDelete = [];
    
    for (var i = 1; i < data.length; i++) {
      var title = data[i][0];
      if (title) {
        if (seen[title.toLowerCase()]) {
          toDelete.push(i + 1);
        } else {
          seen[title.toLowerCase()] = true;
        }
      }
    }
    
    // Delete rows in reverse order
    for (var j = toDelete.length - 1; j >= 0; j--) {
      sheet.deleteRow(toDelete[j]);
      totalRemoved++;
    }
  });
  
  return totalRemoved;
}

function cleanupEmptyRows() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows'];
  var totalCleaned = 0;
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    var toDelete = [];
    
    for (var i = 1; i < data.length; i++) {
      if (!data[i][0] || data[i][0].toString().trim() === '') {
        toDelete.push(i + 1);
      }
    }
    
    // Delete rows in reverse order
    for (var j = toDelete.length - 1; j >= 0; j--) {
      sheet.deleteRow(toDelete[j]);
      totalCleaned++;
    }
  });
  
  return totalCleaned;
}

function standardizeProgressFormat() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'TV Shows'];
  var totalFixed = 0;
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      var progress = data[i][2];
      if (progress && typeof progress === 'number') {
        var newProgress = '';
        
        if (sheetName === 'Anime' || sheetName === 'TV Shows') {
          newProgress = 'S1E' + progress;
        } else {
          newProgress = 'Ch' + progress;
        }
        
        sheet.getRange(i + 1, 3).setValue(newProgress);
        totalFixed++;
      }
    }
  });
  
  return totalFixed;
}

// ===== EXPORT/IMPORT =====
function exportAllData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows', 'Archive'];
  var allData = {};
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      allData[sheetName] = sheet.getDataRange().getValues();
    }
  });
  
  var json = JSON.stringify(allData, null, 2);
  var blob = Utilities.newBlob(json, 'application/json', 
    'MediaTracker_Export_' + new Date().toISOString().split('T')[0] + '.json');
  
  var file = DriveApp.createFile(blob);
  
  SpreadsheetApp.getUi().alert(
    'Export Complete', 
    'File saved to Drive:\n' + file.getUrl(), 
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function performBackup() {
  try {
    var url = exportAllData();
    SpreadsheetApp.getUi().alert(
      'Backup Created', 
      'Your backup has been saved to Google Drive. Check your Drive for the exported file.', 
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    SpreadsheetApp.getUi().alert(
      'Backup Failed', 
      'Error creating backup: ' + error.toString(), 
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

// ===== SEARCH FUNCTIONALITY =====
function showSearchDialog() {
  var html = createSearchHTML();
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(500)
    .setHeight(600);
    
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Search All Media');
}

function createSearchHTML() {
  return `
    <style>
      body { font-family: Arial; padding: 20px; background: #1a1a1a; color: white; }
      input { width: 100%; padding: 10px; margin: 10px 0; background: #2a2a2a; 
              color: white; border: 1px solid #7A1927; border-radius: 4px; }
      .result { background: #2a2a2a; padding: 10px; margin: 5px 0; 
                border-radius: 4px; cursor: pointer; border-left: 3px solid #7A1927; }
      .result:hover { background: #3a3a3a; }
      .result-title { font-weight: bold; color: #ff6b6b; }
      .result-info { font-size: 12px; color: #ccc; margin-top: 5px; }
      .no-results { text-align: center; color: #888; padding: 20px; }
    </style>
    
    <h2>🔍 Search All Media</h2>
    <input type="text" id="searchQuery" placeholder="Search titles..." onkeyup="search()" autofocus>
    <div id="results"></div>
    
    <script>
      function search() {
        var query = document.getElementById('searchQuery').value;
        if (query.length < 2) {
          document.getElementById('results').innerHTML = '';
          return;
        }
        
        google.script.run
          .withSuccessHandler(function(results) {
            var html = '';
            if (results.length === 0) {
              html = '<div class="no-results">No results found for "' + query + '"</div>';
            } else {
              results.forEach(function(item) {
                html += '<div class="result">';
                html += '<div class="result-title">' + item.title + '</div>';
                html += '<div class="result-info">';
                html += item.type + ' • ' + item.status;
                if (item.progress) html += ' • ' + item.progress;
                if (item.genre) html += ' • ' + item.genre;
                html += '</div>';
                html += '</div>';
              });
            }
            document.getElementById('results').innerHTML = html;
          })
          .searchAllMedia(query);
      }
    </script>
  `;
}

function searchAllMedia(query) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows'];
  var results = [];
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      var title = data[i][0];
      if (title && title.toLowerCase().includes(query.toLowerCase())) {
        var genreCol = (sheetName === 'Movies') ? 2 : 
                       (sheetName === 'Anime' || sheetName === 'TV Shows') ? 5 : 4;
        
        results.push({
          title: title,
          type: sheetName,
          status: data[i][1] || '',
          progress: data[i][2] || '',
          genre: data[i][genreCol] || ''
        });
      }
    }
  });
  
  return results.slice(0, 20); // Limit to 20 results
}

// ===== PLACEHOLDER FUNCTIONS (for menu completeness) =====
function showProgressCharts() {
  var html = '<div style="font-family: Arial; background: #1a1a1a; color: white; padding: 20px; text-align: center;">';
  html += '<h2>📈 Progress Charts</h2>';
  html += '<p>This feature is coming soon!</p>';
  html += '<p>Will include visual charts of your progress over time.</p>';
  html += '</div>';
  
  var htmlOutput = HtmlService.createHtmlOutput(html).setWidth(400).setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Progress Charts');
}

function showWatchCalendar() {
  var html = '<div style="font-family: Arial; background: #1a1a1a; color: white; padding: 20px; text-align: center;">';
  html += '<h2>📅 Watch Calendar</h2>';
  html += '<p>This feature is coming soon!</p>';
  html += '<p>Will show your watching schedule and release dates.</p>';
  html += '</div>';
  
  var htmlOutput = HtmlService.createHtmlOutput(html).setWidth(400).setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Watch Calendar');
}

function showTimeTracker() {
  var timeData = getEstimatedTimeData();
  
  var html = '<div style="font-family: Arial; background: #1a1a1a; color: white; padding: 20px;">';
  html += '<h2>⏰ Time Tracking</h2>';
  
  Object.keys(timeData).forEach(function(type) {
    if (timeData[type].total > 0) {
      var hours = Math.floor(timeData[type].total / 60);
      var minutes = timeData[type].total % 60;
      
      html += '<div style="background: #2a2a2a; padding: 15px; margin: 10px 0; border-radius: 8px;">';
      html += '<h3>' + type + '</h3>';
      html += '<div>Estimated Total Time: ' + hours + 'h ' + minutes + 'm</div>';
      html += '<div>Completed Items: ' + timeData[type].count + '</div>';
      if (timeData[type].count > 0) {
        html += '<div>Average: ' + Math.round(timeData[type].total / timeData[type].count) + ' minutes per item</div>';
      }
      html += '</div>';
    }
  });
  
  html += '<div style="margin-top: 20px; font-size: 12px; color: #888;">';
  html += '<p>* Time estimates based on typical durations:</p>';
  html += '<p>Anime: 24min/episode • Movies: 120min • TV Shows: 45min/episode • Manhwa: 3min/chapter</p>';
  html += '</div>';
  html += '</div>';
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(450)
    .setHeight(500);
    
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Time Tracker');
}

function getEstimatedTimeData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Movies', 'TV Shows'];
  var timeData = {};
  
  sheets.forEach(function(sheetName) {
    timeData[sheetName] = {
      total: 0,
      count: 0
    };
    
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === 'Watched' || data[i][1] === 'Read') {
        timeData[sheetName].count++;
        
        // Estimate time based on type and progress
        if (sheetName === 'Anime') {
          var episodes = data[i][4] || 12; // Default 12 episodes
          timeData[sheetName].total += 24 * episodes; // 24 min per episode
        } else if (s
  