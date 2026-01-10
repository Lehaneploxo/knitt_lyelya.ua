import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const banner1 = formData.get('banner1') as File | null
    const banner2 = formData.get('banner2') as File | null
    const instagramPostUrl = formData.get('instagramPostUrl') as string

    // Отримуємо існуючий документ або створюємо новий
    const existingDoc = await client.fetch('*[_type == "homePage"][0]')

    const updates: any = {
      instagramPostUrl: instagramPostUrl || null,
    }

    // Завантаження banner1
    if (banner1) {
      const buffer = Buffer.from(await banner1.arrayBuffer())
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: banner1.name,
      })
      updates.banner1 = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      }
    }

    // Завантаження banner2
    if (banner2) {
      const buffer = Buffer.from(await banner2.arrayBuffer())
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: banner2.name,
      })
      updates.banner2 = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      }
    }

    if (existingDoc) {
      // Оновлюємо існуючий документ
      await writeClient.patch(existingDoc._id).set(updates).commit()
    } else {
      // Створюємо новий документ
      await writeClient.create({
        _type: 'homePage',
        ...updates,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating home page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update home page' },
      { status: 500 }
    )
  }
}
