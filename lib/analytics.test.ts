import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendGAEvent } = vi.hoisted(() => ({ sendGAEvent: vi.fn() }));
vi.mock("@next/third-parties/google", () => ({ sendGAEvent }));

// GA_ID는 모듈 로드 시점에 읽으므로 env를 바꾼 뒤 다시 불러온다
async function loadTrack(gaId: string) {
  vi.stubEnv("NEXT_PUBLIC_GA_ID", gaId);
  vi.resetModules();
  return (await import("./analytics")).track;
}

describe("track", () => {
  beforeEach(() => sendGAEvent.mockClear());
  afterEach(() => vi.unstubAllEnvs());

  it("GA_ID가 없으면 보내지 않는다", async () => {
    const track = await loadTrack("");
    track("fortune_submit");
    track("share", { method: "copy_link" });
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it("GA_ID가 있으면 이벤트와 파라미터를 보낸다", async () => {
    const track = await loadTrack("G-TEST123");
    track("share", { method: "web_share" });
    expect(sendGAEvent).toHaveBeenCalledWith("event", "share", {
      method: "web_share",
    });
  });

  it("파라미터가 없는 이벤트는 빈 객체로 보낸다", async () => {
    const track = await loadTrack("G-TEST123");
    track("landing_cta_click");
    expect(sendGAEvent).toHaveBeenCalledWith("event", "landing_cta_click", {});
  });
});
