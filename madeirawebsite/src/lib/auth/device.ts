// src/lib/auth/device.ts
import { cookies } from 'next/headers'
import { type RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

const DEVICE_ID_COOKIE = 'device_id'

export async function getDeviceId(): Promise<string> {
  const cookieStore = await cookies()
  const deviceIdCookie: RequestCookie | undefined = cookieStore.get(DEVICE_ID_COOKIE)

  if (!deviceIdCookie?.value) {
    const newDeviceId = crypto.randomUUID()
    
    cookieStore.set({
      name: DEVICE_ID_COOKIE,
      value: newDeviceId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 // 1 año
    })
    
    return newDeviceId
  }

  return deviceIdCookie.value
}

export async function clearDeviceId(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(DEVICE_ID_COOKIE)
}