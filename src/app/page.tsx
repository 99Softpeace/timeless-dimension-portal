import React from 'react'
import ClientHomeWrapper from '@/components/ClientHomeWrapper'

export default function HomeWrapper() {
  return (
    <>
      {/* Server-rendered lightweight placeholder in case client bundle is delayed */}
      <section className="pt-20 text-center">
       
      </section>

      {/* Client-only interactive homepage */}
      <ClientHomeWrapper />
    </>
  )
}
