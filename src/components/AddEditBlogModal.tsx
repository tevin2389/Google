import React, { useState, useEffect } from "react";
import { X, Globe, Sparkles, Check, Laptop } from "lucide-react";
import { BlogItem } from "../types";

interface AddEditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogToEdit?: BlogItem | null;
  onSave: (blog: BlogItem) => void;
}

export const AddEditBlogModal: React.FC<AddEditBlogModalProps> = ({
  isOpen,
  onClose,
  blogToEdit,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [targetAudience, setTargetAudience] = useState("미국/글로벌 영문 (High CPC AdSense)");
  const [defaultWriteDelaySec, setDefaultWriteDelaySec] = useState(10);
  const [defaultPublishDelaySec, setDefaultPublishDelaySec] = useState(60);
  const [ollamaModel, setOllamaModel] = useState("qwen2.5:7b");

  useEffect(() => {
    if (blogToEdit) {
      setName(blogToEdit.name);
      setNiche(blogToEdit.niche);
      setBlogUrl(blogToEdit.blogUrl || "");
      setTargetAudience(blogToEdit.targetAudience || "미국/글로벌 영문 (High CPC AdSense)");
      setDefaultWriteDelaySec(blogToEdit.defaultWriteDelaySec || 10);
      setDefaultPublishDelaySec(blogToEdit.defaultPublishDelaySec || 60);
      setOllamaModel(blogToEdit.ollamaModel || "qwen2.5:7b");
    } else {
      setName("");
      setNiche("");
      setBlogUrl("");
      setTargetAudience("미국/글로벌 영문 (High CPC AdSense)");
      setDefaultWriteDelaySec(10);
      setDefaultPublishDelaySec(60);
      setOllamaModel("qwen2.5:7b");
    }
  }, [blogToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !niche.trim()) return;

    const savedItem: BlogItem = {
      id: blogToEdit ? blogToEdit.id : `google-blog-${Date.now()}`,
      name: name.trim(),
      platform: "blogger",
      niche: niche.trim(),
      blogUrl: blogUrl.trim() || `https://${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.blogspot.com`,
      targetAudience: targetAudience.trim(),
      todayPostCount: blogToEdit ? blogToEdit.todayPostCount : 0,
      totalPostCount: blogToEdit ? blogToEdit.totalPostCount || 0 : 0,
      dailyGoal: blogToEdit?.dailyGoal || 5,
      defaultWriteDelaySec: Number(defaultWriteDelaySec) || 10,
      defaultPublishDelaySec: Number(defaultPublishDelaySec) || 60,
      ollamaModel: ollamaModel || "qwen2.5:7b",
      isActive: true,
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="modal-add-edit-blog"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {blogToEdit ? "구글 블로그 정보 수정" : "새 해외 타겟 구글 블로그 추가"}
              </h2>
              <p className="text-xs text-slate-400">
                Google Blogger (Blogspot) 전용 무인 3단 AI 파이프라인 채널
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Blog Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center justify-between">
              <span>블로그 이름 (Blog Name) *</span>
              <span className="text-[11px] text-slate-400 font-normal">표시용 타이틀</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: AI Tech Pulse & SaaS Reviews"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Topic / Niche */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center justify-between">
              <span>주제 (Topic / Niche) *</span>
              <span className="text-[11px] text-cyan-400 font-normal">AI 주제발굴 핵심 기준</span>
            </label>
            <input
              type="text"
              required
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="예: Generative AI tools, B2B SaaS reviews, Workflow Automation"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            <p className="text-[11px] text-slate-400">
              💡 해외 고단가 추천: <strong>AI SaaS 도구, 미국 배당 ETF/보험, 클라우드 보안, 원격 근무 기술</strong>
            </p>
          </div>

          {/* Blogger URL */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">
              구글 블로그 주소 (Blogspot URL)
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                placeholder="https://mytechhub.blogspot.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Delay Timers */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <label className="text-slate-300 text-xs font-semibold block">
                글쓰기 대기 시간 (초)
              </label>
              <input
                type="number"
                min={5}
                max={3600}
                value={defaultWriteDelaySec}
                onChange={(e) => setDefaultWriteDelaySec(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 font-mono text-xs focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">긴급 테스트 권장: 10초</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <label className="text-slate-300 text-xs font-semibold block">
                발행 대기 시간 (초)
              </label>
              <input
                type="number"
                min={10}
                max={7200}
                value={defaultPublishDelaySec}
                onChange={(e) => setDefaultPublishDelaySec(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 font-mono text-xs focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">품질 분석 후 발행: 60초</span>
            </div>
          </div>

          {/* Ollama Model Selection */}
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-slate-300 flex items-center justify-between">
              <span>기본 AI 모델 (Ollama / Cloud)</span>
              <span className="text-[11px] text-emerald-400 font-normal">영문 작성 최적화</span>
            </label>
            <select
              value={ollamaModel}
              onChange={(e) => setOllamaModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="qwen2.5:7b">Qwen 2.5 7B (글로벌 다국어 및 코딩 고성능)</option>
              <option value="llama3.1:8b">Llama 3.1 8B (원어민 영문 완벽 최적화)</option>
              <option value="deepseek-r1:8b">DeepSeek R1 8B (심층 논리 분석형)</option>
              <option value="gemma2:9b">Google Gemma 2 9B (구글 친화적 SEO 텍스트)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{blogToEdit ? "수정 완료" : "블로그 추가"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
