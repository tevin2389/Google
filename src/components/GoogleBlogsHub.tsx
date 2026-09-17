import React, { useState, useRef, useEffect } from "react";
import { 
  Plus, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Globe, 
  Sparkles, 
  Flame, 
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Cpu,
  Clock,
  Database
} from "lucide-react";
import { BlogItem } from "../types";

interface GoogleBlogsHubProps {
  blogs: BlogItem[];
  onSelectBlog: (blogId: string) => void;
  onOpenAddModal: () => void;
  onEditBlog: (blog: BlogItem) => void;
  onDeleteBlog: (blogId: string) => void;
}

export const GoogleBlogsHub: React.FC<GoogleBlogsHubProps> = ({
  blogs,
  onSelectBlog,
  onOpenAddModal,
  onEditBlog,
  onDeleteBlog,
}) => {
  const [openMenuBlogId, setOpenMenuBlogId] = useState<string | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<BlogItem | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuBlogId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalTodayPosts = blogs.reduce((acc, b) => acc + (b.todayPostCount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              해외 타겟 구글 블로그 작업 허브
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30 text-[11px] font-bold">
              Google Blogger
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            블로그를 클릭하면 전용 <strong className="text-slate-200">3단 AI 파이프라인(주제 AI ➔ 글쓰기 AI ➔ 발행 및 분석 AI)</strong>으로 진입합니다.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-400">오늘 전체 발행</div>
            <div className="text-lg font-black text-amber-400 font-mono">
              총 {totalTodayPosts}개 완료
            </div>
          </div>

          {/* Plus Add Blog Button */}
          <button
            id="btn-add-new-blog"
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span>새 블로그 추가</span>
          </button>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map((blog) => {
          const isMenuOpen = openMenuBlogId === blog.id;

          return (
            <div
              key={blog.id}
              id={`card-blog-${blog.id}`}
              onClick={() => onSelectBlog(blog.id)}
              className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-3xl p-5 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-orange-500/10 hover:-translate-y-1"
            >
              {/* Top Row: Google Blogger Tag & ... (More Menu) */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-orange-300 uppercase tracking-wider">
                    Google Blogger
                  </span>
                </div>

                {/* '...' More Button */}
                <div 
                  className="relative" 
                  onClick={(e) => e.stopPropagation()}
                  ref={isMenuOpen ? menuRef : null}
                >
                  <button
                    id={`btn-menu-${blog.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuBlogId(isMenuOpen ? null : blog.id);
                    }}
                    className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                    title="설정 (수정/삭제)"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu (수정 / 삭제) */}
                  {isMenuOpen && (
                    <div 
                      className="absolute right-0 top-9 z-20 w-32 bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl py-1.5 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        id={`btn-edit-${blog.id}`}
                        onClick={() => {
                          setOpenMenuBlogId(null);
                          onEditBlog(blog);
                        }}
                        className="w-full px-3.5 py-2 text-left hover:bg-slate-800/80 flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>수정</span>
                      </button>

                      <button
                        id={`btn-delete-${blog.id}`}
                        onClick={() => {
                          setOpenMenuBlogId(null);
                          setBlogToDelete(blog);
                        }}
                        className="w-full px-3.5 py-2 text-left hover:bg-red-500/10 flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>삭제</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Section: Blog Name & Topic */}
              <div className="space-y-2.5 my-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                    {blog.name}
                  </h2>
                  {blog.blogUrl && (
                    <span className="text-[11px] text-slate-500 font-mono truncate block mt-0.5">
                      {blog.blogUrl.replace("https://", "")}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    주제 (Topic)
                  </span>
                  <p className="text-xs text-slate-200 font-medium line-clamp-2 leading-relaxed">
                    {blog.niche}
                  </p>
                </div>
              </div>

              {/* Bottom Section: Today's Published Posts Count & DB Count */}
              <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold font-mono text-xs" title="오늘 하루 올린 글 수">
                    오늘 {blog.todayPostCount || 0}개
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-medium font-mono text-[11px] flex items-center gap-1" title="블로그 아티클 DB 보관 수">
                    <Database className="w-3 h-3 text-cyan-400" />
                    <span>DB {blog.articleDatabase?.length || 0}건</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all">
                  <span>파이프라인 열기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Big '+' Card for easy add */}
        <button
          id="btn-add-card-slot"
          onClick={onOpenAddModal}
          className="border-2 border-dashed border-slate-800 hover:border-orange-500/50 hover:bg-slate-900/40 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-white transition-all group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-800 group-hover:bg-orange-500/20 text-slate-400 group-hover:text-orange-400 flex items-center justify-center transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-sm font-bold block text-slate-300 group-hover:text-white">
              새 구글 블로그 추가
            </span>
            <span className="text-xs text-slate-500 mt-0.5 block">
              해외 타겟 고수익 카테고리 채널 확장
            </span>
          </div>
        </button>
      </div>

      {/* In-app Delete Confirmation Modal (Iframe-safe) */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">블로그 삭제 확인</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  '<span className="text-slate-200 font-semibold">{blogToDelete.name}</span>' 블로그를 정말 삭제하시겠습니까?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteBlog(blogToDelete.id);
                  setBlogToDelete(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-lg shadow-red-600/20"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
