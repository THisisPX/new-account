// ============================================================
// Login type codes (normalized internal representation)
// ============================================================
export type LoginTypeCode = 'account' | 'qrcode';

// ============================================================
// Safe box types (normalized internal representation)
// ============================================================
export type SafeBoxType = '9grid' | '6grid' | 'other';

// ============================================================
// Stamina levels (normalized internal representation)
// ============================================================
export type StaminaLevel = '7' | '5-6' | '3-4';

// ============================================================
// Rank levels
// ============================================================
export type RankLevel = '青铜' | '白银' | '黄金' | '铂金' | '钻石' | '黑鹰' | '三角洲巅峰';

// ============================================================
// Rent account status
// ============================================================
export type RentStatus = 'active' | 'rented' | 'disabled';

// ============================================================
// Sell account status
// ============================================================
export type SellStatus = 'pending' | 'approved' | 'rejected' | 'completed';

// ============================================================
// Display mappings
// ============================================================
export const LOGIN_TYPE_DISPLAY: Record<LoginTypeCode, string> = {
  account: '账密登录',
  qrcode: '扫码登录',
};

export const LOGIN_TYPE_SHORT_DISPLAY: Record<LoginTypeCode, string> = {
  account: '账密',
  qrcode: '扫码',
};

export const SAFE_BOX_DISPLAY: Record<SafeBoxType, string> = {
  '9grid': '9格安全箱 (3×3)',
  '6grid': '6格安全箱 (2×3)',
  'other': '其它安全箱',
};

export const SAFE_BOX_SHORT_DISPLAY: Record<SafeBoxType, string> = {
  '9grid': '3×3顶级安全箱',
  '6grid': '2×3高级保险箱',
  'other': '其它安全箱',
};

export const STAMINA_DISPLAY: Record<StaminaLevel, string> = {
  '7': '7体',
  '5-6': '5-6体',
  '3-4': '3-4体',
};

// ============================================================
// Base interface for all accounts
// ============================================================
export interface GameAccountBase {
  id: string;
  region: string;          // 'QQ区' | '微信区'
  server: string;         // 'QQ' | '微信'
  loginType: LoginTypeCode;
  rank: RankLevel;
  harvardCoins: number;    // Numeric (M), e.g., 237
  totalAssets: number;     // Numeric (M), e.g., 300
  level: number;
  safeBox: SafeBoxType;
  stamina: StaminaLevel;
  trainingLevel: string;  // '1级' - '7级'
  rangeLevel: string;     // '1级' - '7级'
  awmAmmo: number;       // AWM子弹数量
  sixSetHead: number;      // 六头数量
  sixSetArmor: number;    // 六甲数量
  knifeSkins: string[];   // Array of knife skin names
  operatorSkins: Record<string, string[]>;
  price: number;
  deposit?: number;       // Rent only
  note: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Rent-specific interface
// ============================================================
export interface GameAccountRent extends GameAccountBase {
  status: RentStatus;
  assetsDisplay: string; // For display: '5000万'
}

// ============================================================
// Sell-specific interface
// ============================================================
export interface GameAccountSell extends GameAccountBase {
  status: SellStatus;
  banRecord: string;
  isOwnFace: boolean;
  superGuarantee: boolean;
  userId: string;
  userName: string;
  submittedAt: string;
  mainInterface?: string;
  warehouse?: string;
  other?: string;
}

// ============================================================
// Form data interfaces (for input handling)
// ============================================================
export interface RentFormData {
  region: string;
  loginType: LoginTypeCode;
  harvardCoins: string;    // String input for validation
  rank: RankLevel;
  safeBox: SafeBoxType;
  trainingLevel: string;
  rangeLevel: string;
  awmAmmo: string;
  sixSetHead: string;
  sixSetArmor: string;
  knife: string;           // Primary knife
  knifeExtra: string;     // Extra knives (comma-separated for display)
  price: string;
  deposit: string;
  note: string;
}

export interface SellFormData {
  region: string;
  loginType: LoginTypeCode;
  totalAssets: string;
  harvardCoins: string;
  level: string;
  rank: RankLevel;
  safeBox: SafeBoxType;
  stamina: StaminaLevel;
  trainingLevel: string;
  rangeLevel: string;
  awmAmmo: string;
  sixSetHead: string;
  sixSetArmor: string;
  banRecord: string;
  isOwnFace: string;
  superGuarantee: boolean;
  note: string;
}

// ============================================================
// Legacy type aliases (for migration compatibility)
// ============================================================
/** @deprecated Use GameAccountRent instead */
export type RentAccount = GameAccountRent;

/** @deprecated Use GameAccountSell instead */
export type SellAccount = GameAccountSell;

/** @deprecated Use GameAccountBase instead */
export type Account = GameAccountBase;
