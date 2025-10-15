// Game Types
export interface Case {
  id: number;
  name: string;
  price: number;
  image: string;
  type: "regular" | "free" | "limited";
}

export interface GameFeature {
  id: string;
  title: string;
  image: string;
  count: number;
  target: string;
  onClick?: () => void;
}

export interface Banner {
  id: number;
  image: string;
  link: string;
}

// Inventory Types
export interface InventoryItem {
  id: number;
  name: string;
  value: number;
  image: string;
}

// User Types
export interface UserData {
  username: string;
  userId: string;
  balance: number;
  inventoryCount: number;
}

export interface ReferralData {
  referralBalance: number;
  invitedCount: number;
  referralLink: string;
}

export interface InvitedFriend {
  id: number;
  username: string;
  joinedDate: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  id: number;
  rank: number;
  username: string;
  avatar: string | null;
  score: number;
  details: string;
  isCurrentUser?: boolean;
}

// Component Props Types
export interface CaseCardProps {
  caseItem: Case;
  onClick?: (caseItem: Case) => void;
}

export interface InventoryItemProps {
  item: InventoryItem;
  onSell?: (item: InventoryItem) => void;
  onSelect?: (item: InventoryItem) => void;
}

export interface CasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: Case[];
}

// Navigation Types
export interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

// Loading Types
export interface LoadingStatus {
  status: string;
  isLoading: boolean;
}
