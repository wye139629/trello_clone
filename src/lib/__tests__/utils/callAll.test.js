import { callAll } from 'lib/utils/callAll'

test('should call all the arguments func when call the retun value', () => {
  const mockFnA = jest.fn(() => {})
  const mockFnB = jest.fn(() => {})

  const callback = callAll(mockFnA, mockFnB)
  callback()

  expect(mockFnA.mock.calls.length).toBe(1)
  expect(mockFnB.mock.calls.length).toBe(1)
})
