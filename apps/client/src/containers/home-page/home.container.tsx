import cardImg from 'public/profile.jpg'

import { StaticImageData } from 'next/image'

import Category from './component/category'
import Cover from './component/cover'
import { PromoteCard } from './component/promoteCard'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

interface listCardProps {
  id: number
  cardImg: StaticImageData
  nameCard: string
  rating?: number
  totalVote: number
  description?: string
  coin: number
  duration: number
}

const HomePage = (props) => {
  const ListCardDumbData: listCardProps[] = [
    {
      id: 1,
      cardImg: cardImg,
      nameCard: 'Name Card',
      rating: 4,
      totalVote: 20,
      description: 'description',
      coin: 2,
      duration: 1,
    },
    {
      id: 2,
      cardImg: cardImg,
      nameCard: 'Name Card',
      rating: 4,
      totalVote: 20,
      description: 'description',
      coin: 2,
      duration: 1,
    },
    {
      id: 3,
      cardImg: cardImg,
      nameCard: 'Name Card',
      rating: 4,
      totalVote: 20,
      description: 'description',
      coin: 2,
      duration: 1,
    },
    {
      id: 4,
      cardImg: cardImg,
      nameCard: 'Name Card',
      rating: 4,
      totalVote: 20,
      description: 'description',
      coin: 2,
      duration: 1,
    },
    {
      id: 5,
      cardImg: cardImg,
      nameCard: 'Name Card',
      rating: 4,
      totalVote: 20,
      description: 'description',
      coin: 2,
      duration: 1,
    },
    {
      id: 6,
      cardImg: cardImg,
      nameCard: 'Name Card',
      rating: 4,
      totalVote: 20,
      description: 'description',
      coin: 2,
      duration: 1,
    },
    {
      id: 7,
      cardImg: cardImg,
      nameCard: 'Name Card',
      rating: 4,
      totalVote: 20,
      description: 'description',
      coin: 2,
      duration: 1,
    },
    {
      id: 8,
      cardImg: cardImg,
      nameCard: 'Name Card',
      rating: 4,
      totalVote: 20,
      description: 'description',
      coin: 2,
      duration: 1,
    },
    {
      id: 9,
      cardImg: cardImg,
      nameCard: 'Name Card',
      rating: 4,
      totalVote: 20,
      description: 'description',
      coin: 2,
      duration: 1,
    },
    {
      id: 10,
      cardImg: cardImg,
      nameCard: 'Name Card',
      rating: 4,
      totalVote: 20,
      description: 'description',
      coin: 2,
      duration: 1,
    },
  ]
  return (
    <AppLayout {...props}>
      <div className="flex mx-16 flex-col">
        <Cover />
        <Category />
        <div className="container mx-auto">
          <p className="block pt-8 text-3xl font-semibold text-white">Ume</p>
          <div className="grid gap-6 mt-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
            {ListCardDumbData.map((card) => (
              <PromoteCard key={card.id} datas={card} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default HomePage
