import { NextResponse } from 'next/server';
import { db } from '@/app/_lib/server/db';
import { getCurrentSessionUser } from '@/app/_lib/server/auth';

type UserAnalyticsRow = {
  id: number;
  username: string;
  created_at: string;
  total_events: number;
  first_event_at: string | null;
  last_event_at: string | null;
};

export async function GET() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const userCountRows = await db<Array<{ total: number }>>`
    SELECT COUNT(*)::int AS total
    FROM public.app_users;
  `;

  const analyticsRows = await db<UserAnalyticsRow[]>`
    SELECT
      u.id,
      u.username,
      u.created_at::text,
      COUNT(e.id)::int AS total_events,
      MIN(e.created_at)::text AS first_event_at,
      MAX(e.created_at)::text AS last_event_at
    FROM public.app_users u
    LEFT JOIN public.analytics_events e ON e.user_id = u.id
    GROUP BY u.id, u.username, u.created_at
    ORDER BY u.created_at DESC;
  `;

  return NextResponse.json({
    ok: true,
    requestedBy: user.username,
    totalUsers: userCountRows[0]?.total ?? 0,
    users: analyticsRows,
  });
}
