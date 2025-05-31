import { ReactNode } from "react";

export type SearchResult = {
  id: number | string;
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
};

export type SearchProps = {
  placeholder?: string;
  results?: SearchResult[];
  onSearch?: (_query: string) => void;
  className?: string;
  showCommands?: boolean;
  maxResults?: number;
  value?: string;
  onChange?: (_value: string) => void;
};
