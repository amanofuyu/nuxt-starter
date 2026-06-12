import { getCurrentUserProfile } from '#server/queries/user'
import { getLocaleFromEvent } from '#server/utils/locale'
import { userProfileResponseSchema } from '#shared/api/schemas'

interface ProfileEvent {
  node?: {
    req?: {
      url?: string
    }
    res?: {
      setHeader: (name: string, value: string) => void
    }
  }
}

export default async function profileHandler(event: ProfileEvent) {
  event.node?.res?.setHeader('cache-control', 'no-store')
  const locale = getLocaleFromEvent(event)
  const profile = await getCurrentUserProfile(locale)
  return userProfileResponseSchema.parse(profile)
}
