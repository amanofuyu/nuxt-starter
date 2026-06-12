import type { UserProfile } from '#shared/types/user'

const user: UserProfile = {
  id: 'user_demo_1',
  name: '林夏',
  email: 'linxia@example.com',
  plan: 'Starter Member',
  joinedAt: '2026-06-04',
  preferences: ['新品提醒', '轻量动效', '中文文档'],
}

export async function getMockCurrentUser(): Promise<UserProfile> {
  return user
}
