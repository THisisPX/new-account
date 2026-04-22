import type {
  LoginTypeCode,
  SafeBoxType,
  StaminaLevel,
  GameAccountRent,
  GameAccountSell,
  RankLevel,
} from '@/types/account';

// ============================================================
// LOGIN TYPE UTILITIES
// ============================================================

/** Convert login type code to display string */
export function loginTypeToDisplay(code: LoginTypeCode): string {
  return code === 'account' ? '账密登录' : '扫码登录';
}

/** Convert login type code to short display string */
export function loginTypeToShortDisplay(code: LoginTypeCode): string {
  return code === 'account' ? '账密' : '扫码';
}

/** Convert display string to login type code */
export function displayToLoginType(display: string): LoginTypeCode {
  if (display === '账密登录' || display === '账密' || display === 'account') return 'account';
  return 'qrcode';
}

// ============================================================
// SAFE BOX UTILITIES
// ============================================================

/** Convert safe box code to display string */
export function safeBoxToDisplay(code: SafeBoxType): string {
  const map: Record<SafeBoxType, string> = {
    '9grid': '9格安全箱 (3×3)',
    '6grid': '6格安全箱 (2×3)',
    'other': '其它安全箱',
  };
  return map[code];
}

/** Convert safe box code to short display */
export function safeBoxToShortDisplay(code: SafeBoxType): string {
  const map: Record<SafeBoxType, string> = {
    '9grid': '3×3顶级安全箱',
    '6grid': '2×3高级保险箱',
    'other': '其它安全箱',
  };
  return map[code];
}

/** Convert display string to safe box code */
export function displayToSafeBox(display: string): SafeBoxType {
  if (display.includes('9格') || display.includes('3×3') || display === '9grid') return '9grid';
  if (display.includes('6格') || display.includes('2×3') || display === '6grid') return '6grid';
  return 'other';
}

// ============================================================
// STAMINA UTILITIES
// ============================================================

/** Convert stamina code to display string */
export function staminaToDisplay(code: StaminaLevel): string {
  return code === '7' ? '7体' : code === '5-6' ? '5-6体' : '3-4体';
}

/** Convert display string to stamina code */
export function displayToStamina(display: string): StaminaLevel {
  if (display === '7' || display === '7体') return '7';
  if (display === '5-6' || display === '5-6体') return '5-6';
  return '3-4';
}

// ============================================================
// ASSET UTILITIES
// ============================================================

/**
 * Convert harvard coins number to display string
 * e.g., 237 → '237M'
 */
export function harvardCoinsToDisplay(coins: number): string {
  return `${coins}M`;
}

/**
 * Convert harvard coins to assets display (computed)
 * e.g., 237 → '5000万' (simplified calculation)
 */
export function harvardCoinsToAssetsDisplay(coins: number): string {
  const wan = (coins * 1000000 / 10000).toFixed(0);
  return `${wan}万`;
}

/**
 * Parse display string to harvard coins number
 * e.g., '237M' → 237
 */
export function displayToHarvardCoins(display: string): number {
  return parseFloat(display.replace('M', ''));
}

/**
 * Convert assets display string to harvard coins
 * e.g., '5000万' → 5 (in M)
 */
export function assetsDisplayToHarvardCoins(display: string): number {
  const wan = parseFloat(display.replace('万', ''));
  return (wan * 10000) / 1000000;
}

// ============================================================
// FORM CONVERSION UTILITIES
// ============================================================

/** Convert RentFormData to partial GameAccountRent */
export function formDataToRentAccount(form: {
  region: string;
  loginType: LoginTypeCode;
  harvardCoins: string;
  rank: RankLevel;
  safeBox: SafeBoxType;
  trainingLevel: string;
  rangeLevel: string;
  awmAmmo: string;
  knife: string;
  knifeExtra: string;
  price: string;
  deposit: string;
  note: string;
}, price: number, deposit: number): Partial<GameAccountRent> {
  const harvardCoins = parseFloat(form.harvardCoins);

  return {
    harvardCoins,
    totalAssets: harvardCoins,
    assetsDisplay: harvardCoinsToAssetsDisplay(harvardCoins),
    rank: form.rank,
    safeBox: form.safeBox,
    loginType: form.loginType,
    trainingLevel: form.trainingLevel,
    rangeLevel: form.rangeLevel,
    awmAmmo: parseInt(form.awmAmmo) || 0,
    knifeSkins: form.knifeExtra
      ? [form.knife, ...form.knifeExtra.split('、')]
      : form.knife ? [form.knife] : [],
    price,
    deposit,
    note: form.note,
  };
}

// ============================================================
// RECYCLE PRICE CALCULATION
// ============================================================

interface RecyclePriceResult {
  baseRatio: number;
  finalRatio: number;
  recyclePrice: number;
  details: string[];
}

export function calculateRecyclePrice(
  harvardCoins: number,
  safeBox: SafeBoxType,
  stamina: StaminaLevel,
  knifeSkins: string[],
  operatorSkins: Record<string, string[]>,
  awmAmmo: number = 0,
  sixSetHead: number = 0,
  sixSetArmor: number = 0,
  rangeLevel: string = '1级'
): RecyclePriceResult {
  // Calculate additional value from AWM ammo, 六头, 六甲
  // 1 AWM bullet = 25万 = 0.25M
  // 1 六头 = 60万 = 0.6M
  // 1 六甲 = 80万 = 0.8M
  const awmValue = awmAmmo * 0.25;
  const sixHeadValue = sixSetHead * 0.6;
  const sixArmorValue = sixSetArmor * 0.8;

  const totalHarvardCoins = harvardCoins + awmValue + sixHeadValue + sixArmorValue;

  const details: string[] = [];

  // Add breakdown of additional values
  if (awmValue > 0) {
    details.push(`AWM子弹: ${awmAmmo}发 × 0.25M = ${awmValue.toFixed(2)}M`);
  }
  if (sixHeadValue > 0) {
    details.push(`六头: ${sixSetHead}个 × 0.6M = ${sixHeadValue.toFixed(2)}M`);
  }
  if (sixArmorValue > 0) {
    details.push(`六甲: ${sixSetArmor}个 × 0.8M = ${sixArmorValue.toFixed(2)}M`);
  }

  const baseRatios: Record<SafeBoxType, Record<StaminaLevel, number>> = {
    '9grid': { '7': 39, '5-6': 40, '3-4': 41 },
    '6grid': { '7': 41, '5-6': 42, '3-4': 43 },
    'other': { '7': 44, '5-6': 44, '3-4': 44 },
  };

  const base = baseRatios[safeBox]?.[stamina] || 44;

  let skinDiscount = 0;

  const weilongRedSkins = ['凌霄戍卫', '蛟龙行动', '铁面判官', '壮志凌云', '吴彦祖'];
  const hasWeilongRed = operatorSkins['威龙']?.some(s => weilongRedSkins.includes(s));
  const hasHonglangRed = operatorSkins['红狼']?.some(s => s === '蚀金玫瑰');
  const hasMaixiaowenRed = (operatorSkins['麦小雯']?.length ?? 0) > 0;
  const hasKnifeSkin = knifeSkins.length > 0 && !knifeSkins.includes('电锯惊魂');

  if (hasWeilongRed || hasHonglangRed) {
    skinDiscount += 2;
    details.push('威龙/红狼红皮: -2');
  }
  if (hasMaixiaowenRed) {
    skinDiscount += 1;
    details.push('麦小雯红皮: -1');
  }
  if (hasKnifeSkin) {
    skinDiscount += 1;
    details.push('刀皮(电锯除外): -1');
  }

  let largeAmountAdjustment = 0;
  if (totalHarvardCoins >= 300) {
    largeAmountAdjustment = 2;
    details.push('大额账号(≥300M): +2');
  }

  // 靶场等级 <= 5级时，比例减1
  let rangeLevelAdjustment = 0;
  const rangeLevelNum = parseInt(rangeLevel.replace('级', ''));
  if (rangeLevelNum <= 5) {
    rangeLevelAdjustment = -1;
    details.push(`靶场等级≤5级: -1`);
  }

  const finalRatio = base - skinDiscount + largeAmountAdjustment + rangeLevelAdjustment;
  const recyclePrice = (totalHarvardCoins * 100) / finalRatio;

  details.push(`基础比例: 1:${base}`);
  details.push(`最终比例: 1:${finalRatio}`);
  details.push(`总哈夫币: ${totalHarvardCoins.toFixed(2)}M`);

  return {
    baseRatio: base,
    finalRatio,
    recyclePrice,
    details,
  };
}

// ============================================================
// RENT DAYS CALCULATION
// ============================================================

interface RentDaysResult {
  days: number;
  dailyConsumption: number;
}

export function calculateRentDays(harvardCoins: number): RentDaysResult {
  let dailyConsumption = 8;
  if (harvardCoins >= 80 && harvardCoins <= 300) {
    dailyConsumption = 10;
  } else if (harvardCoins > 300) {
    dailyConsumption = 12;
  }

  const days = Math.ceil(harvardCoins / dailyConsumption);

  return { days, dailyConsumption };
}

// ============================================================
// LEGACY CONVERSION (for data migration)
// ============================================================

/**
 * Convert legacy rent account format to unified GameAccountRent
 */
export function legacyToRentAccount(legacy: Record<string, unknown>): GameAccountRent {
  const harvardCoins = assetsDisplayToHarvardCoins(legacy.assets as string);

  return {
    id: legacy.id as string,
    region: legacy.region as string,
    server: legacy.server as string,
    loginType: displayToLoginType(legacy.loginType as string),
    rank: legacy.rank as RankLevel,
    harvardCoins,
    totalAssets: harvardCoins,
    assetsDisplay: legacy.assets as string,
    level: 0,
    safeBox: displayToSafeBox(legacy.safe as string),
    stamina: '7',
    trainingLevel: legacy.training as string,
    rangeLevel: legacy.range as string,
    awmAmmo: parseInt((legacy.awm as string).replace('发', '')) || 0,
    knifeSkins: legacy.knifeExtra
      ? [(legacy.knife as string), ...((legacy.knifeExtra as string).split('、'))]
      : legacy.knife ? [(legacy.knife as string)] : [],
    operatorSkins: (legacy.operatorSkins as Record<string, string[]>) || {},
    price: legacy.price as number,
    deposit: legacy.deposit as number,
    note: (legacy.note as string) || '',
    status: (legacy.status as GameAccountRent['status']) || 'active',
    createdAt: legacy.date as string,
    updatedAt: legacy.date as string,
  };
}

/**
 * Convert legacy sell account format to unified GameAccountSell
 */
export function legacyToSellAccount(legacy: Record<string, unknown>): GameAccountSell {
  return {
    id: legacy.id as string,
    region: legacy.region as string,
    server: legacy.server as string,
    loginType: displayToLoginType(legacy.loginType as string),
    rank: legacy.rank as RankLevel,
    harvardCoins: legacy.harvardCoins as number,
    totalAssets: legacy.totalAssets as number || legacy.harvardCoins as number,
    level: parseInt(legacy.level as string) || 0,
    safeBox: displayToSafeBox(legacy.safeBox as string),
    stamina: displayToStamina(legacy.stamina as string),
    trainingLevel: (legacy.trainingLevel as string) || '1级',
    rangeLevel: (legacy.rangeLevel as string) || '1级',
    awmAmmo: legacy.awmAmmo as number,
    knifeSkins: (legacy.knifeSkins as string[]) || [],
    operatorSkins: (legacy.operatorSkins as Record<string, string[]>) || {},
    price: legacy.recyclePrice as number,
    banRecord: (legacy.banRecord as string) || '无封禁记录',
    isOwnFace: (legacy.isOwnFace as boolean) || false,
    superGuarantee: (legacy.superGuarantee as boolean) || false,
    userId: legacy.userId as string,
    userName: legacy.userName as string,
    note: (legacy.note as string) || '',
    status: (legacy.status as GameAccountSell['status']) || 'pending',
    createdAt: legacy.submittedAt as string,
    updatedAt: legacy.submittedAt as string,
    submittedAt: legacy.submittedAt as string,
  };
}
