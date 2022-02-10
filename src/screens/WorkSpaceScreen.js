import tw, { styled } from 'twin.macro'

import Navbar from 'components/nav/Navbar'
import { Modal, ModalOpenBtn, ModalContent } from 'components/shared'
import { BoardCreate } from 'components/kanban/BoardCreate'
import { colorTypes } from 'lib/data/colors'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { client } from 'lib/api/client'
import { FullPageSpinner } from 'components/shared'
import PropTypes from 'prop-types'

const Container = styled.main`
  height: calc(100vh - 52px);
  padding-top: 50px;
  background-color: rgba(211, 211, 211, 0.1);
`

const cardStyle = tw`rounded w-full md:w-[200px] h-[100px] my-[15px] md:mx-[10px]`

BoardCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
}

function BoardCard({ id, title, color }) {
  return (
    <Link to={`/board/${id}`}>
      <div css={[tw`p-[10px]`, cardStyle, colorTypes[color]]}>
        <h3 css={tw`text-white font-bold truncate`}>{title}</h3>
      </div>
    </Link>
  )
}

export function WorkSpaceScreen() {
  const { isLoading, data: boards } = useQuery({
    queryKey: 'boards',
    queryFn: () =>
      client('/boards').then((res) => {
        return res.data
      }),
  })

  if (isLoading) return <FullPageSpinner />

  return (
    <>
      <Navbar />
      <Container>
        <div css={tw`max-w-screen-lg mx-auto px-[20px]`}>
          <h3 css={tw`text-lg text-sky-900 font-bold`}>工作區看板</h3>
          <div css={tw`md:flex md:flex-wrap md:mx-[-10px]`}>
            {boards.map(({ id, title, color }) => (
              <BoardCard key={id} id={String(id)} title={title} color={color} />
            ))}
            <Modal>
              <ModalOpenBtn>
                <div
                  css={[
                    cardStyle,
                    tw`cursor-pointer text-sm text-center bg-gray-200`,
                  ]}
                >
                  <span css={tw`leading-[100px]`}>建立新的看板</span>
                </div>
              </ModalOpenBtn>
              <ModalContent
                aria-label="Create board"
                css={tw`px-[30px] pb-[20px] h-[400px]`}
              >
                <BoardCreate />
              </ModalContent>
            </Modal>
          </div>
        </div>
      </Container>
    </>
  )
}
