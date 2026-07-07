import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="font-display text-7xl mb-4">404</p>
      <h1 className="font-display text-2xl mb-2">Page not found</h1>
      <p className="text-gray-mid text-sm mb-8">
        This listing may have been withdrawn, or the page never existed.
      </p>
      <Link to="/" className="btn-primary px-5 py-2.5 text-sm inline-block">
        Back to home
      </Link>
    </div>
  );
}

export default NotFoundPage;
