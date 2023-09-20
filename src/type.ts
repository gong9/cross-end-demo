export interface PrivatePropType {
  [k: string]: any
}

interface SceneItemType {
  nodeIndex: string[]
  private?: PrivatePropType
}

interface AttributesType {
  postion?: number[]
  rotation?: number[]
  scale?: number[]
}

export interface NodeType {
  name: string
  id: string
  type: string
  projectionMode?: string
  lightMode?: string
  attributes?: AttributesType
  private?: PrivatePropType
  source?: string
}

interface TexturesType {
  name: string
  id: string
  source: string
}

interface MaterialType {
  name: string
  id: string
  type: string
}

export default interface SchemaType {
  scene: number
  scenes: SceneItemType[]
  nodes: NodeType[]
  textures: TexturesType[]
  materials: MaterialType[]
  animations: PrivatePropType[]
  events: PrivatePropType[]
  version: string
}
