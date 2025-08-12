export interface ApiResponse<T = unknown> {
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'analyst' | 'viewer';
}

export interface Threat {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email';
  value: string;
  category: 'malware' | 'phishing' | 'botnet' | 'spam' | 'ddos' | 'bruteforce' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  description?: string;
  firstSeen: string;
  lastSeen: string;
  confidence: number;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ThreatSummary {
  id: string;
  type: string;
  value: string;
  category: string;
  severity: string;
  source: string;
  createdAt: string;
}

export interface CreateThreatRequest {
  type: Threat['type'];
  value: string;
  category: Threat['category'];
  severity: Threat['severity'];
  source: string;
  description?: string;
  confidence: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface DashboardOverview {
  totalThreats: number;
  threatsLast30Days: number;
  threatsLast7Days: number;
  threatsToday: number;
}

export interface ChartData {
  topCountries: Array<{ country: string; count: number }>;
  severityDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
}

export interface DashboardData {
  overview: DashboardOverview;
  charts: ChartData;
  recentActivity: ThreatSummary[];
}

export interface GeoThreat {
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  count: number;
  severity: string;
  category: string;
}

export interface GeographicData {
  geoData: GeoThreat[];
  summary: {
    totalCountries: number;
    topCountry: { name: string; count: number };
  };
}

export interface TimeSeriesData {
  date: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface ThreatChartProps {
  data: Record<string, number>;
  type: 'doughnut' | 'bar' | 'line';
  height?: number;
  showLegend?: boolean;
}

export interface RecentThreatsProps {
  threats: ThreatSummary[];
  maxItems?: number;
  showSource?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export interface ThreatFilters {
  type?: string[];
  category?: string[];
  severity?: string[];
  source?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Loading<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationParams;
  onPaginationChange?: (params: PaginationParams) => void;
  onRowClick?: (item: T) => void;
}
