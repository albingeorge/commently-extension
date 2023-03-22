# Commently browser extension

Lets users add comments on websites

## MVP plan

- Lets users add comments on websites
- Data is stored in an IndexDB in browser, meaning data won't be transfered on different devices used by the user

### Functionalities

- Add comment on a URL
- Delete comment on a URL
- List all URLs on which comments are added
- Delete all comments on a particular URL
- When user visits a webpage, notify the user that a comment has been added on the current URL

## First release

- Publish addon to Firefox([Reference](https://extensionworkshop.com/documentation/publish/))
- Lets user choose whether to store data on the cloud or locally
- If user decides to store the data online:
  - Supports Google login
  - Storing data in an external application based on user id
  - Syncronisation of data across devices
