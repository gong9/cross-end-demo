const jsonSchema = {
  scene: 0,
  scenes: [
    {
      nodeIndex: ['1', '2', '5'],
      private: {
        backgroundColor: '#ccc',
      },
    },
  ],
  nodes: [
    {
      name: '相机',
      id: '1',
      type: 'camera',
      projectionMode: 'perspective',
      attributes: {
        postion: [0, 20, 10],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      private: {
        fov: 45,
        aspect: 1,
        near: 0.1,
        far: 1000,
      },
    },
    {
      name: '灯光',
      id: '2',
      type: 'light',
      lightMode: 'ambient',
      private: {
        color: [], // rgb
        intensity: 1, // 光照强度
      },
    },
    {
      name: '汽车',
      id: '5',
      type: 'model',
      source: 'https://xxx.com/xxx.gltf',
      attributes: {
        postion: [10, 0, 0],
        rotation: [0, 0, 0],
        scale: [3, 3, 3],
      },
      private: {
        lookat: [0, 10, 10],
        exterior: {
          material: {
            materialId: '1', // 材质ID
            materialAttributes: {
              texture: 0, // 纹理ID
            },
          },
        },
      },
    },
  ],
  textures: [
    {
      name: 'demo 纹理',
      id: '1',
      source: 'https://xxx.com/xxx.png',
    },
  ],
  materials: [
    {
      name: '基础材质',
      id: '1',
      type: 'MeshBasicMaterial',
    },
  ],
  animations: [],
  events: [],
  version: '0.0.1',
}

export default jsonSchema
