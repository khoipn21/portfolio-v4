# Figure: bookstore (Fig 4, `BookstoreFigure`)

## Concept
A bench machine that is the store's order path. A library card catalog cabinet is the search: its middle drawer opens on a page of 12 cards and the matching card rises. The matching book (the one lit part) slides out of a rack of 12 along a rail into a trolley tray. The tray is the Redux `cart` slice: one shared tray with a reader bar of 5 windows, which light while the book is in it. Placing the order moves the book on into the in tray of a stamping press and leaves the tray empty (cart cleared). The press stamps an order slip "not paid", indexes it, stamps "paid". A latch then blocks the slip until a key turns a quarter turn in the lock on the press base (the admin boundary), and only then does the slip index to "delivered" and get stamped. Press the figure (or Enter/Space) to advance one stage. After delivered, the next press fades the book, slip and key back and sends the next book.

## Truths and sources (github.com/khoipn21/TMDT-main)
- Page size 12, name matched by case insensitive regex: `server/Routes/ProductRoutes.js` (`pageSize = 12`).
- One `cart` slice. `CART_ADD_ITEM` adds the item. Header, Cart, Shipping, Payment and PlaceOrder screens read `state.cart` (5 views): `mainpage/src/Redux/Reducers/CartReducers.jsx`, `mainpage/src/screens/*`, `mainpage/src/components/Header.jsx`.
- `createOrder` dispatches `CART_CLEAR_ITEMS`: `mainpage/src/Redux/Actions/OrderActions.jsx`.
- Orders carry `isPaid` and `isDelivered`, both default false: `server/Models/OrderModel.js`.
- Delivered is set from the dashboard (`dashboard/src/Redux/Actions/OrderActions.jsx`). The dashboard login refuses non admins (`dashboard/src/Redux/Actions/UserActions.jsx`). Note: the server `PUT /:id/delivered` route only uses `protect`, not `admin`, so the copy says the dashboard turns non admins away and does not claim an API guard.
- Team project with Cao Quoc Viet (`src/data/user-data.ts`). The copy makes no solo claim.

## Files
`src/components/figures/bookstore/`: `model.ts` (stages, pose, readouts), `view.ts` (camera, layout), `art.ts` (static SVG), `frame.ts` (turning key), `bookstore-live.tsx` (client, writes attributes on refs), `bookstore-figure.tsx` (server, Plate), `bookstore.css`. Preview: `src/app/figure-lab/bookstore/page.tsx`.

## Parts
144 drawn solids. That is about 90 assembled parts once pulls, casters and similar sub solids count as one, so it sits above the 40 to 80 tier while still reading at 358px.

## Screenshots
Located in `/tmp/claude-1000/-home-khoipn21-workspaces-projects-portfolio-v4/aabefdd1-e408-4206-ac11-1caa36c98196/scratchpad/figures/bookstore/`:
- `final-1440-dark.png`, `final-1440-light.png`, `final-390-dark.png`, `final-390-light.png`
- Stages and close ups: `r1-drawer.png`, `r2.png`, `r3-press.png`, `r5-press.png`, `mid-rail.png`, `mid-tray.png`. Motion sheets: `sheet-a.png`, `sheet-b.png`, `sheet-c.png`, `sheet-reset.png`.

## Verification
- `lines.mjs`: line ends 0 at rest, drawer open, cart, delivered, and in the light theme.
- Console clean on every capture and drive. No hydration warnings. No sideways scroll at 390.
- `npx tsc --noEmit -p .`: no errors in bookstore files. The only errors are in another agent's `bioweave/art.ts`.
- `npx eslint src/components/figures/bookstore src/app/figure-lab/bookstore`: clean.
- Motion: time based (constant stage speed with smoothstep inside each stage), idle tour loops, pointer plus Enter/Space advance, paused offscreen through IntersectionObserver, no tour under reduced motion (presses jump straight to the next stage), and an aria-live announcement on each stage.
