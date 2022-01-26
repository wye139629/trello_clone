import tw, { css } from 'twin.macro'

import { Icon, Spinner } from 'components/shared'
import { faChevronLeft, faChevronRight, faPlus } from 'lib/fontawsome/icons'
import { useQuery } from 'react-query'
import { client } from 'lib/api/client'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

const activeStyle = css`
  position: relative;
  transform: translateX(0);
`

const inActive = css`
  height: 100%;
  width: 260px;
  background-color: white;
  position: absolute;
  transform: translateX(-100%);
  transition: transform 0.2s;
`

const Button = tw.button`rounded border-0 bg-transparent w-[32px] h-[32px] cursor-pointer hover:bg-gray-200/80`

SideNav.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
}

function SideNav({ isOpen, toggleOpen }) {
  const { isLoading, data: boards } = useQuery({
    queryKey: 'boards',
    queryFn: () =>
      client('boards').then((res) => {
        return res.data
      }),
  })

  return (
    <nav css={[inActive, isOpen && activeStyle]}>
      <div css={tw`w-full`}>
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
        <div css={tw`pt-[12px]`}>
          <section>
            <div css={tw`flex items-center pl-[14px] pr-[6px] py-[4px]`}>
              <h4>你的看板</h4>
              <Button css={tw`ml-auto`}>
                <Icon name={faPlus} size="sm"></Icon>
              </Button>
            </div>
            <ul>
              {isLoading ? (
                <Spinner />
              ) : (
                boards.map((board) => (
                  <BoardLink key={board.id} id={board.id} title={board.title} />
                ))
              )}
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
    </nav>
  )
}

BoardLink.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}

function BoardLink({ id, title }) {
  return (
    <li css={tw`bg-sky-100 hover:bg-gray-200/50`}>
      <NavLink
        to={`/board/${id}`}
        css={tw`flex items-center px-[15px] py-[4px] space-x-2`}
      >
        <div css={tw`w-[24px] h-[20px] bg-orange-800 rounded-sm`}></div>
        <span>{title}</span>
      </NavLink>
    </li>
  )
}

export default SideNav
