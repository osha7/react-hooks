// // useEffect: persistent state
// // http://localhost:3000/isolated/exercise/02.js

// import * as React from 'react'

// function Greeting({initialName = ''}) {
//   // 🐨 initialize the state to the value from localStorage
//   // 💰 window.localStorage.getItem('name') ?? initialName
//   const [name, setName] = React.useState(window.localStorage.getItem('name') ?? initialName)

//   // 🐨 Here's where you'll use `React.useEffect`.
//   // The callback should set the `name` in localStorage.
//   // 💰 window.localStorage.setItem('name', name)

//   const updatedName = React.useEffect(() => {window.localStorage.setItem('name', name)}) // side effect 

//   function handleChange(event) {
//     setName(event.target.value)
//   }
//   return (
//     <div>
//       <form>
//         <label htmlFor="name">Name: </label>
//         <input value={name} onChange={handleChange} id="name" />
//       </form>
//       {name ? <strong>Hello {name}</strong> : 'Please type your name'}
//     </div>
//   )
// }

// function App() {
//   return <Greeting initialName='osha' />
// }

// export default App

// // ---------------------------------------------------------------------------------------------
// //  extra credit - LAZY STATE (lazy initialization)
// // ---------------------------------------------------------------------------------------------


// import * as React from 'react'

// function Greeting({initialName = ''}) {
// // console.log('rendering')
// //   function getInitialNameValue() {
// //     console.log('getInitialNameValue')

// //     return window.localStorage.getItem('name') ?? initialName
// //   }

//   const [name, setName] = React.useState(() => window.localStorage.getItem('name') ?? initialName)// only called for initial value now

//   React.useEffect(() => {window.localStorage.setItem('name', name)}) // side effect 

//   function handleChange(event) {
//     setName(event.target.value)
//   }
//   return (
//     <div>
//       <form>
//         <label htmlFor="name">Name: </label>
//         <input value={name} onChange={handleChange} id="name" />
//       </form>
//       {name ? <strong>Hello {name}</strong> : 'Please type your name'}
//     </div>
//   )
// }

// function App() {
//   return <Greeting initialName='osha' />
// }

// export default App

// // ---------------------------------------------------------------------------------------------
// //  extra credit - EFFECT DEPENDENCIES
// // ---------------------------------------------------------------------------------------------


// import * as React from 'react'

// function Greeting({initialName = ''}) {
// console.log('rendering greeting')

//   const [name, setName] = React.useState(() => window.localStorage.getItem('name') ?? initialName)// only called for initial value now

//   React.useEffect(() => {
//     console.log('calling useEffect')
//     window.localStorage.setItem('name', name)
//   }, [name]) // side effect 

//   function handleChange(event) {
//     setName(event.target.value)
//   }
//   return (
//     <div>
//       <form>
//         <label htmlFor="name">Name: </label>
//         <input value={name} onChange={handleChange} id="name" />
//       </form>
//       {name ? <strong>Hello {name}</strong> : 'Please type your name'}
//     </div>
//   )
// }

// function App() {
//   const [count, setCount] = React.useState(0)
//   return <><button onClick={() => setCount(count + 1)}>{count}</button><Greeting initialName='osha' /></>
// }

// export default App


// // ---------------------------------------------------------------------------------------------
// //  extra credit - CUSTOM HOOK
// // ---------------------------------------------------------------------------------------------


// import * as React from 'react'

// function useLocalStorageWithState(key, defaultValue) { // CUSTOM HOOK (function that uses other hooks inside of it, whether react hooks or other custom hooks)
//     const [state, setState] = React.useState(() => window.localStorage.getItem(key) ?? defaultValue)

//   React.useEffect(() => {
//     console.log('calling useEffect')
//     window.localStorage.setItem(key, state)
//   }, [key, state])

//   return [key, setState]
// }

// function Greeting({initialName = ''}) {
//   console.log('rendering greeting')

//   const [name, setName] = useLocalStorageWithState('name', initialName)

//   function handleChange(event) {
//     setName(event.target.value)
//   }

//   return (
//     <div>
//       <form>
//         <label htmlFor="name">Name: </label>
//         <input value={name} onChange={handleChange} id="name" />
//       </form>
//       {name ? <strong>Hello {name}</strong> : 'Please type your name'}
//     </div>
//   )
// }

// function App() {
//   const [count, setCount] = React.useState(0)
//   return <><button onClick={() => setCount(count + 1)}>{count}</button><Greeting initialName='osha' /></>
// }

// export default App




// ---------------------------------------------------------------------------------------------
//  extra credit - FLEXIBLE LOCAL STORAGE HOOK
// ---------------------------------------------------------------------------------------------


import * as React from 'react'

// function useLocalStorageWithState(key, defaultValue = '') { // CUSTOM HOOK (function that uses other hooks inside of it, whether react hooks or other custom hooks)
//   const [state, setState] = React.useState(() => {
//       const valueInLocalStorage = window.localStorage.getItem(key)
//       if (valueInLocalStorage) {
//         return JSON.parse(valueInLocalStorage)
//       }
//       return defaultValue
//   })

function useLocalStorageWithState(key, defaultValue = '', {
  serialize = JSON.stringify,
  deserialize = JSON.parse,
} = {}) { 
  const [state, setState] = React.useState(() => {
      const valueInLocalStorage = window.localStorage.getItem(key)
      if (valueInLocalStorage) {
        return deserialize(valueInLocalStorage)
      }
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key) // don't want to trigger re-render


  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageWithState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  const [count, setCount] = React.useState(0)
  return <><button onClick={() => setCount(count + 1)}>{count}</button><Greeting initialName='osha' /></>
}

export default App