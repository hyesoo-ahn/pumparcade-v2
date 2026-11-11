"use client";

import { useRef, useState, type FormEvent } from "react";
import { KAKAO_URL, PHONE } from "./ui";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

const input =
  "w-full rounded-xl bg-surface border border-foreground/15 px-4 py-3 text-base text-foreground placeholder:text-foreground/30 outline-none focus:border-green transition-colors";

// Limited-offer counter shown above the form (update as spots fill)
const TAKEN = 5;
const TOTAL = 10;

// KakaoTalk speech-bubble symbol
function KakaoSymbol() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
      <path
        fill="#000"
        d="M12 3.2c-5.1 0-9.2 3.24-9.2 7.24 0 2.58 1.72 4.85 4.3 6.13l-.95 3.48c-.08.3.26.55.53.37l4.16-2.76c.38.04.77.06 1.16.06 5.1 0 9.2-3.24 9.2-7.24S17.1 3.2 12 3.2Z"
      />
    </svg>
  );
}

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const policyRef = useRef<HTMLDialogElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "문의 접수에 실패했어요.");
      form.reset();
      setStatus({ kind: "done" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "문의 접수에 실패했어요." });
    }
  }

  return (
    <section id="inquiry" className="bg-surface border-t border-foreground/10 scroll-mt-[72px]">
      <div className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24 grid gap-12 lg:grid-cols-[1fr_1.1fr] items-start">
        {/* Left: offer + direct contact */}
        <div>
          <p className="type-pixel text-red mb-4">LIMITED · 선착순 마감 임박</p>
          <h2 className="type-heading-pixel text-foreground mb-6">
            단 10개 지점에만 드리는
            <br />
            특별혜택
          </h2>

          {/* Pixel progress: spots taken */}
          <div className="flex gap-1.5 mb-3" aria-label={`${TOTAL}개 중 ${TAKEN}개 마감`}>
            {Array.from({ length: TOTAL }, (_, i) => (
              <span key={i} className={`h-5 flex-1 rounded ${i < TAKEN ? "bg-red" : "bg-foreground/10"}`} />
            ))}
          </div>
          <p className="text-base md:text-lg font-medium text-foreground/70 mb-10">
            현재 <span className="text-red">{TAKEN}/{TOTAL} 마감</span> — 남은 {TOTAL - TAKEN}개 지점 한정 혜택.
          </p>

          <div className="flex flex-col gap-3 max-w-sm text-base md:text-lg font-bold">
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              // KakaoTalk's standard button: #FEE500 yellow, black symbol, 85% black label
              className="flex items-center justify-between rounded-xl px-5 py-4 hover:brightness-95 transition"
              style={{ background: "#FEE500", color: "rgba(0, 0, 0, 0.85)" }}
            >
              <span className="flex items-center gap-2.5">
                <KakaoSymbol />
                카카오톡으로 문의
              </span>
              <span>↗</span>
            </a>
            <a
              href={`tel:${PHONE}`}
              className="flex items-center justify-between rounded-xl px-5 py-4 border border-foreground/25 text-foreground hover:border-green hover:text-green transition-colors"
            >
              <span><span className="font-toss">☎️</span> 고객센터 {PHONE}</span> <span>→</span>
            </a>
          </div>
        </div>

        {/* Right: form */}
        <form onSubmit={onSubmit} className="rounded-3xl bg-background border border-foreground/15 p-6 md:p-10">
          <p className="type-pixel text-green mb-2">퍼펙트한 창업 찬스!</p>
          <p className="type-pixel text-foreground mb-8">
            지금 상담하면 특별혜택 지원 및 1:1 맞춤 컨설팅!
          </p>

          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-foreground/70">성함 *</span>
              <input name="name" required maxLength={40} placeholder="성함" className={input} />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground/70">연락처 *</span>
                <input name="phone" required type="tel" inputMode="tel" pattern="[0-9\-\s]{9,14}" placeholder="010-1234-5678" className={input} />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground/70">이메일 (선택)</span>
                <input name="email" type="email" placeholder="example@gmail.com" className={input} />
              </label>
            </div>

            <fieldset className="grid gap-2">
              <legend className="text-sm font-semibold text-foreground/70 mb-2">문의 유형 *</legend>
              <div className="grid grid-cols-2 gap-2">
                {["가맹 문의", "제휴 문의"].map((type, i) => (
                  <label key={type} className="cursor-pointer">
                    <input type="radio" name="type" value={type} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="block text-center rounded-xl type-pixel px-4 py-3 border border-foreground/20 text-foreground/60 peer-checked:border-green peer-checked:text-green peer-checked:bg-green/10 peer-focus-visible:ring-2 peer-focus-visible:ring-green transition-colors">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-foreground/70">문의하실 내용 *</span>
              <textarea name="message" required rows={5} maxLength={2000} placeholder="창업 관련 궁금한 점을 남겨주세요" className={`${input} resize-y`} />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" name="agree" required className="w-4 h-4 accent-[#65ff1e]" />
                <span className="text-sm md:text-base font-medium text-foreground/80">개인정보 수집 및 이용에 동의합니다.</span>
              </label>
              <button
                type="button"
                onClick={() => policyRef.current?.showModal()}
                className="text-sm text-foreground/50 underline underline-offset-4 hover:text-foreground"
              >
                개인정보 수집·이용 방침 전문 보기
              </button>
            </div>

            <button
              type="submit"
              disabled={status.kind === "sending"}
              className="rounded-xl bg-green text-background type-pixel px-6 py-4 hover:brightness-110 transition disabled:opacity-60"
            >
              {status.kind === "sending" ? "보내는 중…" : "문의하기 →"}
            </button>

            <p aria-live="polite" className="text-sm md:text-base font-medium">
              {status.kind === "done" && <span className="text-green">문의가 접수되었어요. 빠르게 연락드릴게요!</span>}
              {status.kind === "error" && (
                <span className="text-red">
                  {status.message} 전화({PHONE}) 또는 카카오톡으로 문의해 주세요.
                </span>
              )}
            </p>
          </div>
        </form>
      </div>

      {/* Privacy policy (copied from pumparcade.com) */}
      <dialog
        ref={policyRef}
        className="m-auto w-[min(92vw,640px)] max-h-[80vh] bg-surface text-foreground border border-foreground/20 p-0 backdrop:bg-background/80"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/10">
          <p className="text-lg font-bold">개인정보처리방침</p>
          <button type="button" onClick={() => policyRef.current?.close()} aria-label="닫기" className="text-xl font-bold text-foreground/60 hover:text-foreground">
            ✕
          </button>
        </div>
        <div className="px-6 py-5 type-body text-foreground/80 space-y-4 overflow-y-auto">
          <p>(주)루미넥스(이하 &apos;회사&apos;)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 관련 고충을 신속·원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>
          <div>
            <p className="text-foreground">제1조 (개인정보의 처리목적)</p>
            <p>회사는 가맹·제휴 문의 확인 및 답변, 상담 연락, 처리결과 통보를 위하여 개인정보를 처리하며, 명시한 목적 외의 용도로는 이용하지 않습니다.</p>
          </div>
          <div>
            <p className="text-foreground">제2조 (처리하는 개인정보 항목)</p>
            <p>· 필수: 성함, 연락처, 문의 유형, 문의 내용</p>
            <p>· 선택: 이메일, 창업 희망 지역, 투자 가능 예산, 회사/기관명</p>
            <p>· 자동수집: 접속 IP, 쿠키, 서비스 이용기록</p>
          </div>
          <div>
            <p className="text-foreground">제3조 (보유 및 이용기간)</p>
            <p>수집·이용 동의일로부터 문의 처리 목적 달성 시까지 보유하며, 관계 법령에 따른 보존 필요 시 해당 기간 동안 보관합니다. (원칙적 보유기간 5년)</p>
          </div>
          <div>
            <p className="text-foreground">제4조 (개인정보의 제3자 제공)</p>
            <p>회사는 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.</p>
          </div>
          <div>
            <p className="text-foreground">제5조 (정보주체의 권리)</p>
            <p>정보주체는 언제든지 개인정보 열람·정정·삭제·처리정지를 요구할 수 있습니다.</p>
          </div>
          <div>
            <p className="text-foreground">제6조 (개인정보 보호책임자)</p>
            <p>· 상호: (주)루미넥스 · 대표: 박현재</p>
            <p>· 연락처: 1577-0126</p>
          </div>
          <p>본 방침은 2026년 7월 15일부터 적용됩니다.</p>
        </div>
      </dialog>
    </section>
  );
}
