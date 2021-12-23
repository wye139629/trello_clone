import { SearchForm } from './../shared/SearchForm'
import tw from 'twin.macro'
import { faChevronDown, faBell, faUser } from 'lib/fontawsome/icons'
import { Icon } from 'components/shared'

const Button = tw.button`rounded border-0 bg-transparent py-[6px] px-[10px] cursor-pointer text-white hover:bg-gray-200/30`

function Navbar() {
  return (
    <nav css={tw`flex px-[6px] py-[8px] bg-black/50 text-white items-center`}>
      <div>
        <a href="./">
          <Button>Willo</Button>
        </a>
      </div>
      <div css={tw`px-2`}>
        <Button>
          <span>工作區</span>
          <Icon name={faChevronDown} css={tw`ml-[8px]`} />
        </Button>
      </div>
      <div css={tw`ml-auto flex items-center space-x-2`}>
        <div css={tw`w-64`}>
          <SearchForm />
        </div>
        <Button>
          <Icon name={faBell} size="lg" />
        </Button>
        <button
          css={tw`bg-cyan-500 rounded-full border-0 cursor-pointer w-[32px] h-[32px]`}
        >
          <Icon name={faUser} css={tw`text-lg text-sky-900`} />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
