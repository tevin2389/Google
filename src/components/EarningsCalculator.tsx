import React, { useState } from "react";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Eye, 
  HelpCircle,
  Award,
  CheckCircle2
} from "lucide-react";

export const EarningsCalculator: React.FC = () => {
  const [dailyPosts, setDailyPosts] = useState(3);
  const [accumulatedDays, setAccumulatedDays] = useState(60);
  const [visitorsPerPost, setVisitorsPerPost] = useState(40);
  const [ctr, setCtr] = useState(2.2); // CTR 2.2%
  const [cpcWon, setCpcWon] = useState(1200); // 1,200 KRW
  const [affiliateMonthlyExtra, setAffiliateMonthlyExtra] = useState(250000); // 쿠팡파트너스/제휴

  // Calculations
  const totalPosts = dailyPosts * accumulatedDays;
  const totalDailyVisitors = totalPosts * visitorsPerPost;
  const dailyClicks = Math.round(totalDailyVisitors * (ctr / 100));
  const dailyAdsenseWon = dailyClicks * cpcWon;
  const monthlyAdsenseWon = dailyAdsenseWon * 30;
  const monthlyTotalWon = monthlyAdsenseWon + affiliateMonthlyExtra;
  const yearlyTotalWon = monthlyTotalWon * 12;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <DollarSign className="w-3.5 h-3.5" />
            <span>블로그 머니 파이프라인 시뮬레이션</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            블로그 자동화 예상 수익 계산기
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            매일 꾸준히 자동화 봇을 돌렸을 때 애드센스와 제휴마케팅으로 매달 통장에 찍히는 현실적인 수익을 계산합니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>내 운영 환경 입력</span>
            </h3>

            {/* Daily Posts */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">하루 자동 발행 글 수</span>
                <span className="text-emerald-400 font-bold text-sm">{dailyPosts}편</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={dailyPosts}
                onChange={(e) => setDailyPosts(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1편 (안전)</span>
                <span>3편 (권장)</span>
                <span>10편 (공격적)</span>
              </div>
            </div>

            {/* Accumulated Days */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">자동화 봇 누적 가동 기간</span>
                <span className="text-emerald-400 font-bold text-sm">{accumulatedDays}일 (총 {totalPosts}개 글)</span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={accumulatedDays}
                onChange={(e) => setAccumulatedDays(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>15일</span>
                <span>60일 (2개월)</span>
                <span>180일 (6개월)</span>
              </div>
            </div>

            {/* Visitors per Post */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">글 1편당 일일 평균 유입자</span>
                <span className="text-emerald-400 font-bold text-sm">{visitorsPerPost}명</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={visitorsPerPost}
                onChange={(e) => setVisitorsPerPost(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10명 (롱테일)</span>
                <span>40명 (일반)</span>
                <span>100명+ (이슈/트렌드)</span>
              </div>
            </div>

            {/* CTR */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">광고 클릭률 (CTR)</span>
                <span className="text-emerald-400 font-bold text-sm">{ctr}%</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="5.0"
                step="0.1"
                value={ctr}
                onChange={(e) => setCtr(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1.0% (기본)</span>
                <span>2.2% (서식 최적화)</span>
                <span>4.0% (전면/상단 배치)</span>
              </div>
            </div>

            {/* CPC */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">평균 클릭당 단가 (CPC)</span>
                <span className="text-emerald-400 font-bold text-sm">{cpcWon.toLocaleString()}원 (약 ${(cpcWon / 1400).toFixed(2)})</span>
              </div>
              <input
                type="range"
                min="300"
                max="5000"
                step="100"
                value={cpcWon}
                onChange={(e) => setCpcWon(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>500원 (일반)</span>
                <span>1,200원 (재테크/지원금)</span>
                <span>4,000원+ (대출/보험/IT)</span>
              </div>
            </div>

            {/* Extra Affiliate */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">쿠팡파트너스/제휴마케팅 월 추가 예상액</span>
                <span className="text-emerald-400 font-bold text-sm">{affiliateMonthlyExtra.toLocaleString()}원</span>
              </div>
              <input
                type="range"
                min="0"
                max="1500000"
                step="50000"
                value={affiliateMonthlyExtra}
                onChange={(e) => setAffiliateMonthlyExtra(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Projected Revenue Cards */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/50 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>예상 월 수익 결과</span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {monthlyTotalWon.toLocaleString()} <span className="text-xl font-bold text-emerald-400">원 / 월</span>
              </div>
              <p className="text-xs text-slate-400">
                연간 예상 누적 수입: 약 <span className="text-emerald-300 font-bold">{Math.round(yearlyTotalWon / 10000).toLocaleString()}만원</span>
              </p>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block">일일 총 예상 방문자</span>
                <span className="text-base font-bold text-white">{totalDailyVisitors.toLocaleString()}명</span>
              </div>
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block">일일 예상 광고 클릭수</span>
                <span className="text-base font-bold text-emerald-400">{dailyClicks.toLocaleString()}회</span>
              </div>
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block">월 애드센스 순수익</span>
                <span className="text-base font-bold text-white">{monthlyAdsenseWon.toLocaleString()}원</span>
              </div>
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block">월 제휴/쿠팡 수익</span>
                <span className="text-base font-bold text-amber-400">{affiliateMonthlyExtra.toLocaleString()}원</span>
              </div>
            </div>

            {/* Growth Roadmap */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 text-xs">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>현실적인 수익화 3단계 로드맵</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-white">1단계 (1~30일차)</strong>: 고단가 정보성 글 30~50편 축적 & 애드센스 승인 신청
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-white">2단계 (30~60일차)</strong>: 윈도우 무인 봇 가동 (매일 2~3편 자동 발행), 일 방문자 1,000명 돌파, 월 30~50만원 달성
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-white">3단계 (90일차 이후)</strong>: 누적 포스팅 200편 이상 복리 효과, 검색 상위 노출 굳히기, 월 100~300만원 자동화 달성
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
