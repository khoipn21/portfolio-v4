import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell page-intro">
      <h1 className="page-title">Page not found.</h1>
      <p className="lede">
        This link does not lead to a page. Explore the project collection or return to the homepage.
      </p>
      <div className="action-row">
        <Link className="button" href="/projects">
          Browse projects
        </Link>
        <Link className="text-link" href="/">
          Back home
        </Link>
      </div>
    </main>
  );
}
