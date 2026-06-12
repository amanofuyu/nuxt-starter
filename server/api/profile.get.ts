import { getCurrentUserProfile } from '#server/queries/user'
import { userProfileResponseSchema } from '#shared/api/schemas'

interface ProfileEvent {
  node?: {
    res?: {
      setHeader: (name: string, value: string) => void
    }
  }
}

export default async function profileHandler(event: ProfileEvent) {
  event.node?.res?.setHeader('cache-control', 'no-store')
  const profile = await getCurrentUserProfile()
  return userProfileResponseSchema.parse(profile)
}
