/*
 * Truths from github.com/khoipn21/TMDT-main:
 * - server/Routes/ProductRoutes.js: GET /api/products matches `name` with a case insensitive regex, pageSize = 12.
 * - mainpage/src/Redux: one `cart` slice; CART_ADD_ITEM adds the item; Header, Cart, Shipping, Payment and
 *   PlaceOrder screens all read state.cart; createOrder dispatches CART_CLEAR_ITEMS.
 * - server/Models/OrderModel.js: an order carries isPaid and isDelivered, both false when created.
 * - dashboard/src/Redux/Actions/UserActions.jsx: the admin dashboard refuses a login whose user is not isAdmin;
 *   the dashboard is where an order is marked delivered.
 */
export const PAGE_SIZE = 12;
export const CART_READERS = ['header', 'cart', 'shipping', 'payment', 'place order'] as const;

export const STAGES = ['ready', 'search', 'cart', 'not paid', 'paid', 'delivered'] as const;
export const LAST_STAGE = STAGES.length - 1;

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const ease = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const span = (p: number, from: number, to: number) => ease((p - from) / (to - from));
const bump = (p: number, from: number, to: number) => {
  const t = clamp01((p - from) / (to - from));
  return Math.sin(Math.PI * t) ** 2;
};

export interface Pose {
  drawer: number;
  card: number;
  bookX: number;
  inCart: boolean;
  slip: number;
  ram: number;
  marks: [number, number, number];
  key: number;
}

/** The whole machine as a function of one continuous stage value p in [0, 5]. */
export function poseAt(p: number): Pose {
  const drawer = span(p, 0, 0.7) * (1 - span(p, 1.15, 1.75));
  const card = span(p, 0.45, 0.95) * (1 - span(p, 1.05, 1.4));
  const bookX = span(p, 1.1, 1.95) + span(p, 2.1, 2.75);
  const slip = span(p, 3.15, 3.45) + span(p, 4.4, 4.7);
  const ram = bump(p, 2.72, 3.0) + bump(p, 3.62, 3.95) + bump(p, 4.72, 5.0);
  const marks: [number, number, number] = [span(p, 2.84, 2.9), span(p, 3.76, 3.82), span(p, 4.86, 4.92)];
  const key = span(p, 4.0, 4.35);
  return { drawer, card, bookX, inCart: p > 1.85 && p < 2.2, slip, ram, marks, key };
}

export const RESTING_READOUT = `ready · ${PAGE_SIZE} books a page`;

export function readoutOf(p: number) {
  const at = Math.round(p);
  if (Math.abs(p - at) < 0.02) {
    if (at <= 0) return RESTING_READOUT;
    if (at === 1) return `search · page of ${PAGE_SIZE}`;
    if (at === 2) return `cart · read by ${CART_READERS.length} views`;
    if (at === 3) return 'order · not paid';
    if (at === 4) return 'order · paid';
    return 'order · delivered';
  }
  if (p < 1) return 'searching names';
  if (p < 2) return 'CART_ADD_ITEM';
  if (p < 3) return 'order placed · cart cleared';
  if (p < 4) return 'paying';
  return 'admin · marking delivered';
}

export function announceOf(stage: number) {
  return [
    'Ready.',
    `Search: the drawer opens on a page of ${PAGE_SIZE} matches.`,
    `In the cart: one shared tray, read by ${CART_READERS.length} views.`,
    'Order placed and the cart cleared. Not paid.',
    'Order paid.',
    'Admin key turned. Order delivered.',
  ][stage]!;
}
