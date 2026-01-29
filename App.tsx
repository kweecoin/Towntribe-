
import React, { useState, useEffect, useMemo } from 'react';
import { Post, PostType, Category } from './types';
import PostCard from './components/PostCard';
import PostForm from './components/PostForm';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<PostType>(PostType.OFFER);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Persistence & Initial Cleanup
  useEffect(() => {
    const saved = localStorage.getItem('towntribe_posts');
    const now = Date.now();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    if (saved) {
      try {
        const parsed: Post[] = JSON.parse(saved);
        setPosts(parsed.filter(p => p.expiresAt > now));
      } catch (e) {
        console.error("Failed to load posts", e);
      }
    } else {
      const seedData: Post[] = [
        {
          id: '1',
          type: PostType.OFFER,
          category: Category.LANDSCAPING,
          title: "Community Mowing Service",
          description: "Available Saturday and Sundays for residential lawn care. I bring my own equipment! Happy to help the tribe.",
          contact: "tribe_mower@email.com",
          location: "North Hills",
          createdAt: now - 100000,
          expiresAt: now + THIRTY_DAYS_MS - 100000
        },
        {
          id: '2',
          type: PostType.REQUEST,
          category: Category.ELDERLY_CARE,
          title: "Help needed for grocery run",
          description: "An elder in our tribe needs someone to pick up prescriptions once a week from the downtown market.",
          contact: "555-0123",
          location: "Oak Creek",
          createdAt: now - 500000,
          expiresAt: now + THIRTY_DAYS_MS - 500000
        },
        {
          id: '3',
          type: PostType.OFFER,
          category: Category.FOOD_AND_BAKED_GOODS,
          title: "Fresh Tribe Sourdough - $7",
          description: "Baking fresh boules every Friday morning. Local ingredients. Pickup at the town center.",
          contact: "amy.smith@email.com",
          location: "Pine Grove",
          createdAt: now,
          expiresAt: now + THIRTY_DAYS_MS
        }
      ];
      setPosts(seedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('towntribe_posts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setShowForm(false);
  };

  const deletePost = (id: string) => {
    if (confirm("Remove this post from the tribe?")) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const filteredPosts = useMemo(() => {
    const now = Date.now();
    return posts.filter(post => {
      const isNotExpired = post.expiresAt > now;
      const matchesTab = post.type === activeTab;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return isNotExpired && matchesTab && matchesSearch && matchesCategory;
    });
  }, [posts, activeTab, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* The user provided logo image */}
            <img 
              src="https://raw.githubusercontent.com/google/generative-ai-docs/main/site/en/gemini-api/docs/quickstart/logo.png" 
              alt="TownTribe Logo" 
              className="h-14 w-auto object-contain hidden sm:block"
              onError={(e) => {
                // Fallback icon if logo not found
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
               <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">TownTribe</h1>
               <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-red-600 mt-1">Strengthening our Community</span>
            </div>
          </div>

          <div className="flex-1 max-w-sm mx-8">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search the tribe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-2xl px-10 py-2.5 text-sm transition-all focus:ring-0 shadow-inner"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <button 
            onClick={() => setShowForm(true)}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-sm hover:bg-red-600 transition-all shadow-xl flex items-center shrink-0 transform active:scale-95"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tighter">The Tribe Feed</h2>
            <p className="text-slate-500 text-xl font-medium">Helping each other, one post at a time.</p>
          </div>
          <div className="flex bg-slate-200 p-1.5 rounded-2xl w-fit shadow-inner h-fit">
              <button
                onClick={() => setActiveTab(PostType.OFFER)}
                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${
                  activeTab === PostType.OFFER ? 'bg-white text-red-600 shadow-md' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Tribal Gifts
              </button>
              <button
                onClick={() => setActiveTab(PostType.REQUEST)}
                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${
                  activeTab === PostType.REQUEST ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Tribal Needs
              </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-6 mb-8 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap border-2 transition-all ${
              selectedCategory === 'All' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-red-600 hover:text-red-600'
            }`}
          >
            View All
          </button>
          {Object.values(Category).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap border-2 transition-all ${
                selectedCategory === cat ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-red-600 hover:text-red-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} onDelete={deletePost} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">The tribe is silent...</h3>
            <p className="text-slate-400 mt-2 max-w-sm mx-auto font-medium">No one has shared anything in this category yet. Be the first to strengthen our tribe!</p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-10 bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:shadow-2xl transition-all active:scale-95 shadow-red-200"
            >
              Post to Tribe
            </button>
          </div>
        )}
      </main>

      {/* Post Modal */}
      {showForm && (
        <PostForm 
          onAddPost={addPost} 
          onClose={() => setShowForm(false)} 
        />
      )}

      {/* FAB */}
      <button 
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 md:hidden bg-red-600 text-white p-5 rounded-3xl shadow-2xl z-40 hover:bg-red-700 transition-all active:scale-90"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default App;
