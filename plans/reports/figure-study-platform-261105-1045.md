# Figure: study-platform (Fig 6, StudyPlatformFigure)

## Concept
The API gateway is drawn as a small DIN-rail distribution panel on a bench. A feed cable enters a limiter module, which stands for the rate limiter; its gauge shows a full token bucket. A comb busbar carries the feed to three breakers, one each for the auth, course and progress gRPC services. Every breaker has a failure dial marked 0 to 5, three attempt lamps (one per retry try) and its own cable leaving through a gland in the backplate. The backplate is Docker in the legend. The course breaker's handle is the only lit part. Each press sends a failing call: the three lamps light in turn with the real 100 ms and 200 ms backoff, then the needle moves one step. On the fifth failure the handle snaps to off, the glow rises and later calls are refused. The 60 s open wait counts down (played 10 times faster, which the caption says). After that wait a trial call goes through in half open, and when it succeeds the handle travels back to on. While the figure is idle, a tour runs the same loop.

## Truths and sources (github.com/khoipn21/study-platform, api-gateway)
- cmd/main.go: CircuitBreakerConfig MaxFailures 5, Timeout 10 s, ResetTimeout 60 s; one breaker plus retry config each for auth-service, course-service, progress-service; ports 8081/8082/8083; RATE_LIMIT_REQUESTS 100, RATE_LIMIT_BURST 200.
- internal/middleware/rate_limiter.go: token bucket, refilled at the rate per second (elapsed.Seconds() * rate).
- internal/middleware/circuit_breaker.go: open turns half open once time since the last failure exceeds the reset timeout; a failure in half open reopens; a success resets the count and closes.
- internal/middleware/retry.go: DefaultRetryConfig MaxAttempts 3, InitialDelay 100 ms, BackoffFactor 2, MaxDelay 5 s, so the delays are 100 ms and then 200 ms.
- src/data/user-data.ts: Go, gRPC, Docker; auth, course and progress services behind a gateway with rate limiting, a circuit breaker and retries.
- Drawing pace only, never shown as a fact: each attempt stays in flight for 0.32 s on screen.

## Parts
About 90 parts (base and 4 feet, backplate with 4 standoffs and screws, DIN rail with 2 end stops, limiter with 12 parts, 3 breakers with 13 parts each, comb with fingers and caps, 4 glands and 4 cables, a schedule card). This is a little over the 80 part target, mostly screws and lamps.

## Files
src/components/figures/study-platform/{model.ts, view.ts, art.ts, frame.ts, study-platform-live.tsx, study-platform-figure.tsx, study-platform.css}; preview at src/app/figure-lab/study-platform/page.tsx.

## Screenshots
- 1440 dark: /tmp/claude-1000/-home-khoipn21-workspaces-projects-portfolio-v4/aabefdd1-e408-4206-ac11-1caa36c98196/scratchpad/figures/study-platform/desk-dark.png
- 1440 light: /tmp/claude-1000/-home-khoipn21-workspaces-projects-portfolio-v4/aabefdd1-e408-4206-ac11-1caa36c98196/scratchpad/figures/study-platform/desk-light.png
- 390 dark: /tmp/claude-1000/-home-khoipn21-workspaces-projects-portfolio-v4/aabefdd1-e408-4206-ac11-1caa36c98196/scratchpad/figures/study-platform/phone-dark.png
- 390 light: /tmp/claude-1000/-home-khoipn21-workspaces-projects-portfolio-v4/aabefdd1-e408-4206-ac11-1caa36c98196/scratchpad/figures/study-platform/phone-light.png
- Tripped 4x close-up: /tmp/claude-1000/-home-khoipn21-workspaces-projects-portfolio-v4/aabefdd1-e408-4206-ac11-1caa36c98196/scratchpad/figures/study-platform/z-open.png; half open: /tmp/claude-1000/-home-khoipn21-workspaces-projects-portfolio-v4/aabefdd1-e408-4206-ac11-1caa36c98196/scratchpad/figures/study-platform/z-half.png; reset sheet: /tmp/claude-1000/-home-khoipn21-workspaces-projects-portfolio-v4/aabefdd1-e408-4206-ac11-1caa36c98196/scratchpad/figures/study-platform/sheet-reset.png; reduced motion: /tmp/claude-1000/-home-khoipn21-workspaces-projects-portfolio-v4/aabefdd1-e408-4206-ac11-1caa36c98196/scratchpad/figures/study-platform/still.png

## Verification
- lines.mjs: line ends 0 at rest and 0 in the tripped pose.
- capture/drive at 1440 and 390, rest, tour, interacted (retry, open, refused, half, closed): console clean, no sideways scroll, no hydration warnings.
- tsc --noEmit: no errors. eslint on both paths: pass.

## Concern
In cmd/main.go each gRPC client gets grpc.WithUnaryInterceptor twice (circuit breaker, then retry). In grpc-go the later WithUnaryInterceptor replaces the earlier one, so at runtime only the retry interceptor may be active. The figure shows the gateway as configured. The caption describes configured thresholds and does not claim the breaker has been tested in production.
