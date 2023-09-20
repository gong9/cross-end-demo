import { useEffect, useMemo, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import parse from './parse'
import jsonSchema from './schema'

const App = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [schema, setSchema] = useState(jsonSchema)
  const schemaString = useMemo(() => JSON.stringify(schema, null, 2), [schema])

  useEffect(() => {
    const target = canvasRef.current!
    if (target.children.length > 0)
      target.removeChild(target.children[0])

    parse(schema, target)
  }, [schema])

  const handleChange = (value: string | undefined) => {
    if (value) {
      try {
        const parsed = JSON.parse(value)
        setSchema(parsed)
      }
      catch (e) {
        console.error(e)
      }
    }
  }

  return (
     <div style={{ display: 'flex' }}>
        <Editor
          height="100vh"
          width="50vw"
          defaultLanguage="json"
          defaultValue={schemaString}
          theme='vs-dark'
          onChange={handleChange}
          options={
            {
              minimap: {
                enabled: false,
              },
            }
          }
       />
       <div ref={canvasRef} style={{ height: '100vh', width: '50vw' }}/>
     </div>
  )
}

export default App
