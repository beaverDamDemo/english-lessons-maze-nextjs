import { NextResponse } from 'next/server';
import { getCurrentSessionUser } from '@/app/_lib/server/auth';

export async function GET() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return NextResponse.json({ ok: true, authenticated: false, user: null });
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    user,
  });
}
