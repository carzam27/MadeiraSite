// src/lib/auth/device.ts
'use client'

import { v4 as uuidv4 } from 'uuid' // Necesitarás instalar: npm install uuid @types/uuid

const DEVICE_ID_KEY = 'device_id'

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  
  if (!deviceId) {
    deviceId = uuidv4()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  
  return deviceId
}

export function clearDeviceId(): void {
  localStorage.removeItem(DEVICE_ID_KEY)
}