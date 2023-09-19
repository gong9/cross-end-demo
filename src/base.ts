const baseShader = /* glsl */`

uniform vec2 resolution; 
uniform vec3 color; 
uniform sampler2D texture; 

void main() {
    vec2 uv = gl_FragCoord.xy / resolution; 
    vec4 texColor = texture(texture, uv); 

    vec3 modifiedColor = color;
    gl_FragColor = vec4(modifiedColor * texColor.rgb, texColor.a);
}
`

export default baseShader
