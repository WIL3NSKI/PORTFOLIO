uniform sampler2D imageTexture;
uniform vec2 mousePosition;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  // Prosta logika do zniekształcania na podstawie pozycji myszy
  vec2 dist = uv - mousePosition;
  float effect = exp(-length(dist) * 10.0);
  uv += normalize(dist) * effect * 0.1;

  gl_FragColor = texture2D(imageTexture, uv);
}