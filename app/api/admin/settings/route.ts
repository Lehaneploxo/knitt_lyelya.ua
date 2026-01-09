import { NextResponse } from 'next/server'

function getStoredCredentials() {
  if (typeof global !== 'undefined' && (global as any).adminCredentials) {
    return (global as any).adminCredentials
  }
  return {
    login: 'admin',
    password: 'admin123',
    email: 'admin@example.com'
  }
}

export async function GET() {
  try {
    const credentials = getStoredCredentials()
    const settings = {
      notificationEmail: credentials.email,
      adminLogin: credentials.login,
      adminPassword: credentials.password,
    }
    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
