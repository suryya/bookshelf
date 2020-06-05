// 🐨 you're going to need the key to use for storing the user's token in
// localStorage.
// 💰 const localStorageKey = '__bookshelf_token__'

// 💰 in the final version, I destructure the customConfig like this:
//   {data, headers: customHeaders, ...customConfig}
async function client(endpoint, customConfig = {}) {
  // Ignore this... It's the *only* thing we need to do thanks to the way we
  // handle fetch requests with the service worker. In your apps you shouldn't
  // need to have something like this.
  await window.__bookshelf_serverReady

  // 🐨 get the user's token from localStorage
  // 💰 window.localStorage.getItem(localStorageKey)

  const config = {
    // 🐨 if we were passed data, then let's default the method to 'POST' instead of a 'GET'
    method: 'GET',
    // 🐨 if we were passed data, then set the body to JSON.stringify(data), otherwise it should be undefined
    // 🐨 create a headers property
    //   🐨 the "Authorization" header should be `Bearer ${token}` if there's a token (otherwise it should be undefined)
    //   🐨 the "Content-Type" header should be 'application/json' if there's data (otherwise it should be undefined)
    //   🐨 spread the rest of the headers we were passed
    ...customConfig,
  }
  // 🐨 if customConfig.body, then set the body to JSON.stringify(customConfig.body)
  // 💰 this is a helpful feature of our custom client so people don't have to
  // stringify their request bodies themselves.

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async response => {
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}

// 🐨 export the localStorageKey because our auth-client needs it.
export {client}
