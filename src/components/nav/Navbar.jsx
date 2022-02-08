import tw from 'twin.macro'

import { faChevronDown, faBell } from 'lib/fontawsome/icons'
import { Icon, SearchForm, UserIcon } from 'components/shared'
import {
  Menu,
  MenuList as ReachMenuList,
  MenuButton,
  MenuItem as ReachMenuItem,
} from '@reach/menu-button'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from 'context/authContext'

const Button = tw.button`rounded border-0 bg-transparent py-[6px] px-[10px] cursor-pointer text-white hover:bg-gray-200/30`

const MenuList = tw(
  ReachMenuList
)`w-[300px] mt-[10px] flex flex-col space-y-[10px]`

const MenuItem = tw(ReachMenuItem)`hover:text-black hover:bg-gray-300`

function Navbar() {
  const { logout, user } = useAuth()
  const { pathname } = useLocation()
  const isRoot = pathname === '/'

  return (
    <nav
      css={[
        tw`flex px-[6px] py-[8px] text-white items-center`,
        isRoot ? tw`bg-sky-700` : tw`bg-black/50`,
      ]}
    >
      <div>
        <NavLink to="/">
          <Button>Willo</Button>
        </NavLink>
      </div>
      <div css={tw`px-2 min-w-[90px]`}>
        <Button>
          <span>工作區</span>
          <Icon name={faChevronDown} css={tw`ml-[8px]`} />
        </Button>
      </div>
      <div css={tw`ml-auto flex items-center space-x-2`}>
        <div css={tw`hidden sm:block w-64`}>
          <SearchForm />
        </div>
        <Button>
          <Icon name={faBell} size="lg" />
        </Button>
        <Menu>
          <MenuButton>
            <UserIcon />
          </MenuButton>
          <MenuList>
            <div css={tw`px-[10px] relative`}>
              <h4 css={tw`text-center border-b pb-[10px]`}>帳號</h4>
            </div>
            <div css={tw`px-[10px]`}>
              <div
                css={tw`flex items-center space-x-[10px] pb-[10px] border-b`}
              >
                <UserIcon />
                <p>{user.email}</p>
              </div>
            </div>
            <MenuItem onSelect={logout}>登出</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </nav>
  )
}

export default Navbar
