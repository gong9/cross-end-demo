import type { Group } from '@anov/3d'
import { AmbientLight, Color, MeshStandardMaterial, ModelLoader, SRGBColorSpace, SceneControl, TextureLoader, Vector3, use } from '@anov/3d'
import type SchemaType from './type'
import type { NodeType, PrivatePropType } from './type'

// const { useScene } = use
const modelLoader = new ModelLoader()
const loader = new TextureLoader()
let globalSchema: SchemaType | null = null

const vec3 = (data: number[]) => {
  const [x, y, z] = data
  return new Vector3(x, y, z)
}

const initScene = (configs: PrivatePropType, target: HTMLDivElement) => {
  const scene = new SceneControl({
    orbitControls: true,
    rendererOps: {
      size: {
        width: target.clientWidth,
        height: target.clientHeight,
      },
    },
  })
  scene.render(target)
  scene.startFrameAnimate()

  const { backgroundColor } = configs
  scene.scene!.background = backgroundColor ? new Color(backgroundColor) : null

  return scene
}

const putCamera = (curNode: NodeType, scene: SceneControl) => {
  const { projectionMode, attributes } = curNode

  if (projectionMode === 'projectionMode') {
    const camera = scene.camera!

    camera.position.copy(vec3((attributes?.postion || [0, 0, 0])))
    camera.scale.copy(vec3((attributes?.scale || [1, 1, 1])))

    const { fov, aspect, near, far } = curNode.private || {}

    camera.fov = fov || 45
    camera.aspect = aspect || 1
    camera.near = near || 0.1
    camera.far = far || 1000
  }
}

const putLight = (curNode: NodeType, scene: SceneControl) => {
  const { lightMode } = curNode

  if (lightMode === 'ambient') {
    const { color = new Color('#fff'), intensity = 1 } = curNode.private || {}
    const light = new AmbientLight(
      color,
      intensity,
    )

    scene.add(light)
  }
}

interface MaterialType {
  materialId: string
  materialAttributes?: {
    texture?: string
  }
}

// 示例，简单完成
const handleModelMaterial = (material: MaterialType, modelScene: Group) => {
  if (material.materialAttributes?.texture) {
    const textureId = material.materialAttributes.texture
    const textureSource = globalSchema?.textures.find(texture => texture.id === textureId)?.source
    const texture = loader.load(textureSource!)

    texture.colorSpace = SRGBColorSpace

    const currentMaterial = new MeshStandardMaterial({
      map: texture,
    })

    modelScene.traverse((child) => {
      if (child.type === 'Mesh')
        (child as any).material = currentMaterial
    })
  }
}

const putModel = (curNode: NodeType, scene: SceneControl) => {
  const { source } = curNode
  const src = source!

  const modelStyle = src.split('.').pop()

  if (modelStyle === 'glb' || modelStyle === 'gltf') {
    modelLoader.loadGLTF(src).then((gltf) => {
      const modelScene = gltf.scene
      const { attributes } = curNode

      modelScene.position.copy(vec3((attributes?.postion || [0, 0, 0])))
      modelScene.scale.copy(vec3((attributes?.scale || [1, 1, 1])))

      if (curNode.private?.exterior?.material)
        handleModelMaterial(curNode.private.exterior.material, modelScene as Group)

      scene.add(modelScene)
    })
  }
}

const putIntoScene = (curNode: NodeType, scene: SceneControl) => {
  const { type } = curNode

  switch (type) {
    case 'camera':
      putCamera(curNode, scene)
      break

    case 'light':
      putLight(curNode, scene)
      break

    case 'model':
      putModel(curNode, scene)
      break
    default:
      break
  }
}

const addNodes = (currentSceneNodes: string[], nodes: NodeType[], scene: SceneControl) => {
  for (let i = 0; i < currentSceneNodes.length; i++) {
    const curNode = nodes.find(node => node.id === currentSceneNodes[i])

    if (curNode)
      putIntoScene(curNode, scene)
  }
}

const parse = (schema: SchemaType, target: HTMLDivElement) => {
  const currentScene = schema.scenes[schema.scene]
  globalSchema = schema

  if (currentScene) {
    const sceneConfigs = currentScene.private || {}
    const sceneManage = initScene(sceneConfigs, target)
    const currentSceneNodes = currentScene.nodeIndex

    currentSceneNodes.length > 0 && addNodes(currentSceneNodes, schema.nodes, sceneManage)

    return sceneManage.scene
  }

  return null
}

export default parse
