import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const FilterSkill = dynamic(() => import('~/containers/filter-page/filter-page.container'), {
  ssr: false,
})

const FilterSkillPage = (props) => {
  const router = useRouter()
  const skillName = router.query.filterSkillName

  return <FilterSkill skillName={skillName} />
}
export default FilterSkillPage
