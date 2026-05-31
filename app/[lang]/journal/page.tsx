export const dynamic = "force-dynamic";
export default function Journal() {
  return (
    <div className="max-w-md mx-auto text-center py-24">
      <h1 className="text-2xl font-semibold tracking-tight">거래일지</h1>
      <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed">거래일지는 비공개 섹션입니다.<br />계좌·매매 기록은 공개 사이트에 포함되지 않습니다.</p>
    </div>
  );
}
