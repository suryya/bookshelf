import React from 'react'
import {
  render,
  screen,
  waitForLoadingToFinish,
  userEvent,
} from 'test/app-test-utils'
import {buildBook} from 'test/generate'
import * as booksDB from 'test/data/books'
import {formatDate} from 'utils/misc'
import {App} from 'app'

test('renders all the book information', async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`

  await render(<App />, {route})

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

test('can create a list item for the book', async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`

  await render(<App />, {route})

  const addToListButton = screen.getByLabelText(/add to list/i)
  userEvent.click(addToListButton)
  expect(addToListButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(await screen.findByLabelText(/mark as read/i)).toBeInTheDocument()
  expect(await screen.findByLabelText(/remove from list/i)).toBeInTheDocument()
  expect(screen.queryByLabelText(/add to list/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/unmark as read/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/1 star/i)).not.toBeInTheDocument()
  expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
  const startDateNode = screen.getByLabelText(/start date/i)
  expect(startDateNode).toHaveTextContent(formatDate(Date.now()))
})
