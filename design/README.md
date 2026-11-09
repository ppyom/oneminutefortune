# 디자인 레퍼런스

Claude 디자인 캔버스에서 확정한 화면 소스. **구현 참고용이며 그대로 import하지 않는다.**

- 각 파일의 inline style이 정확한 스펙(간격, 크기, 색, radius, 글래스 값)이다.
- `<x-dc>`, `<sc-for>`, `support.js`, `data-props` 등은 캔버스 런타임 전용 문법이니 무시한다.
- 폰트·컬러 토큰은 CLAUDE.md의 디자인 시스템 섹션을 따른다.

| 파일 | 화면 | 크기 |
| --- | --- | --- |
| Main / Result / Share | 모바일 입력·결과·공유 랜딩 | 390 폭 |
| TabletMain / TabletResult / TabletShare | 태블릿 | 834 폭 |
| DesktopMain / DesktopResult / DesktopShare | 데스크톱 | 1440 폭 |
| OgStatic / OgResult | OG 이미지 A(공통) / B(결과 포함) | 1200×630 |

예시 문구(지민님, 87점 등)는 더미 데이터다. 실제 값은 getFortune 결과로 채운다.
