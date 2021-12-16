import styled from '@emotion/styled'

const Headline = styled.div({
  color: 'blue',
})

function App() {
  return (
    <Headline
      css={{
        fontSize: '30px',
        color: 'red',
      }}
    >
      hello
    </Headline>
  )
}

export default App
