import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** 테스트용 localStorage. throwing이면 모든 접근에서 예외 */
function fakeStorage(throwing = false) {
  const map = new Map<string, string>();
  const guard = () => {
    if (throwing) throw new Error("SecurityError");
  };
  return {
    getItem: (k: string) => (guard(), map.get(k) ?? null),
    setItem: (k: string, v: string) => (guard(), void map.set(k, v)),
    removeItem: (k: string) => (guard(), void map.delete(k)),
    map,
  };
}

async function load(throwing = false) {
  vi.resetModules();
  const storage = fakeStorage(throwing);
  vi.stubGlobal("window", {
    localStorage: storage,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
  const mod = await import("./storage");
  return { ...mod, storage };
}

beforeEach(() => vi.unstubAllGlobals());
afterEach(() => vi.unstubAllGlobals());

describe("profile storage", () => {
  it("저장 후 읽기, 버전 키 사용", async () => {
    const s = await load();
    expect(s.getProfile()).toBeNull();
    s.saveProfile({ birth: "19950314", name: "지민" });
    expect(s.getProfile()).toEqual({ birth: "19950314", name: "지민" });
    expect(s.storage.map.has("omf:v1:profile")).toBe(true);
  });

  it("같은 값이면 같은 객체 (useSyncExternalStore 안정성)", async () => {
    const s = await load();
    s.saveProfile({ birth: "19950314" });
    expect(s.getProfile()).toBe(s.getProfile());
  });

  it("빈 이름은 저장하지 않는다", async () => {
    const s = await load();
    s.saveProfile({ birth: "19950314", name: "" });
    expect(s.getProfile()).toEqual({ birth: "19950314" });
  });

  it("깨진 값은 null", async () => {
    const s = await load();
    for (const raw of ["{", "null", '{"birth":"19950230"}', '{"birth":1}'])
      expect(s.parseProfile(raw)).toBeNull();
  });

  it("localStorage 접근이 막혀도 메모리로 이어 간다", async () => {
    const s = await load(true);
    expect(s.getProfile()).toBeNull();
    s.saveProfile({ birth: "19950314" });
    expect(s.getProfile()).toEqual({ birth: "19950314" });
  });

  it("구독자에게 변경을 알린다", async () => {
    const s = await load();
    const fn = vi.fn();
    const off = s.subscribeProfile(fn);
    s.saveProfile({ birth: "19950314" });
    s.clearProfile();
    off();
    s.saveProfile({ birth: "19950315" });
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
