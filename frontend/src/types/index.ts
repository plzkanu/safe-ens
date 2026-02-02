// User types
export enum UserRole {
  ADMIN = 'ADMIN',
  SITE_MANAGER = 'SITE_MANAGER',
  SUPERVISOR = 'SUPERVISOR'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  siteId?: string;
  site?: Site;
  createdAt: string;
}

// Site types
export interface Site {
  id: string;
  name: string;
  code: string;
  address?: string;
  description?: string;
  createdAt: string;
}

// Patrol Log types
export enum ItemStatus {
  GOOD = 'GOOD',
  BAD = 'BAD'
}

export interface PatrolItem {
  id: string;
  category: string;
  itemNumber: number;
  itemText: string;
  status: ItemStatus;
  notes?: string;
  photos?: Photo[];
}

export interface PatrolLog {
  id: string;
  inspector: User;
  site: Site;
  inspectionDate: string;
  department: string;
  location: string;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  items: PatrolItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// SAO types
export interface SAOItem {
  id: string;
  category: string;
  itemNumber: number;
  itemText: string;
  checked: boolean;
  notes?: string;
  photos?: Photo[];
}

export interface SAOReport {
  id: string;
  inspector: User;
  site: Site;
  reportDate: string;
  reportTime?: string;
  workplace: string;
  workArea: string;
  workType?: string;
  workShift?: string;
  observerCount: number;
  workerCount: number;
  workResponse?: string;
  items: SAOItem[];
  createdAt: string;
  updatedAt: string;
}

// Photo types
export interface Photo {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Stats types
export interface DashboardStats {
  summary: {
    totalPatrols: number;
    totalSAOs: number;
    badItemsCount: number;
    goodItemsCount: number;
  };
  inspectorStats: InspectorStat[];
  categoryStats: CategoryStat[];
  recentPatrols: PatrolLog[];
  recentSAOs: SAOReport[];
}

export interface InspectorStat {
  id: string;
  name: string;
  patrolCount: number;
  badItemsCount: number;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface ComplianceData {
  supervisor: User;
  patrolCount: number;
  expectedCount: number;
  complianceRate: number;
  isCompliant: boolean;
}

export interface MonthlyTrendData {
  month: string;
  patrolCount: number;
  goodCount: number;
  badCount: number;
}
