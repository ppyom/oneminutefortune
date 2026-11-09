import { describe, expect, it } from "vitest";
import {
  adsenseScriptSrc,
  adsTxt,
  parseAdClient,
  parseAdSlot,
} from "./adsense";

describe("parseAdClient", () => {
  it.each([
    ["ca-pub-1234567890123456", "ca-pub-1234567890123456"],
    ["  ca-pub-1234567890123456 ", "ca-pub-1234567890123456"],
    [undefined, undefined],
    ["", undefined],
    ["pub-1234567890123456", undefined], // ca- 빠짐
    ["ca-pub-XXXX", undefined],
    ['ca-pub-1234567890123456"><script>', undefined],
  ])("%j → %j", (raw, expected) => {
    expect(parseAdClient(raw)).toBe(expected);
  });
});

describe("parseAdSlot", () => {
  it.each([
    ["1234567890", "1234567890"],
    ["", undefined],
    ["abc", undefined],
    [undefined, undefined],
  ])("%j → %j", (raw, expected) => {
    expect(parseAdSlot(raw)).toBe(expected);
  });
});

describe("ads.txt", () => {
  it("ca- 를 떼고 Google 인증 기관 ID를 붙인다", () => {
    expect(adsTxt("ca-pub-1234567890123456")).toBe(
      "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n",
    );
  });

  it("스크립트 주소", () => {
    expect(adsenseScriptSrc("ca-pub-1234567890123456")).toBe(
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456",
    );
  });
});
