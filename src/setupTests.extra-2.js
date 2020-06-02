// allow tests to mock the implementation of window.fetch
beforeEach(() => jest.spyOn(window, 'fetch'))
afterEach(() => window.fetch.mockRestore())

// general cleanup
afterEach(() => {
  window.localStorage.clear()
})
