import React from 'react';
import { FC, useState } from 'react'
import RedditPostFetcher from './RedditPostFetcher';

const App: FC<{}> = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
  <RedditPostFetcher/>
    </div>
  )
}

export default App
