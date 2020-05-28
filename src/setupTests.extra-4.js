import '@testing-library/jest-dom'
import {server} from 'test/server'
import {queryCache} from 'react-query'

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// general cleanup
afterEach(() => {
  window.localStorage.clear()
  queryCache.clear()
})
