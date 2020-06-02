# Unit Testing

## Background

In every application, you'll have functions that you find yourself using
throughout the application. These types of functions are perfect for unit
testing. Whether it's a function to format a user object to their display name,
or a utility to compute the scroll position of an element in a list, extracting
this complex logic to a utility function and testing it in isolation can be
really helpful.

But it's not just "pure functions" that can benefit from unit testing. Any code
that's heavily relied upon is a good candidate for unit testing. Keep in mind
that not everything needs a unit test. Most of your code can be covered by good
component/integration tests. Rather than thinking about getting all your code
covered by unit tests, think about
[covering your use cases](https://kentcdodds.com/blog/how-to-know-what-to-test).

## Exercise

Production deploys:

- [Exercise](https://exercises-11-unit-tests.bookshelf.lol/exercise)
- [Final](https://exercises-11-unit-tests.bookshelf.lol/)

In this exercise, we've got two utilities that we're going to unit test. The
first is a very simple `formatDate` function, and the other is the API `client`
function.

The `formatDate` function (part of the `src/utils/misc.js` module) is a pure
function and doesn't have much logic to it, start with that one to get warmed
up.

The `client` function is a bit more complicated because it makes an HTTP request
with `window.fetch` which we don't want to actually perform in our tests. So
you'll need to provide a mock implementation for `window.fetch` for your tests.
It also interacts with `localStorage` (to get the user's token), so you'll need
to interact with `localStorage` in your test (and don't forget to cleanup!).

### Files

- `src/utils/__tests__/misc.js`
- `src/utils/__tests__/api-client.js`

## Extra Credit

### 1. 💯 Test failure cases

[Production deploy](https://exercises-11-unit-tests.bookshelf.lol/extra-1)

There are two use cases that our `client` supports that we should probably cover
in our tests:

1. If the `response.ok` is `false`, the promise is rejected with the data
   returned from the server.
2. If the `response.status` is `401` (Unauthorized), we log the user out and
   clear the cache and localStorage.

For this extra credit, you'll need to write tests for both of those cases. The
first one should be more straightforward. The second one will be a bit more
tricky because you'll want to assert that `queryCache.clear` was called.

> 💰 use `jest.mock` to mock the `react-query` module.

**Files:**

- `src/utils/__tests__/api-client.js`

### 2. 💯 Use `setupTests.js`

[Production deploy](https://exercises-11-unit-tests.bookshelf.lol/extra-2)

Most of our tests are going to need the `window.fetch` to be mockable, and we
probably want to clear out _all_ of `localStorage` between _every_ test rather
than just the `token` key between tests in our `api-client.js` test.

Luckily for us, we already have jest configured to automatically require the
file `src/setupTests.js`. (Check the `jest.config.js` file and look at the
`setupFilesAfterEnv` config). So all we need to do now is move that setup from
the `src/utils/__tests__/api-client.js` to the `src/setupTests.js` file and then
all of our tests will benefit from the same setup automatically.

> 💰 you can clear _all_ of local storage with `window.localStorage.clear()`

**Files:**

- `src/utils/__tests__/api-client.js`
- `src/setupTests.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=11%3A%20Unit%20Testing&em=
