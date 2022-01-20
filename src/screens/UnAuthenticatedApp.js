import tw, { styled } from 'twin.macro'

import { Modal, ModalOpenBtn, ModalContent, Spinner } from 'components/shared'
import { useAuth } from 'context/authContext'
import { useAsync } from 'lib/hooks'
import PropTypes from 'prop-types'

const buttonVairants = {
  primary: tw`bg-green-600`,
  secondary: tw`bg-gray-400`,
}

const Input = tw.input`px-2 py-2 border rounded border-gray-300`
const ColumnGroup = tw.div`flex flex-col`
const modalStyle = tw`w-[400px] px-[30px] py-[40px]`
const Button = styled.button(({ vairant }) => [
  tw`rounded-md text-[20px] w-[100px] h-[50px] text-white`,
  buttonVairants[vairant],
])

export function UnAuthenticatedApp() {
  const { login, register } = useAuth()

  return (
    <div css={tw`h-screen flex justify-center items-center`}>
      <div css={tw`text-center space-y-[10px]`}>
        <h1 css={tw`text-[80px] font-extrabold text-sky-700`}>Willo</h1>
        <div css={tw`space-x-[20px]`}>
          <Modal>
            <ModalOpenBtn>
              <Button vairant="primary">登入</Button>
            </ModalOpenBtn>
            <ModalContent aria-label="Login form" css={modalStyle}>
              <LoginForm onSubmit={login} action="登入" />
            </ModalContent>
          </Modal>
          <Modal>
            <ModalOpenBtn>
              <Button vairant="secondary">註冊</Button>
            </ModalOpenBtn>
            <ModalContent aria-label="Registration form" css={modalStyle}>
              <LoginForm onSubmit={register} action="註冊" />
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  )
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
}

function LoginForm({ onSubmit, action }) {
  const { isLoading, run, isError, errors } = useAsync()

  function onSubmitHandler(e) {
    e.preventDefault()
    const { email, password } = e.target.elements

    run(
      onSubmit({
        email: email.value,
        password: password.value,
      })
    )
  }
  return (
    <form css={tw`flex flex-col space-y-[20px]`} onSubmit={onSubmitHandler}>
      <h3 css={tw`text-center text-lg text-gray-500`}>{action} Willo</h3>
      <ColumnGroup>
        <Input type="text" name="email" placeholder="輸入信箱" />
      </ColumnGroup>
      <ColumnGroup>
        <Input type="password" name="password" placeholder="輸入密碼" />
      </ColumnGroup>
      <button css={tw`bg-green-600 rounded py-2 text-white text-center`}>
        {isLoading ? <Spinner /> : action}
      </button>
      {isError ? <p css={tw`text-red-500`}>{errors.message}</p> : null}
    </form>
  )
}
