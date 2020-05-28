import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import {localStorageKey} from 'utils/api-client'
import {AppProviders} from 'context'
import {App} from 'app'

beforeEach(() => queryCache.clear())

test('renders all the book information', async () => {
  const user = buildUser()
  window.localStorage.setItem(localStorageKey, 'SOME_FAKE_TOKEN')

  const book = buildBook()
  const route = `/book/${book.id}`
  window.history.pushState({}, 'Test page', route)

  let originalFetch = window.fetch
  window.fetch = async (url, config) => {
    if (url.endsWith('/me')) {
      return {ok: true, json: async () => ({user})}
    } else if (url.endsWith('/list-items')) {
      return {ok: true, json: async () => ({listItems: []})}
    } else if (url.endsWith(`/books/${book.id}`)) {
      return {ok: true, json: async () => ({book})}
    }
    return originalFetch(url, config)
  }

  render(<App />, {wrapper: AppProviders})

  await waitFor(() => {
    if (queryCache.isFetching) {
      throw new Error('The react-query queryCache is still fetching')
    }
    if (screen.queryByLabelText(/loading/i) || screen.queryByText(/loading/i)) {
      throw new Error('App loading indicators are still running')
    }
  })

  expect(screen.getByText(book.title)).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByLabelText(/add to list/i)).toBeInTheDocument()

  expect(screen.queryByLabelText(/remove from list/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/mark as read/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/mark as unread/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/notes/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})
