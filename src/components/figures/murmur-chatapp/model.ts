/* True numbers from khoipn21/murmur-chatapp.
 * PAGE_SIZE: murmur-server/repository/message_repository.go `LIMIT 35`, and ChatScreen.tsx stops paging when a page is not 35 long.
 * PING_PERIOD_S / PONG_WAIT_S: murmur-server/ws/client.go `pongWait = 60s`, `pingPeriod = pongWait * 9 / 10`. */
export const PAGE_SIZE = 35;
export const PONG_WAIT_S = 60;
export const PING_PERIOD_S = (PONG_WAIT_S * 9) / 10;

export interface Ledger {
  pages: number;
  live: number;
}

export const FIRST: Ledger = { pages: 1, live: 0 };

export const messagesIn = ({ pages, live }: Ledger) => pages * PAGE_SIZE + live;

const pagesWord = (pages: number) => `${pages} ${pages === 1 ? 'page' : 'pages'}`;

/* fetching names the page the crank is winding in; the count changes only once that page has arrived. */
export const readoutOf = (ledger: Ledger, phase: 'rest' | 'live' | 'fetch' | 'reopen' = 'rest') => {
  const count = `${messagesIn(ledger)} messages`;
  if (phase === 'live') return `live +1 · ${count}`;
  if (phase === 'fetch') return `fetching page ${ledger.pages + 1} · ${count}`;
  if (phase === 'reopen') return `channel opened · ${count}`;
  return `${pagesWord(ledger.pages)} · ${count}`;
};

export const RESTING_READOUT = readoutOf(FIRST);

export const describe = (ledger: Ledger) =>
  `${pagesWord(ledger.pages)} of history loaded, ${PAGE_SIZE} messages each, plus ${ledger.live} live ${ledger.live === 1 ? 'message' : 'messages'}: ${messagesIn(ledger)} in all`;
