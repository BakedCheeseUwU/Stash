export interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileItem[]
}

export interface Path {
  id: string
  name: string
}

export const mockData: FileItem[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    children: [
      { id: "2", name: "Resume.pdf", type: "file" },
      { id: "3", name: "Cover Letter.docx", type: "file" },
    ],
  },
  {
    id: "4",
    name: "Photos",
    type: "folder",
    children: [
      { id: "5", name: "Vacation.jpg", type: "file" },
      { id: "6", name: "Family.png", type: "file" },
    ],
  },
  { id: "7", name: "Project Proposal.pptx", type: "file" },
]

