import { Icon } from 'components/shared'
import { faChevronLeft, faPlus } from 'lib/fontawsome/icons'
import tw from 'twin.macro'

const Button = tw.button`rounded border-0 bg-transparent w-[32px] h-[32px] cursor-pointer hover:bg-gray-200/80`

function SideNav() {
  return (
    <nav css={tw`h-full w-[260px] bg-white`}>
      <div
        css={tw`flex items-center px-[10px] py-[12px] border-b border-gray-200`}
      >
        <div css={tw`w-[36px] h-[36px] bg-rose-800 rounded text-center`}>
          <span css={tw`leading-[36px] font-bold text-white`}>W</span>
        </div>
        <div css={tw`ml-2`}>
          <p css={tw`text-sm font-bold`}>Willo 工作區</p>
          <span css={tw`text-xs`}>免費</span>
        </div>
        <Button css={tw`ml-auto`}>
          <Icon name={faChevronLeft} size="sm"></Icon>
        </Button>
      </div>
      <div css={tw`pt-[12px]`}>
        <section>
          <div css={tw`flex items-center pl-[14px] pr-[6px] py-[4px]`}>
            <h4>你的看板</h4>
            <Button css={tw`ml-auto`}>
              <Icon name={faPlus} size="sm"></Icon>
            </Button>
          </div>
          <ul>
            <li css={tw`bg-sky-100 hover:bg-gray-200/50`}>
              <a
                href="#"
                css={tw`flex items-center px-[15px] py-[4px] space-x-2`}
              >
                <div css={tw`w-[24px] h-[20px] bg-orange-800 rounded-sm`}></div>
                <span>trello-clone</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </nav>
  )
}

export default SideNav
