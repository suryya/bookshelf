import {queryCache} from 'react-query'
import {server, rest} from 'test/server'
import {client, localStorageKey, apiURL} from '../api-client'

jest.mock('react-query')

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  const result = await client(endpoint)

  expect(result).toEqual(mockResult)
})

test('adds auth token when a token is in localStorage', async () => {
  const token = 'FAKE_TOKEN'
  window.localStorage.setItem(localStorageKey, token)

  let request
  const endpoint = 'test-endpoint'
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(null))
    }),
  )

  await client(endpoint)

  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})

test('allows for config overrides', async () => {
  let request
  const endpoint = 'test-endpoint'
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(null))
    }),
  )

  const customConfig = {
    mode: 'cors',
    headers: {'Content-Type': 'fake-type'},
  }

  await client(endpoint, customConfig)

  expect(request.mode).toBe(customConfig.mode)
  expect(request.headers.get('Content-Type')).toBe(
    customConfig.headers['Content-Type'],
  )
})

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  let request
  const endpoint = 'test-endpoint'
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(null))
    }),
  )
  const data = {a: 'b'}
  await client(endpoint, {data})

  expect(request.body).toEqual(data)
})

test('automatically logs the user out if a request returns a 401', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(401), ctx.json(mockResult))
    }),
  )

  const error = await client(endpoint).catch(e => e)

  expect(error.message).toMatchInlineSnapshot(`"Please re-authenticate."`)

  expect(queryCache.clear).toHaveBeenCalledTimes(1)
  expect(window.localStorage.getItem(localStorageKey)).toBe(null)
})

test(`correctly rejects the promise if there's an error`, async () => {
  const testError = {message: 'Test error'}
  const endpoint = 'test-endpoint'
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(400), ctx.json(testError))
    }),
  )

  const error = await client(endpoint).catch(e => e)

  expect(error).toEqual(testError)
})
