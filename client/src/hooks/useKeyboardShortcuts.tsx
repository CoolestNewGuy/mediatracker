import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onAddMedia?: () => void;
  onOpenLibrary?: () => void;
  onQuickUpdate?: () => void;
  onSearch?: () => void;
  onShowHelp?: () => void;
}

export function useKeyboardShortcuts({
  onAddMedia,
  onOpenLibrary,
  onQuickUpdate,
  onSearch,
  onShowHelp
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Handle shortcuts
      switch (event.key.toLowerCase()) {
        case 'a':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onAddMedia?.();
          }
          break;
        case 'l':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onOpenLibrary?.();
          }
          break;
        case ' ':
          event.preventDefault();
          onQuickUpdate?.();
          break;
        case '/':
          event.preventDefault();
          onSearch?.();
          break;
        case '?':
          if (event.shiftKey) {
            event.preventDefault();
            onShowHelp?.();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onAddMedia, onOpenLibrary, onQuickUpdate, onSearch, onShowHelp]);
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <kbd className="px-2 py-1 bg-surface-2 rounded text-xs">A</kbd>
            <span>Add new media</span>
          </div>
          <div className="flex justify-between">
            <kbd className="px-2 py-1 bg-surface-2 rounded text-xs">L</kbd>
            <span>Open library</span>
          </div>
          <div className="flex justify-between">
            <kbd className="px-2 py-1 bg-surface-2 rounded text-xs">Space</kbd>
            <span>Quick progress update</span>
          </div>
          <div className="flex justify-between">
            <kbd className="px-2 py-1 bg-surface-2 rounded text-xs">/</kbd>
            <span>Focus search</span>
          </div>
          <div className="flex justify-between">
            <kbd className="px-2 py-1 bg-surface-2 rounded text-xs">?</kbd>
            <span>Show shortcuts</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-[#7A1927] hover:bg-[#9d2332] rounded text-white text-sm"
        >
          Got it
        </button>
      </div>
    </div>
  );
}