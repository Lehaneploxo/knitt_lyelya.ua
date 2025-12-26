'use client'

import dynamic from 'next/dynamic'

const NextStudio = dynamic(() => import('next-sanity/studio').then(mod => mod.NextStudio), {
  ssr: false,
  loading: () => <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '24px'
  }}>Завантаження Sanity Studio...</div>
})

export default function StudioPage() {
  const config = {
    name: 'default',
    title: 'Designer Bags UA Admin',
    projectId: 'alskls9k',
    dataset: 'production',
    basePath: '/studio',
    plugins: [],
    schema: { types: [] },
  }

  return <NextStudio config={config} />
}
