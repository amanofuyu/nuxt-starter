import { getMockCurrentUser } from '#server/mocks/user'

export async function getCurrentUserProfile() {
  return getMockCurrentUser()
}
