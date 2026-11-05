# Figure: murmur-chatapp (Fig 5, "Two lines, one spool")

## Concept
A telegraph receiving desk with two separate mechanisms feeding one take up spool, which stands for the shared TanStack Query message cache. At the back, the live line comes in through an insulator and binding posts to a register (useMessageSocket). Its electromagnet pulls a long lit armature, so the stylus strikes the paper tape edge with an accent flash and the tape advances one message onto the spool's upper deck. In front, the history line: one crank turn on the archive reel pays out exactly one page of tape (the coil radius is PAGE_LEN / 2π), past an index gate where a page notch stops, onto the spool's lower deck. A page counter dial steps once per page. Press, Enter or Space loads one older page. The idle tour delivers live messages and loads pages, then loops back to a freshly opened channel.

## Truths and sources
- Page size 35: murmur-server/repository/message_repository.go `LIMIT 35`. ChatScreen.tsx stops paging when a page is shorter than 35. Each page is 35 embossed groups on the tape.
- Ping every 54 s, pong wait 60 s: murmur-server/ws/client.go `pongWait = 60 * time.Second`, `pingPeriod = (pongWait * 9) / 10`. These numbers appear in the caption only.
- Separate mechanisms for history (TanStack Query pagination) and live messages (WebSocket hook), plus Go with Gin and Gorilla WebSocket: src/data/user-data.ts murmur-chatapp entry (decision, contribution) and the repo.
- The readout counts only pages × 35 plus live arrivals. No invented statistics.

## Files
src/components/figures/murmur-chatapp/{model.ts, view.ts, art.ts, frame.ts, murmur-chatapp-figure.tsx (server, exports MurmurChatappFigure), murmur-chatapp-live.tsx ('use client'), murmur-chatapp.css}. Temporary preview: src/app/figure-lab/murmur-chatapp/page.tsx.

## Part count
About 90 shaded solids (about 70 physical parts: plate, feet, spool, archive reel, crank, register, coils, armature, spring, pivot posts, rails, rollers, gate, dial, insulator, terminals, wires, nameplate). Exactly one lit part: the armature with its stylus, plus its strike glow.

## Screenshots (scratchpad/figures/murmur-chatapp/)
- final-dark-1440.png, final-dark-390.png, final-light-1440.png, final-light-390.png
- strike-sheet-v4.png (live strike), mid-crank-v1.png and after-3-v1.png (page loads), reduced.png

## Verification
- lines.mjs: `line ends: 0` in dark rest, light rest, mid crank, and after a strike.
- Console clean on every capture and drive, no hydration warnings, no sideways scroll at 390.
- `npx tsc --noEmit -p .`: no errors from these files. eslint on both paths: clean.
- Reduced motion: no tour, and a press jumps straight to the next page.
- Motion is time based (critically damped crank spring, exponential tape follow), writes attributes on refs only, and pauses offscreen through IntersectionObserver.
