import { isValidYmd } from "@/lib/fortune/date";
import type { Ymd } from "@/lib/fortune/types";

/**
 * 입력한 생년월일·이름을 이 기기의 localStorage에만 저장한다.
 * 사파리 비공개 모드처럼 localStorage를 못 쓰면 메모리에만 들고 있는다.
 */
export interface Profile {
  birth: Ymd;
  name?: string;
}

export const PROFILE_KEY = "omf:v1:profile";

let memory: string | null = null;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(PROFILE_KEY) ?? memory;
  } catch {
    return memory;
  }
}

export function parseProfile(raw: string | null): Profile | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return null;
    const { birth, name } = v as Record<string, unknown>;
    if (typeof birth !== "string" || !isValidYmd(birth)) return null;
    return typeof name === "string" && name ? { birth, name } : { birth };
  } catch {
    return null;
  }
}

// useSyncExternalStore용: 같은 원문이면 같은 객체를 돌려준다
let cachedRaw: string | null = null;
let cachedProfile: Profile | null = null;

export function getProfile(): Profile | null {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedProfile = parseProfile(raw);
  }
  return cachedProfile;
}

export function getServerProfile(): Profile | null {
  return null;
}

export function saveProfile(profile: Profile): void {
  const raw = JSON.stringify(profile.name ? profile : { birth: profile.birth });
  memory = raw;
  try {
    window.localStorage.setItem(PROFILE_KEY, raw);
  } catch {
    // 저장 실패 시 메모리 값으로 이어 간다
  }
  listeners.forEach((l) => l());
}

export function clearProfile(): void {
  memory = null;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch {
    // 무시
  }
  listeners.forEach((l) => l());
}

export function subscribeProfile(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === PROFILE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
