import { PublicProfile } from "@/components/profile/PublicProfile";

type Params = {
  id?: string;
  value?: string;
};

function extractUserId(p: Params): string | null {
  const raw = p.id ?? p.value;
  if (!raw) return null;

  // Хэрвээ raw нь шууд "cmjk..." байвал
  if (!raw.trim().startsWith("{")) return raw;

  // Хэрвээ raw нь "{\"id\":\"cmjk...\"}" гэсэн JSON string байвал
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "id" in parsed) {
      return String((parsed as any).id);
    }
  } catch {
    //
  }
  return raw;
}

export default async function Page({
                                     params,
                                   }: {
  params: Params | Promise<Params>;
}) {
  const p = await Promise.resolve(params); // ✅ Next 15 async params fix
  const userId = extractUserId(p);

  if (!userId) {
    return <div className="p-6 text-red-600">UserId олдсонгүй</div>;
  }

  return <PublicProfile userId={userId} />;
}
