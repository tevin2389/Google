import React from "react";
import { 
  X, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign, 
  Zap, 
  Flame, 
  Cpu, 
  ExternalLink 
} from "lucide-react";

interface MonetizationPlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonetizationPlaybookModal: React.FC<MonetizationPlaybookModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                블로그 자동화 월 100~300만원 수익화 필승 비법서
              </h3>
              <p className="text-xs text-slate-400">
                초보자가 가장 많이 하는 실수와 상위 1% 블로거들의 실전 운영 가이드
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
              <Flame className="w-5 h-5" />
              <span>1. 자동화 봇 운영 시 '저품질' 피하는 절대 원칙</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <p>
                <strong>핵심 1: 포스팅 간격은 최소 2시간 이상!</strong><br />
                1분에 10개씩 연속으로 올리면 네이버/구글 알고리즘이 매크로 스팸으로 판단하여 검색 노출을 차단합니다. 
                AutoBlog Pro 윈도우 봇처럼 <strong>3시간(180분)마다 1편씩 자연스럽게 발행</strong>하는 것이 안전합니다.
              </p>
              <p>
                <strong>핵심 2: 무의미한 복사/붙여넣기 글은 금물</strong><br />
                AI가 쓴 티가 너무 나는 단순 텍스트는 검색 순위가 밀립니다. 본 서비스에서 생성되는 것처럼 
                <strong>H2/H3 소제목 구조, 테이블 요약표, FAQ 문답, 강조 박스</strong>가 들어간 양질의 체류시간 확보형 글이어야 수익이 극대화됩니다.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <DollarSign className="w-5 h-5" />
              <span>2. 고수익(고CPC) 키워드란 무엇인가?</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <p>
                연예인 가십거리나 단순 일상은 하루 1만 명이 들어와도 클릭당 단가가 50원~100원에 불과합니다.<br />
                반면 <strong>금융(대출, 카드, 보험), 정부지원금(청년도약계좌, 근로장려금), 세무/절세, IT/가전기기</strong>는 
                클릭 1번에 <strong>1,500원 ~ 6,000원($4+)</strong>이 통장에 들어옵니다.
              </p>
              <p className="text-emerald-300 font-semibold">
                👉 상단의 '고수익 키워드' 탭에서 분석된 황금 키워드 위주로 포스팅을 누적하세요!
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
              <Cpu className="w-5 h-5" />
              <span>3. 윈도우 PC에서 24시간 안정적으로 돌리는 설정법</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <p>
                <strong>윈도우 절전 모드 해제:</strong><br />
                윈도우 시작 버튼 우클릭 &gt; [전원 및 절전] &gt; [전원 모드: 절전 모드로 전환 안 함]으로 설정해 두면 
                모니터 화면만 꺼두어도 본체에서 봇이 밤새 쉬지 않고 글을 포스팅합니다.
              </p>
              <p>
                <strong>워드프레스 vs 티스토리:</strong><br />
                - <strong>워드프레스</strong>: 공식 REST API가 열려 있어 윈도우 봇에서 100% 무인 자동 발행이 가장 완벽하게 작동합니다.<br />
                - <strong>티스토리/네이버</strong>: 봇이 생성해둔 HTML 파일을 더블클릭하여 복사 후 바로 붙여넣기만 하면 3초 만에 1편 포스팅 완성!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
          >
            확인했습니다 (닫기)
          </button>
        </div>
      </div>
    </div>
  );
};
