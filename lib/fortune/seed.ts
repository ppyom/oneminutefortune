/**
 * cyrb53 — 53비트 문자열 해시 (bryc, public domain).
 * 결과는 0 ≤ h < 2^53 정수.
 */
export function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/** mulberry32 — 32비트 시드 PRNG. [0, 1) 실수를 돌려준다. */
export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 항목별 PRNG. 시드 = cyrb53(`${birth}${date}:${salt}`) 의 하위 32비트.
 * 이 문자열 형식을 바꾸면 모든 결과가 바뀐다.
 */
export function rngFor(
  birth: string,
  date: string,
  salt: string,
): () => number {
  return mulberry32(cyrb53(`${birth}${date}:${salt}`) >>> 0);
}
