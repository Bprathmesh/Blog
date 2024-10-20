import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({ _id, title, summary, cover, createdAt, author }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="aspect-w-16 aspect-h-9">
        <Link to={`/post/${_id}`}>
          <img 
            src={`http://localhost:4000/${cover}`}
            alt={title}
            className="object-cover w-full h-full"
          />
        </Link>
      </div>
      <div className="p-4">
        <Link to={`/post/${_id}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        </Link>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="font-medium">{author.username}</span>
          <span className="mx-2">•</span>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </div>
        <p className="text-gray-600">{summary}</p>
      </div>
    </article>
  );
}