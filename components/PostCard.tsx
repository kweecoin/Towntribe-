
import React from 'react';
import { Post, PostType } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const isOffer = post.type === PostType.OFFER;
  
  const getDaysLeft = () => {
    const diff = post.expiresAt - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const daysLeft = getDaysLeft();

  return (
    <div className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all flex flex-col h-full transform hover:-translate-y-1">
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] ${
              isOffer ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'
            }`}>
              {isOffer ? 'Gift' : 'Need'}
            </span>
            <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-wider">
              <span className="opacity-70">{CATEGORY_ICONS[post.category]}</span>
              <span className="ml-1.5">{post.category}</span>
            </div>
          </div>
          <button 
            onClick={() => onDelete(post.id)}
            className="text-slate-200 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight tracking-tight">
          {post.title}
        </h3>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-4 font-medium leading-relaxed">
          {post.description}
        </p>
      </div>

      <div className="px-6 py-5 border-t border-slate-50 bg-slate-50/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-slate-400 font-bold truncate max-w-[70%]">
            <svg className="w-4 h-4 mr-2 shrink-0 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {post.location}
          </div>
          <div className={`text-[9px] font-black px-2 py-1 rounded-lg ${
            daysLeft <= 3 ? 'text-white bg-red-600 animate-pulse' : 'text-slate-400 bg-slate-200/50'
          }`}>
            {daysLeft}d left
          </div>
        </div>
        <div className="flex items-center text-xs text-red-600 font-black tracking-tight truncate group-hover:underline cursor-pointer">
          <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact Member
        </div>
      </div>
    </div>
  );
};

export default PostCard;
