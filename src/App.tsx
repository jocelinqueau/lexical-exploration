import { useState } from "react";
import Editor from "./Editor"

function App() {
  const [viewModel, setViewModel] = useState(null);

  return (
    <>
      <div>
        <h1>hello</h1>
        <Editor
          onChange={setViewModel}
        />
        <pre>{JSON.stringify(viewModel, null, 2)}</pre>
      </div>
    </>
  )
}

export default App
