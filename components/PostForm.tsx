
import React, { useState } from 'react';
import { PostType, Category, Post } from '../types';
import { refinePostContent } from '../services/geminiService';

interface PostFormProps {
  onAddPost: (post: Post) => void;
  onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onAddPost, onClose }) => {
  const [type, setType] = useState<PostType>(PostType.OFFER);
  const [category, setCategory] = useState<Category>(Category.OTHER);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = async () => {
    if (!description) return;
    setIsRefining(true);
    const result = await refinePostContent(description);
    if (result) {
      setTitle(result.title);
      setDescription(result.description);
      setCategory(result.category);
    }
    setIsRefining(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    
    const newPost: Post = {
      id: crypto.randomUUID(),
      type,
      category,
      title,
      description,
      contact,
      location,
      createdAt: now,
      expiresAt: now + THIRTY_DAYS_MS
    };
    onAddPost(newPost);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl max-h-[95vh] overflow-y-auto shadow-[0_0_100px_rgba(209,0,0,0.15)] border border-slate-100">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Post to TownTribe</h2>
            <p className="text-[10px] text-red-600 font-black uppercase tracking-[0.2em] mt-1">Strengthen the Circle</p>
          </div>
          <button onClick={onClose} className="bg-slate-100 p-3 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
            <button
              type="button"
              onClick={() => setType(PostType.OFFER)}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${
                type === PostType.OFFER ? 'bg-white text-red-600 shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Offer to Tribe
            </button>
            <button
              type="button"
              onClick={() => setType(PostType.REQUEST)}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${
                type === PostType.REQUEST ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Ask the Tribe
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">The Message</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you offering or what do you need? Be clear and kind."
                className="w-full h-40 px-5 py-4 rounded-3xl border-2 border-slate-100 focus:border-red-600 focus:ring-0 transition-all resize-none text-sm font-medium bg-slate-50/50"
              />
              <button
                type="button"
                onClick={handleRefine}
                disabled={isRefining || !description}
                className="mt-3 text-[10px] flex items-center bg-red-600 text-white font-black px-5 py-2.5 rounded-2xl hover:bg-slate-900 transition-all disabled:opacity-50 uppercase tracking-widest shadow-lg shadow-red-100"
              >
                {isRefining ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refining...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Tribe Assist
                  </span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Title</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your post"
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-red-600 focus:ring-0 transition-all text-sm font-bold bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-red-600 focus:ring-0 transition-all text-sm font-bold bg-slate-50/50"
                >
                  {Object.values(Category).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">How to reach you</label>
                <input
                  required
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Email / Phone / Address"
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-red-600 focus:ring-0 transition-all text-sm font-bold bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Your Area</label>
                <input
                  required
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Neighborhod or Street"
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-red-600 focus:ring-0 transition-all text-sm font-bold bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-black py-5 px-8 rounded-3xl hover:bg-red-600 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-red-200 transform active:scale-[0.97] uppercase tracking-widest text-sm"
            >
              Finalize Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
