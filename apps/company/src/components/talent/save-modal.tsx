"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FolderPlus, Folder } from "lucide-react";
import { mockSavedFolders } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface SaveModalProps {
  open: boolean;
  onClose: () => void;
  talentName: string;
}

export function SaveModal({ open, onClose, talentName }: SaveModalProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const folderName = creating
      ? newFolderName.trim()
      : mockSavedFolders.find((f) => f.id === selectedFolder)?.name ?? "";

    if (!folderName) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    toast.success(`${talentName} saved to "${folderName}"`, {
      description: "Find them in your Saved candidates.",
    });

    setSelectedFolder("");
    setNewFolderName("");
    setCreating(false);
    onClose();
  };

  const canSave = creating ? newFolderName.trim().length > 0 : selectedFolder !== "";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Save to Folder"
      description={`Organise ${talentName} into a shortlist folder.`}
    >
      <div className="space-y-4">
        {!creating && (
          <>
            <div className="space-y-2">
              {mockSavedFolders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                    selectedFolder === folder.id
                      ? "border-primary-300 bg-primary-50 text-primary-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <Folder
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      selectedFolder === folder.id ? "text-primary-500" : "text-gray-400"
                    )}
                  />
                  <span className="flex-1 font-medium">{folder.name}</span>
                  <span className="text-xs text-gray-400">
                    {folder.candidates.length} saved
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setCreating(true)}
              className="flex w-full items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors"
            >
              <FolderPlus className="h-4 w-4" />
              Create new folder
            </button>
          </>
        )}

        {creating && (
          <div className="space-y-3">
            <Input
              label="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Engineering Leads, Q2 Shortlist…"
              autoFocus
            />
            <button
              onClick={() => setCreating(false)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Choose existing folder instead
            </button>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={loading} disabled={!canSave}>
            Save Candidate
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
