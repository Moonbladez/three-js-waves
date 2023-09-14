uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vWaveElevation;

void main() {
    float mixStrength = clamp(vWaveElevation * uColorMultiplier + uColorOffset, 0.0, 1.0);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    gl_FragColor = vec4(color, 1.0);
}