// Receives the franchise inquiry form and forwards it to INQUIRY_WEBHOOK_URL
// (e.g. a Slack incoming webhook, Google Apps Script, or a CRM endpoint).
// Without that env var the form reports an error and points people to phone/KakaoTalk,
// so no inquiry is silently dropped.

type Inquiry = {
  name: string;
  phone: string;
  email: string;
  type: string;
  message: string;
};

const TYPES = new Set(["가맹 문의", "제휴 문의"]);

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }

  const inquiry: Inquiry = {
    name: clean(body.name, 40),
    phone: clean(body.phone, 20),
    email: clean(body.email, 120),
    type: clean(body.type, 20),
    message: clean(body.message, 2000),
  };

  if (!inquiry.name || !/^[0-9\-\s]{9,14}$/.test(inquiry.phone) || !TYPES.has(inquiry.type) || !inquiry.message) {
    return Response.json({ error: "필수 항목을 확인해 주세요." }, { status: 400 });
  }
  if (body.agree !== "on") {
    return Response.json({ error: "개인정보 수집·이용에 동의해 주세요." }, { status: 400 });
  }

  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  if (!webhook) {
    return Response.json({ error: "지금은 온라인 문의 접수가 준비 중이에요." }, { status: 503 });
  }

  const text = [
    `[펌프아케이드 ${inquiry.type}]`,
    `성함: ${inquiry.name}`,
    `연락처: ${inquiry.phone}`,
    `이메일: ${inquiry.email || "-"}`,
    `내용: ${inquiry.message}`,
  ].join("\n");

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, ...inquiry, receivedAt: new Date().toISOString() }),
  }).catch(() => null);

  if (!res || !res.ok) {
    return Response.json({ error: "문의 전송 중 문제가 생겼어요." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
