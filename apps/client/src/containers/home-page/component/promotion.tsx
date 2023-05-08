import { PromoteCard } from "./promoteCard";

export interface Promotion { }

export default function Promotion({ listCard }) {
  return (
    <div className="container mx-auto">
      <p className="block pt-8 text-3xl font-semibold text-white">Ume</p>
      <div className="grid gap-6 mt-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        {listCard.map((card) => (
          <PromoteCard />
        ))}
      </div>
    </div>
  )
}
