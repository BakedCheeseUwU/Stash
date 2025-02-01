"use client";

import React, { useState } from "react";
import { type FileItem, mockData, type Path } from "./types";
import {
  FolderIcon,
  FileIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UploadIcon,
  HomeIcon,
  SearchIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const FileTreeItem: React.FC<{
  item: FileItem;
  level: number;
  currentPath: Path[];
  onNavigate: (item: FileItem) => void;
}> = ({ item, level, currentPath, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    if (item.type === "folder") {
      setIsOpen(!isOpen);
      onNavigate(item);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="mb-1"
    >
      <div
        className={`flex cursor-pointer items-center rounded-lg p-3 transition-colors duration-200 hover:bg-gray-800/50`}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={toggleFolder}
      >
        {item.type === "folder" &&
          (isOpen ? (
            <ChevronDownIcon className="mr-2 h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRightIcon className="mr-2 h-4 w-4 text-gray-400" />
          ))}
        {item.type === "folder" ? (
          <FolderIcon className="mr-2 h-5 w-5 text-yellow-500" />
        ) : (
          <FileIcon className="mr-2 h-5 w-5 text-blue-400" />
        )}
        {item.type === "file" ? (
          <a
            href="#"
            className="text-gray-300 transition-colors duration-200 hover:text-blue-400"
          >
            {item.name}
          </a>
        ) : (
          <span className="text-gray-300">{item.name}</span>
        )}
      </div>
      <AnimatePresence>
        {item.type === "folder" && isOpen && item.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.children.map((child) => (
              <FileTreeItem
                key={child.id}
                item={child}
                level={level + 1}
                currentPath={currentPath}
                onNavigate={onNavigate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Breadcrumbs: React.FC<{
  path: Path[];
  onNavigate: (path: Path) => void;
}> = ({ path, onNavigate }) => {
  return (
    <div className="scrollbar-hide mb-4 flex items-center overflow-x-auto whitespace-nowrap pb-2 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate({ id: "root", name: "Home" })}
        className="rounded-md text-gray-300 transition-colors duration-200 hover:bg-gray-800 hover:text-gray-100"
      >
        <HomeIcon className="mr-1 h-4 w-4" />
        Home
      </Button>
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChevronRightIcon className="mx-1 h-4 w-4 text-gray-600" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item)}
            className="rounded-md text-gray-300 transition-colors duration-200 hover:bg-gray-800 hover:text-gray-100"
          >
            {item.name}
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
};

const DriveClone: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(mockData);
  const [currentPath, setCurrentPath] = useState<Path[]>([]);

  const handleUpload = () => {
    const newFile: FileItem = {
      id: `${Date.now()}`,
      name: `New File ${files.length + 1}.txt`,
      type: "file",
    };
    setFiles([...files, newFile]);
  };

  const navigateTo = (item: FileItem | Path) => {
    if (item.id === "root") {
      setCurrentPath([]);
    } else {
      const index = currentPath.findIndex((p) => p.id === item.id);
      if (index !== -1) {
        setCurrentPath(currentPath.slice(0, index + 1));
      } else {
        setCurrentPath([...currentPath, { id: item.id, name: item.name }]);
      }
    }
  };

  const getCurrentFiles = () => {
    let currentFiles = files;
    for (const pathItem of currentPath) {
      const folder = currentFiles.find(
        (f) => f.id === pathItem.id && f.type === "folder",
      );
      if (folder?.children) {
        currentFiles = folder.children;
      } else {
        break;
      }
    }
    return currentFiles;
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-100">Google Drive Clone</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search files..."
              className="rounded-full bg-gray-800 py-2 pl-10 pr-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
          </div>
          <Button
            onClick={handleUpload}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
      <Breadcrumbs path={currentPath} onNavigate={navigateTo} />
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#111] shadow-xl">
        <div className="p-4">
          {getCurrentFiles().map((item) => (
            <FileTreeItem
              key={item.id}
              item={item}
              level={0}
              currentPath={currentPath}
              onNavigate={navigateTo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriveClone;
