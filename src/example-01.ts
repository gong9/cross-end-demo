import { Color, ModelLoader, SRGBColorSpace, SceneControl, ShaderMaterial, TextureLoader, Vector3, use } from '@anov/3d'

const modelLoader = new ModelLoader()

const texture = new TextureLoader().load('crate.gif')
texture.colorSpace = SRGBColorSpace

const sceneControl = new SceneControl({
  orbitControls: true,
  ambientLight: true,
  defCameraOps: {
    position:
        new Vector3(0, 20, 10),
  },
  background: {
    color: new Color('#ccc'),
  },
})

modelLoader.loadGLTF('./car.glb').then((gltf) => {
  gltf.scene.lookAt(0, 10, 10)
  gltf.scene.scale.set(3, 3, 3)
  gltf.scene.position.set(10, 0, 0)

  gltf.scene.traverse((child) => {
    if (child.type === 'Mesh') {
      const material = new ShaderMaterial({
        uniforms: {
          texture1: { value: texture },
          color: {
            value: new Color('#ccc'),
          },
        },
        fragmentShader: /* glsl */` 
          uniform vec2 resolution; 
          uniform vec3 color; 
          uniform sampler2D texture1; 

          void main() {
            vec2 uv = gl_FragCoord.xy / resolution; 
            vec4 texColor = texture(texture1, uv); 

            vec3 modifiedColor = color;
            gl_FragColor = vec4(modifiedColor, 1.);
}`,
      });
      (child as any).material = material
    }
  })
  sceneControl.add(gltf.scene)
})

sceneControl.render(document.querySelector('#app') as HTMLElement)
sceneControl.startFrameAnimate()
