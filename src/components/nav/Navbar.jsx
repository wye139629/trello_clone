import tw from 'twin.macro'

import { faChevronDown, faBell, faUser } from 'lib/fontawsome/icons'
import { Icon, SearchForm } from 'components/shared'
import {
  Menu,
  MenuList as ReachMenuList,
  MenuButton as ReactMenuBtn,
  MenuItem as ReachMenuItem,
} from '@reach/menu-button'
import { useAuth } from 'context/authContext'

const Button = tw.button`rounded border-0 bg-transparent py-[6px] px-[10px] cursor-pointer text-white hover:bg-gray-200/30`

const MenuButton = tw(
  ReactMenuBtn
)`bg-cyan-500 rounded-full border-0 cursor-pointer w-[32px] h-[32px]`
const MenuList = tw(ReachMenuList)`w-[300px] mt-[10px]`
const MenuItem = tw(ReachMenuItem)`hover:text-black hover:bg-gray-300`

function Navbar() {
  const { logout } = useAuth()

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
        <Menu>
          <MenuButton>
            <Icon name={faUser} css={tw`text-lg text-sky-900`} />
          </MenuButton>
          <MenuList>
            <div css={tw`px-[10px] mb-[10px] relative`}>
              <h4 css={tw`text-center border-b pb-[8px]`}>帳號</h4>
            </div>
            <MenuItem onSelect={logout}>登出</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </nav>
  )
}

export default Navbar
