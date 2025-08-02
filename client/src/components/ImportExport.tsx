import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Download, Upload, FileJson, FileText } from "lucide-react";

interface ImportExportProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportExport({ isOpen, onClose }: ImportExportProps) {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleExport = async (format: 'json' | 'csv') => {
    setExporting(true);
    try {
      const response = await fetch('/api/export?format=' + format);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `media-tracker-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `Your library has been exported as ${format.toUpperCase()}`
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your library. Please try again.",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (file: File, format: string) => {
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);
      
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Import failed');
      
      const result = await response.json();
      
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      
      toast({
        title: "Import Successful",
        description: `Imported ${result.count} items successfully`
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import file. Please check the format and try again.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, format: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImport(file, format);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Import/Export Library</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-surface-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="text-sm text-gray-400 mb-4">
              Export your entire library for backup or sharing
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleExport('json')}
                disabled={exporting}
                className="h-24 flex-col gap-2 bg-surface-2 hover:bg-surface-1 border border-gray-600"
              >
                <FileJson className="w-8 h-8" />
                <div>
                  <p className="font-medium">JSON Format</p>
                  <p className="text-xs text-gray-400">Compatible with AniList</p>
                </div>
              </Button>
              
              <Button
                onClick={() => handleExport('csv')}
                disabled={exporting}
                className="h-24 flex-col gap-2 bg-surface-2 hover:bg-surface-1 border border-gray-600"
              >
                <FileText className="w-8 h-8" />
                <div>
                  <p className="font-medium">CSV Format</p>
                  <p className="text-xs text-gray-400">Excel compatible</p>
                </div>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="text-sm text-gray-400 mb-4">
              Import from other tracking services
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-600 rounded-lg p-4">
                <h4 className="font-medium mb-2">MyAnimeList XML</h4>
                <p className="text-sm text-gray-400 mb-3">Export your MAL list and import it here</p>
                <input
                  type="file"
                  accept=".xml"
                  onChange={(e) => handleFileSelect(e, 'mal')}
                  className="hidden"
                  id="mal-import"
                  disabled={importing}
                />
                <label htmlFor="mal-import">
                  <Button as="span" disabled={importing} className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose MAL XML File
                  </Button>
                </label>
              </div>

              <div className="border border-gray-600 rounded-lg p-4">
                <h4 className="font-medium mb-2">AniList JSON</h4>
                <p className="text-sm text-gray-400 mb-3">Import your AniList backup</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleFileSelect(e, 'anilist')}
                  className="hidden"
                  id="anilist-import"
                  disabled={importing}
                />
                <label htmlFor="anilist-import">
                  <Button as="span" disabled={importing} className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose AniList JSON
                  </Button>
                </label>
              </div>

              <div className="border border-gray-600 rounded-lg p-4">
                <h4 className="font-medium mb-2">CSV Import</h4>
                <p className="text-sm text-gray-400 mb-3">Import from spreadsheet (Title, Type, Status, Progress)</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileSelect(e, 'csv')}
                  className="hidden"
                  id="csv-import"
                  disabled={importing}
                />
                <label htmlFor="csv-import">
                  <Button as="span" disabled={importing} className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose CSV File
                  </Button>
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}