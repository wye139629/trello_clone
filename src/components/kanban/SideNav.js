import tw, { styled, css } from 'twin.macro'

import { Icon, Modal, ModalOpenBtn, ModalContent } from 'components/shared'
import { BoardCreate } from './BoardCreate'
import { faChevronLeft, faChevronRight, faPlus } from 'lib/fontawsome/icons'
import { useQueryClient } from 'react-query'
import { NavLink } from 'react-router-dom'
import { colorTypes } from 'lib/data/colors'
import PropTypes from 'prop-types'
import { usePrefetchboard } from '../../lib/hooks'

const Nav = styled.nav(({ isOpen }) => [
  css`
    height: 100%;
    width: 260px;
    background-color: rgba(255, 255, 255, 0.5);
    position: absolute;
    transform: translateX(-100%);
    transition: transform 0.2s;
  `,
  isOpen &&
    css`
      position: relative;
      transform: translateX(0);
    `,
])

const Button = tw.button`rounded border-0 bg-transparent w-[32px] h-[32px] cursor-pointer hover:bg-gray-200/80`

const linkActiveStyle = tw`bg-gray-200`

BoardLink.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

SideNav.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
}

function BoardLink({ id, title, color }) {
  const preFetchBoard = usePrefetchboard(id)

  return (
    <li css={tw`hover:bg-gray-500/30`} onMouseEnter={preFetchBoard}>
      <NavLink
        to={`/board/${id}`}
        css={tw`flex items-center px-[15px] py-[4px] space-x-2`}
        style={({ isActive }) => (isActive ? linkActiveStyle : undefined)}
      >
        <div
          css={[
            tw`w-[24px] h-[20px] bg-orange-800 rounded-sm`,
            css`
              flex-shrink: 0;
            `,
            colorTypes[color],
          ]}
        ></div>
        <span css={tw`truncate`}>{title}</span>
      </NavLink>
    </li>
  )
}

function SideNav({ isOpen, toggleOpen }) {
  const queryClient = useQueryClient()
  const boards = queryClient.getQueryData('boards')

  return (
    <Nav isOpen={isOpen}>
      <div css={tw`w-full `}>
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
          <Button css={tw`ml-auto`} onClick={toggleOpen}>
            <Icon name={faChevronLeft} size="sm"></Icon>
          </Button>
        </div>
        <div css={tw`pt-[12px] `}>
          <section>
            <div css={tw`flex items-center pl-[14px] pr-[6px] py-[4px]`}>
              <h4>你的看板</h4>
              <Modal>
                <ModalOpenBtn>
                  <Button css={tw`ml-auto`}>
                    <Icon name={faPlus} size="sm"></Icon>
                  </Button>
                </ModalOpenBtn>
                <ModalContent
                  aria-label="Create board"
                  css={tw`px-[30px] pb-[20px] h-[400px]`}
                >
                  <BoardCreate />
                </ModalContent>
              </Modal>
            </div>
            <ul>
              {boards.map(({ id, title, color }) => (
                <BoardLink
                  key={id}
                  id={String(id)}
                  title={title}
                  color={color}
                />
              ))}
            </ul>
          </section>
        </div>
      </div>
      <button
        css={[
          tw`h-full w-[16px] border border-black/30 absolute top-0 -right-4 bg-white/50 block hover:bg-gray-300/60 hover:[> span]:bg-white/80 hover:[> span]:text-gray-500`,
          isOpen && tw`hidden`,
        ]}
        onClick={toggleOpen}
      >
        <span
          css={[
            tw`rounded-full text-center w-[24px] h-[24px] bg-white/60 absolute top-4 -right-3 shadow-lg text-center text-white text-xs`,
            css`
              background-color: rgba(250, 251, 252, 0.3);
            `,
          ]}
        >
          <Icon name={faChevronRight} css={tw`leading-[24px]`} />
        </span>
      </button>
    </Nav>
  )
}

export default SideNav
