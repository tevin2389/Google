import React, { useState } from "react";
import { 
  X, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Clock, 
  Globe, 
  Sparkles,
  Bot
} from "lucide-react";
import { BlogItem, BlogPlatform } from "../types";

interface BlogManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogs: BlogItem[];
  onUpdateBlogs: (blogs: BlogItem[]) => void;
  selectedBlogId: string;
  onSelectBlog: (id: string) => void;
}

export const BlogManagerModal: React.FC<BlogManagerModalProps> = ({
  isOpen,
  onClose,
  blogs,
  onUpdateBlogs,
  selectedBlogId,
  onSelectBlog,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<BlogPlatform>("tistory");
  const [niche, setNiche] = useState("");
  const [keywords, setKeywords] = useState("");
  const [writeDelay, setWriteDelay] = useState<number>(180);
  const [publishDelay, setPublishDelay] = useState<number>(300);
  const [ollamaModel, setOllamaModel] = useState("qwen2.5:7b");

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setIsEditing(true);
    setEditId(null);
    setName("");
    setPlatform("tistory");
    setNiche("재테크 및 2026 정부지원금");
    setKeywords("청년지원금, 연말정산 환급, ISA 계좌");
    setWriteDelay(180);
    setPublishDelay(300);
    setOllamaModel("qwen2.5:7b");
  };

  const handleStartEdit = (blog: BlogItem) => {
    setIsEditing(true);
    setEditId(blog.id);
    setName(blog.name);
    setPlatform(blog.platform);
    setNiche(blog.niche);
    setKeywords(blog.targetKeywords.join(", "));
    setWriteDelay(blog.defaultWriteDelaySec);
    setPublishDelay(blog.defaultPublishDelaySec);
    setOllamaModel(blog.ollamaModel || "qwen2.5:7b");
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedKeywords = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    if (editId) {
      // update
      const updated = blogs.map((b) =>
        b.id === editId
          ? {
              ...b,
              name,
              platform,
              niche,
              targetKeywords: parsedKeywords.length > 0 ? parsedKeywords : [niche],
              defaultWriteDelaySec: writeDelay,
              defaultPublishDelaySec: publishDelay,
              ollamaModel,
            }
          : b
      );
      onUpdateBlogs(updated);
    } else {
      // create
      const newBlog: BlogItem = {
        id: `blog_${Date.now()}`,
        name,
        platform,
        niche,
        targetKeywords: parsedKeywords.length > 0 ? parsedKeywords : [niche],
        todayPostCount: 0,
        totalPostCount: 0,
        defaultWriteDelaySec: writeDelay,
        defaultPublishDelaySec: publishDelay,
        ollamaModel,
        isActive: true,
        topicAiPrompt: "",
        writerAiPrompt: "",
        analyticsAiPrompt: "",
      };
      onUpdateBlogs([...blogs, newBlog]);
      onSelectBlog(newBlog.id);
    }

    setIsEditing(false);
    setEditId(null);
  };

  const handleDeleteBlog = (id: string) => {
    if (blogs.length <= 1) {
      alert("최소 1개 이상의 블로그가 유지되어야 합니다.");
      return;
    }
    const updated = blogs.filter((b) => b.id !== id);
    onUpdateBlogs(updated);
    if (selectedBlogId === id) {
      onSelectBlog(updated[0].id);
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = blogs.map((b) =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    );
    onUpdateBlogs(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>다중 블로그 채널 관리 센터</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold">
                  총 {blogs.length}개 운영 중
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                각 블로그별로 독립된 3단 AI (주제 AI, 글쓰기 AI, 분석 AI) 파이프라인을 운영합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 flex-1">
          {isEditing ? (
            /* Add / Edit Form */
            <form onSubmit={handleSaveForm} className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-sm text-white">
                  {editId ? "블로그 설정 수정" : "새 블로그 채널 추가"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  취소
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">블로그 이름 / 식별 별칭</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 티스토리 1호점 (재테크)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">대상 플랫폼</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as BlogPlatform)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="tistory">티스토리 (Tistory) - 애드센스 최적화</option>
                    <option value="naver">네이버 블로그 (Naver) - 검색 유입/애드포스트</option>
                    <option value="wordpress">워드프레스 (WordPress) - REST API 자동 연동</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">특화 주제 / 타겟 카테고리 (주제 AI가 실시간 모니터링)</label>
                <input
                  type="text"
                  required
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="예: 2026 청년지원금 및 세무 절세 전략"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">핵심 타겟 키워드 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="청년월세지원, 종합소득세, ISA 계좌 혜택"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>기본 글쓰기 대기 (초)</span>
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="86400"
                    value={writeDelay}
                    onChange={(e) => setWriteDelay(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-center font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 block">긴급 글은 10초로 자동 단축</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>기본 발행 대기 (초)</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="86400"
                    value={publishDelay}
                    onChange={(e) => setPublishDelay(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-center font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 block">검수 및 안전 발행 간격</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    <span>전담 Ollama 모델</span>
                  </label>
                  <select
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="qwen2.5:7b">Qwen 2.5 (한국어 추천)</option>
                    <option value="llama3.1:8b">Llama 3.1</option>
                    <option value="exaone3.5:7.8b">EXAONE 3.5</option>
                    <option value="deepseek-r1:8b">DeepSeek R1</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-600/30"
                >
                  저장 완료
                </button>
              </div>
            </form>
          ) : (
            /* Blog List */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="font-semibold text-slate-400">등록된 블로그 채널</span>
                <button
                  onClick={handleStartCreate}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 블로그 추가</span>
                </button>
              </div>

              {blogs.map((b) => {
                const isSelected = b.id === selectedBlogId;
                const platformBadge =
                  b.platform === "tistory"
                    ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                    : b.platform === "naver"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-blue-500/20 text-blue-300 border-blue-500/30";

                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-slate-800/80 border-cyan-500 shadow-lg shadow-cyan-500/10"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        onClick={() => onSelectBlog(b.id)}
                        className="cursor-pointer flex-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white hover:text-cyan-300 transition-colors">
                            {b.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${platformBadge}`}
                          >
                            {b.platform.toUpperCase()}
                          </span>
                          {b.isActive ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono">
                              ● 자동화 활성
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                              일시 정지
                            </span>
                          )}
                        </div>

                        <p className="text-slate-400 text-xs mt-1">
                          <span className="text-slate-500">카테고리:</span> {b.niche}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            글쓰기 대기 {b.defaultWriteDelaySec}s
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-purple-400" />
                            발행 대기 {b.defaultPublishDelaySec}s
                          </span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <Bot className="w-3 h-3 text-emerald-400" />
                            {b.ollamaModel || "qwen2.5:7b"}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleToggleActive(b.id)}
                          title={b.isActive ? "자동화 일시정지" : "자동화 재개"}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                            b.isActive
                              ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                              : "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {b.isActive ? "일시정지" : "가동하기"}
                        </button>
                        <button
                          onClick={() => handleStartEdit(b)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                          title="수정"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(b.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            블로그를 선택하면 해당 블로그의 3대 AI 파이프라인으로 전환됩니다.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
