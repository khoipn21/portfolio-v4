import '@/components/iso/iso.css';
import '@/components/iso/portfolio-figure.css';
import './bookstore.css';
import { Plate } from '@/components/iso/react/draw';
import { FIGURE_LABEL, bookstoreArt } from './art';
import { BookstoreLive } from './bookstore-live';
import { CART_READERS, PAGE_SIZE, RESTING_READOUT } from './model';

const ART = bookstoreArt();

export function BookstoreFigure() {
  return (
    <div className="iso portfolio-figure bookstore-figure">
      <Plate
        fig="Fig 4"
        title="Search to order"
        hint="Press to send a book"
        readout={RESTING_READOUT}
        keys={[
          { mark: 'lit', label: 'The book: one item on its way to an order' },
          { mark: 'raised', label: 'Catalog, tray, press and lock: the store around it' },
        ]}
        caption={`A search returns a page of ${PAGE_SIZE} books. The cart is one shared tray in the Redux store that ${CART_READERS.length} storefront views read, and placing the order empties it. The order slip starts not paid, gets paid, and is only marked delivered from the admin dashboard, which turns away any login that is not an admin.`}
      >
        <BookstoreLive art={ART} label={FIGURE_LABEL} />
      </Plate>
    </div>
  );
}
