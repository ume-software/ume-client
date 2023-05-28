import { PromoteCard } from './promoteCard'

export interface Promotion {}

export const Promotion = () => {
  let listProvider: FilterProviderResponse[] | undefined
  const { data: providers, isLoading: loadingProvider, isFetching } = trpc.useQuery(['booking.getProviders'])
  if (loadingProvider) {
    return <></>
  }
  listProvider = providers?.data?.row
  return (
    <div className="container mx-auto">
      <p className="block pt-8 text-3xl font-semibold text-white">Ume</p>
      <div className="grid gap-6 mt-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        {!isFetching &&
          listProvider?.map((provider) => (
            <PromoteCard
              id={provider?.id}
              image={provider?.avatarurl}
              name={provider?.name}
              rating={5}
              totalVote={5}
              description={provider.description}
              coin={provider.cost}
            />
          ))}
        {props.datas.map((card) => (
          <Link key={`/player/${card.id}`} href={`/player/${card.id}`}>
            <PromoteCard />
          </Link>
        ))}
      </div>
    </div>
  )
}
