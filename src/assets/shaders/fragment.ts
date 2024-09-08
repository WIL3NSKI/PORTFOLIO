`uniform float time;
uniform sampler2D waterTexture;
uniform vec2 resolution;
uniform vec2 mousePosition;
uniform float chaseWaveStrength;// Deklaracja dodatkowego uniformu
varying vec2 vUv;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = vUv;
    vec2 dist = uv - mousePosition;
    float effect = exp(-length(dist) * 10.0);

    float n = noise(uv + time / 1000.0);
    uv += normalize(dist) * effect * 0.1;
    uv += 0.1 * vec2(n, n);

    // Zwiększony efekt fali pościgowej
    float chaseWave = sin(dist.x * 20.0 + time) * sin(dist.y * 20.0 + time) * chaseWaveStrength;
    uv += 0.05 * vec2(chaseWave, chaseWave);

    gl_FragColor = texture2D(waterTexture, uv);
}`