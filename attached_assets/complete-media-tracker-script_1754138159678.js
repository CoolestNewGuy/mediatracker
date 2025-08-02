// Complete Media Tracker Script - All Features
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
    .addToUi();
}

// ===== CORE FUNCTIONS =====
function showAddMediaDialog() {
  var html = HtmlService.createHtmlOutputFromFile('AddMediaForm')
      .setWidth(400)
      .setHeight(600);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'Add New Media');
}

function addMedia(mediaData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(mediaData.type);
  
  if (!sheet) {
    throw new Error('Sheet not found: ' + mediaData.type);
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
        mediaData.season && mediaData.episode ? `S${mediaData.season}E${mediaData.episode}` : '',
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
        mediaData.chapter ? `Ch${mediaData.chapter}` : '',
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
  var html = HtmlService.createHtmlOutputFromFile('QuickUpdateSidebar')
      .setTitle('Quick Update')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function getInProgressItems() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'TV Shows'];
  var items = [];
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === 'In Progress' && data[i][0]) {
        items.push({
          type: sheetName,
          title: data[i][0],
          currentProgress: data[i][2],
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
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === title) {
      var currentProgress = data[i][2];
      var newProgress = '';
      
      if (type === 'Anime' || type === 'TV Shows') {
        var match = currentProgress.match(/S(\d+)E(\d+)/);
        if (match) {
          var season = parseInt(match[1]);
          var episode = parseInt(match[2]) + 1;
          newProgress = `S${season}E${episode}`;
          sheet.getRange(i + 1, 3).setValue(newProgress);
          sheet.getRange(i + 1, 5).setValue(episode);
        }
      } else {
        var match = currentProgress.match(/Ch(\d+)/);
        if (match) {
          var chapter = parseInt(match[1]) + 1;
          newProgress = `Ch${chapter}`;
          sheet.getRange(i + 1, 3).setValue(newProgress);
          sheet.getRange(i + 1, 4).setValue(chapter);
        }
      }
      
      // Track progress for achievements
      checkAchievements('progress', {type: type, title: title});
      
      return newProgress;
    }
  }
}

// ===== DASHBOARD & ANALYTICS =====
function createDashboard() {
  var analysis = analyzeUserPreferences();
  var stats = getDetailedStats();
  var streak = getWatchStreak();
  
  var html = HtmlService.createHtmlOutputFromFile('Dashboard')
    .setWidth(600)
    .setHeight(800);
    
  SpreadsheetApp.getUi().showModalDialog(html, 'Media Dashboard');
}

function getDetailedStats() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows'];
  var stats = {
    total: 0,
    byStatus: {},
    byType: {},
    byGenre: {},
    recentlyAdded: [],
    recentlyUpdated: [],
    completionTimes: [],
    monthlyProgress: {}
  };
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    var data = sheet.getDataRange().getValues();
    
    stats.byType[sheetName] = {
      total: 0,
      completed: 0,
      inProgress: 0,
      planned: 0,
      dropped: 0
    };
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) {
        stats.total++;
        stats.byType[sheetName].total++;
        
        // Status tracking
        var status = data[i][1];
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
        
        if (status === 'Watched' || status === 'Read') {
          stats.byType[sheetName].completed++;
        } else if (status === 'In Progress') {
          stats.byType[sheetName].inProgress++;
        } else if (status === 'To Watch' || status === 'To Read') {
          stats.byType[sheetName].planned++;
        } else if (status === 'Dropped') {
          stats.byType[sheetName].dropped++;
        }
        
        // Genre tracking
        var genre = data[i][5] || data[i][2];
        if (genre) {
          stats.byGenre[genre] = (stats.byGenre[genre] || 0) + 1;
        }
        
        // Recent items
        var dateAdded = data[i][6] || data[i][3];
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
  
  // Sort recent items
  stats.recentlyAdded.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  
  return stats;
}

// ===== RANDOM PICKER =====
function showRandomPicker() {
  var html = `
    <style>
      body { font-family: Arial; padding: 20px; background: #1a1a1a; color: white; }
      button { background: #7A1927; color: white; padding: 10px 20px; border: none; 
               border-radius: 4px; cursor: pointer; margin: 5px; }
      .result { background: #2a2a2a; padding: 20px; margin: 20px 0; border-radius: 8px; 
                text-align: center; font-size: 18px; }
      select { padding: 8px; margin: 10px; background: #2a2a2a; color: white; border: 1px solid #7A1927; }
    </style>
    
    <h2>🎲 What Should I Watch/Read?</h2>
    
    <select id="filterType">
      <option value="all">All Types</option>
      <option value="Anime">Anime Only</option>
      <option value="Manhwa">Manhwa Only</option>
      <option value="Novels">Novels Only</option>
      <option value="Movies">Movies Only</option>
      <option value="TV Shows">TV Shows Only</option>
    </select>
    
    <select id="filterStatus">
      <option value="planned">Not Started</option>
      <option value="inprogress">In Progress</option>
      <option value="all">All</option>
    </select>
    
    <button onclick="pickRandom()">🎲 Pick Random!</button>
    
    <div id="result" class="result">Click to get a suggestion!</div>
    
    <script>
      function pickRandom() {
        var type = document.getElementById('filterType').value;
        var status = document.getElementById('filterStatus').value;
        
        google.script.run
          .withSuccessHandler(function(item) {
            if (item) {
              document.getElementById('result').innerHTML = 
                '<strong>' + item.type + '</strong><br>' +
                '<h3>' + item.title + '</h3>' +
                'Status: ' + item.status + '<br>' +
                (item.genre ? 'Genre: ' + item.genre : '');
            } else {
              document.getElementById('result').innerHTML = 'No items found with those filters!';
            }
          })
          .getRandomItem(type, status);
      }
    </script>
  `;
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(400)
    .setHeight(400);
    
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Random Picker');
}

function getRandomItem(filterType, filterStatus) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = filterType === 'all' ? 
    ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows'] : 
    [filterType];
  
  var candidates = [];
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) {
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
          candidates.push({
            type: sheetName,
            title: data[i][0],
            status: status,
            genre: data[i][5] || data[i][2] || ''
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
  
  if (stats.byStatus['Watched'] + stats.byStatus['Read'] >= 50 && !achievements.getProperty('ach_dedicated')) {
    achievements.setProperty('ach_dedicated', 'true');
    newAchievements.push('🏆 Dedicated - Completed 50 items!');
  }
  
  var inProgressCount = stats.byStatus['In Progress'] || 0;
  if (inProgressCount >= 20 && !achievements.getProperty('ach_juggler')) {
    achievements.setProperty('ach_juggler', 'true');
    newAchievements.push('🤹 Juggler - 20 items in progress at once!');
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
    {id: 'ach_collector', name: '📚 Collector', desc: 'Add 100 items'},
    {id: 'ach_dedicated', name: '🏆 Dedicated', desc: 'Complete 50 items'},
    {id: 'ach_juggler', name: '🤹 Juggler', desc: '20 items in progress'},
    {id: 'ach_binger', name: '📺 Binger', desc: 'Update 10 items in one day'},
    {id: 'ach_explorer', name: '🗺️ Explorer', desc: 'Try all media types'},
    {id: 'ach_completionist', name: '✅ Completionist', desc: '90% completion rate'},
    {id: 'ach_speed_reader', name: '⚡ Speed Reader', desc: 'Read 100 chapters in a week'},
    {id: 'ach_loyal', name: '💗 Loyal', desc: 'Use tracker for 30 days'},
    {id: 'ach_organized', name: '📋 Organized', desc: 'Use all features'},
    {id: 'ach_social', name: '🌟 Social', desc: 'Share recommendations'}
  ];
  
  var html = '<h2>🏆 Your Achievements</h2>';
  var earned = 0;
  
  allAchievements.forEach(function(ach) {
    var hasAch = achievements.getProperty(ach.id) === 'true';
    if (hasAch) earned++;
    
    html += '<div style="padding: 10px; background: ' + (hasAch ? '#2a2a2a' : '#1a1a1a') + 
            '; margin: 5px 0; border-radius: 4px; opacity: ' + (hasAch ? '1' : '0.5') + ';">';
    html += '<strong>' + ach.name + '</strong> - ' + ach.desc;
    html += hasAch ? ' ✅' : ' 🔒';
    html += '</div>';
  });
  
  html = '<div style="text-align: center; margin-bottom: 20px;">Progress: ' + earned + '/' + 
         allAchievements.length + '</div>' + html;
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(400)
    .setHeight(500);
    
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Achievements');
}

// ===== BATCH OPERATIONS =====
function showBatchOperations() {
  var html = `
    <style>
      body { font-family: Arial; padding: 20px; background: #1a1a1a; color: white; }
      .operation { background: #2a2a2a; padding: 15px; margin: 10px 0; border-radius: 8px; }
      button { background: #7A1927; color: white; padding: 8px 16px; border: none; 
               border-radius: 4px; cursor: pointer; margin: 5px; }
      select, input { padding: 8px; margin: 5px; background: #2a2a2a; color: white; 
                      border: 1px solid #7A1927; border-radius: 4px; }
    </style>
    
    <h2>🔧 Batch Operations</h2>
    
    <div class="operation">
      <h3>Mark Multiple as Watched/Read</h3>
      <select id="batchType">
        <option value="Anime">Anime</option>
        <option value="Manhwa">Manhwa</option>
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
    
    <div id="result" style="margin-top: 20px; padding: 10px; background: #2a2a2a; border-radius: 4px; display: none;"></div>
    
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
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(500)
    .setHeight(600);
    
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Batch Operations');
}

function batchMarkComplete(type) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(type);
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

// ===== EXPORT/IMPORT =====
function exportAllData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Pornhwa', 'Novels', 'Movies', 'TV Shows', 'Archive'];
  var allData = {};
  
  sheets.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    allData[sheetName] = sheet.getDataRange().getValues();
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

// ===== WATCH CALENDAR =====
function showWatchCalendar() {
  var html = HtmlService.createHtmlOutputFromFile('WatchCalendar')
    .setWidth(800)
    .setHeight(600);
    
  SpreadsheetApp.getUi().showModalDialog(html, 'Watch Calendar');
}

// ===== TIME TRACKER =====
function showTimeTracker() {
  var timeData = getTimeSpentData();
  
  var html = '<h2>⏰ Time Tracking</h2>';
  html += '<div style="font-family: Arial; color: white; background: #1a1a1a; padding: 20px;">';
  
  Object.keys(timeData).forEach(function(type) {
    if (timeData[type].total > 0) {
      var hours = Math.floor(timeData[type].total / 60);
      var minutes = timeData[type].total % 60;
      
      html += '<div style="background: #2a2a2a; padding: 15px; margin: 10px 0; border-radius: 8px;">';
      html += '<h3>' + type + '</h3>';
      html += '<div>Total Time: ' + hours + 'h ' + minutes + 'm</div>';
      html += '<div>Items: ' + timeData[type].count + '</div>';
      html += '<div>Average: ' + Math.round(timeData[type].total / timeData[type].count) + ' minutes</div>';
      html += '</div>';
    }
  });
  
  html += '</div>';
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(400)
    .setHeight(500);
    
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Time Tracker');
}

function getTimeSpentData() {
  // Simplified time tracking - in real app would track actual time
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Anime', 'Manhwa', 'Movies', 'TV Shows'];
  var timeData = {};
  
  sheets.forEach(function(sheetName) {
    timeData[sheetName] = {
      total: 0,
      count: 0
    };
    
    var sheet = ss.getSheetByName(sheetName);
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === 'Watched' || data[i][1] === 'Read') {
        timeData[sheetName].count++;
        
        // Estimate time based on type
        if (sheetName === 'Anime') {
          timeData[sheetName].total += 24 * (data[i][4] || 1); // 24 min per episode
        } else if (sheetName === 'Movies') {
          timeData[sheetName].total += 120; // 2 hours per movie
        } else if (sheetName === 'TV Shows') {
          timeData[sheetName].total += 45 * (data[i][4] || 1); // 45 min per episode
        } else if (sheetName === 'Manhwa') {
          timeData[sheetName].total += 3 * (data[i][3] || 1); // 3 min per chapter
        }
      }
    }
  });
  
  return timeData;
}

// ===== AUTO FORMATTING =====
function onEdit(e) {
  var range = e.range;
  var sheet = e.source.getActiveSheet();
  var col = range.getColumn();
  var row = range.getRow();
  var value = e.value;
  
  // Skip header row
  if (row === 1) return;
  
  // Auto-format progress
  if (col === 3 && value) {
    if (!value.includes('Ch') && !value.includes('S') && !isNaN(value)) {
      var sheetName = sheet.getName();
      if (sheetName === 'Anime' || sheetName === 'TV Shows') {
        range.setValue('S1E' + value);
      } else if (sheetName === 'Manhwa' || sheetName === 'Pornhwa' || sheetName === 'Novels') {
        range.setValue('Ch' + value);
      }
    }
  }
  
  // Auto-archive if dropped
  if (col === 2 && value === 'Dropped') {
    moveToArchive(sheet, row);
  }
  
  // Auto-date if adding new item
  if (col === 1 && value && !sheet.getRange(row, 7).getValue()) {
    sheet.getRange(row, 7).setValue(new Date().toLocaleDateString());
  }
}

function moveToArchive(sheet, row) {
  var archiveSheet = sheet.getParent().getSheetByName('Archive');
  var rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var archiveData = [sheet.getName()].concat(rowData);
  archiveSheet.appendRow(archiveData);
  
  sheet.deleteRow(row);
}

// ===== SEARCH FUNCTIONALITY =====
function showSearchDialog() {
  var html = `
    <style>
      body { font-family: Arial; padding: 20px; background: #1a1a1a; color: white; }
      input { width: 100%; padding: 10px; margin: 10px 0; background: #2a2a2a; 
              color: white; border: 1px solid #7A1927; border-radius: 4px; }
      .result { background: #2a2a2a; padding: 10px; margin: 5px 0; 
                border-radius: 4px; cursor: pointer; }
      .result:hover { background: #3a3a3a; }
    </style>
    
    <h2>🔍 Search All Media</h2>
    <input type="text" id="searchQuery" placeholder="Search titles..." onkeyup="search()">
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
            results.forEach(function(item) {
              html += '<div class="result">';
              html += '<strong>' + item.title + '</strong> ';
              html += '<span style="color: