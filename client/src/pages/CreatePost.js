import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/post', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        setRedirect(true);
      } else {
        setError(responseData.error || 'Failed to create post');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <form onSubmit={createNewPost} className="max-w-md mx-auto mt-8">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="file"
        onChange={ev => setFiles(ev.target.files)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <Editor value={content} onChange={setContent} />
      <button 
        type="submit" 
        className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create post'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}