import * as React from 'react'

import PromoteCard from './promoteCard'

export interface Promotion {}

export default function Promotion({ listCard }) {
  return (
    <div className="container mx-auto">
      <p className="text-white block font-semibold text-3xl pt-8">Ume</p>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-10 mt-12">
        {listCard.map((card) => (
          <PromoteCard card={card} />
        ))}
      </div>
    </div>
  )
}
