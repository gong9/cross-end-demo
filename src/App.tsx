import React, { useEffect, useMemo, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { GLTFExporter } from '@anov/3d/examples/jsm/exporters/GLTFExporter.js'
import type { Scene } from '@anov/3d'
import parse from './parse'
import jsonSchema from './schema'
import { download } from './download'

const exporter = new GLTFExporter()

const App = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [schema, setSchema] = useState(jsonSchema)
  const schemaString = useMemo(() => JSON.stringify(schema, null, 2), [schema])
  let scene: Scene | null = null

  const handleParse = () => {
    const target = canvasRef.current!
    if (target.children.length > 0)
      target.removeChild(target.children[0])

    scene = parse(schema, target)
  }

  useEffect(() => {
    handleParse()
  }, [])

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

  const run = () => {
    handleParse()
  }

  const exportGltf = () => {
    exporter.parse(
      scene,
      (gltf) => {
        download(JSON.stringify(gltf, null, 2), 'scene.gltf')
      },
      (error) => {
        console.error(error)
      },
      {},
    )
  }

  return (
    <div className='flex relative'>
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
      <div className='absolute top-1 left-[34%] '>
        <button onClick={run} className="w-[100] h-[40] text-sm/3 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 mr-3">执行</button>
        <button onClick={exportGltf} className="w-[100] h-[40] text-sm/3 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">导出GLTF</button>
      </div>
    </div>
  )
}

export default App
