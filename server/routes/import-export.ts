import { Router } from 'express';
import { storage } from '../storage';
import { parseString } from 'xml2js';
import csv from 'csv-parser';
import { Readable } from 'stream';

const router = Router();

// Export endpoint
router.get('/export', async (req, res) => {
  try {
    const format = req.query.format as string || 'json';
    const userId = "default-user"; // TODO: Get from auth
    
    const mediaItems = await storage.getAllMediaItems(userId);
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="media-tracker-export.json"');
      res.json({
        version: '1.0',
        exportDate: new Date().toISOString(),
        items: mediaItems
      });
    } else if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="media-tracker-export.csv"');
      
      const csvHeader = 'Title,Type,Status,Progress,Rating,Notes\n';
      const csvData = mediaItems.map(item => {
        return `"${item.title}","${item.type}","${item.status}","${item.progress || ''}","${item.rating || ''}","${item.notes || ''}"`;
      }).join('\n');
      
      res.send(csvHeader + csvData);
    } else {
      res.status(400).json({ error: 'Invalid format' });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// Import endpoint
router.post('/import', async (req, res) => {
  try {
    const userId = "default-user";
    const format = req.body.format;
    const fileContent = req.body.file;
    
    let itemsToImport = [];
    
    if (format === 'csv') {
      // Parse CSV
      const results: any[] = [];
      Readable.from(fileContent)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          for (const row of results) {
            itemsToImport.push({
              title: row.Title || row.title,
              type: row.Type || row.type || 'Anime',
              status: row.Status || row.status || 'To Watch',
              progress: row.Progress || row.progress,
              rating: row.Rating ? parseInt(row.Rating) : undefined,
              notes: row.Notes || row.notes
            });
          }
          
          // Import items
          let imported = 0;
          for (const item of itemsToImport) {
            try {
              await storage.createMediaItem(userId, item);
              imported++;
            } catch (error) {
              console.error('Failed to import item:', item.title, error);
            }
          }
          
          res.json({ success: true, count: imported });
        });
    } else if (format === 'mal') {
      // Parse MAL XML
      parseString(fileContent, async (err, result) => {
        if (err) {
          return res.status(400).json({ error: 'Invalid XML format' });
        }
        
        const animeList = result?.myanimelist?.anime || [];
        for (const anime of animeList) {
          const status = anime.my_status?.[0];
          let mediaStatus = 'To Watch';
          
          switch(status) {
            case '1': mediaStatus = 'Watching'; break;
            case '2': mediaStatus = 'Completed'; break;
            case '3': mediaStatus = 'On Hold'; break;
            case '4': mediaStatus = 'Dropped'; break;
            case '6': mediaStatus = 'To Watch'; break;
          }
          
          itemsToImport.push({
            title: anime.series_title?.[0] || 'Unknown',
            type: 'Anime',
            status: mediaStatus,
            progress: anime.my_watched_episodes?.[0] ? `E${anime.my_watched_episodes[0]}` : undefined,
            rating: anime.my_score?.[0] ? parseInt(anime.my_score[0]) : undefined,
            totalEpisodes: anime.series_episodes?.[0] ? parseInt(anime.series_episodes[0]) : undefined
          });
        }
        
        // Import items
        let imported = 0;
        for (const item of itemsToImport) {
          try {
            await storage.createMediaItem(userId, item);
            imported++;
          } catch (error) {
            console.error('Failed to import item:', item.title, error);
          }
        }
        
        res.json({ success: true, count: imported });
      });
    } else if (format === 'anilist') {
      // Parse AniList JSON
      try {
        const data = JSON.parse(fileContent);
        const lists = data.lists || [];
        
        for (const list of lists) {
          for (const entry of list.entries || []) {
            let mediaStatus = 'To Watch';
            switch(list.status) {
              case 'CURRENT': mediaStatus = 'Watching'; break;
              case 'COMPLETED': mediaStatus = 'Completed'; break;
              case 'PAUSED': mediaStatus = 'On Hold'; break;
              case 'DROPPED': mediaStatus = 'Dropped'; break;
              case 'PLANNING': mediaStatus = 'To Watch'; break;
            }
            
            itemsToImport.push({
              title: entry.media?.title?.romaji || entry.media?.title?.english || 'Unknown',
              type: 'Anime',
              status: mediaStatus,
              progress: entry.progress ? `E${entry.progress}` : undefined,
              rating: entry.score || undefined,
              totalEpisodes: entry.media?.episodes || undefined
            });
          }
        }
        
        // Import items
        let imported = 0;
        for (const item of itemsToImport) {
          try {
            await storage.createMediaItem(userId, item);
            imported++;
          } catch (error) {
            console.error('Failed to import item:', item.title, error);
          }
        }
        
        res.json({ success: true, count: imported });
      } catch (error) {
        res.status(400).json({ error: 'Invalid JSON format' });
      }
    } else {
      res.status(400).json({ error: 'Unsupported format' });
    }
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Import failed' });
  }
});

export default router;