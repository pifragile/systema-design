#version 300 es
precision highp float;

#pragma glslify: cnoise = require(glsl-noise/classic/3d) 

#pragma glslify: pnoise = require(glsl-noise/periodic/3d) 

#pragma glslify: snoise = require(glsl-noise/simplex/3d) 
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d) 

#pragma glslify: hsv2rgb = require(glsl-y-hsv/hsv2rgb) 
#pragma glslify: rgb2hsv = require(glsl-y-hsv/rgb2hsv)

const int num = 16;
uniform sampler2D buffer;
uniform vec2 dims;
uniform float time;
uniform float seed;
uniform float rects[num * 4];
uniform float speeds[num];
uniform float zooms[num];
uniform float dirs[num * 2];
uniform float dup[2];
in vec2 vTexCoord;

out vec4 fragColor;
const float gr = 0.618f;
const float gri = 1.0f - gr;

float rect(vec4 inp, vec2 position) {
  vec4 rect = vec4(inp.x, inp.y, inp.x + inp.z, inp.y + inp.w);
  vec2 hv = step(rect.xy, position) * step(position, rect.zw);
  float onOff = hv.x * hv.y;
  return onOff;
}

vec2 zoom(vec2 zoomPoint, float zoomFactor, vec2 pos) {
  return zoomPoint + round((zoomFactor * (pos - zoomPoint)) * 10.0f) / 10.0f;
}

vec2 rectCenter(vec4 rect) {
  return vec2(rect.x + 0.5f * rect.z, rect.y + 0.5f * rect.w);
}

vec2 modN(vec2 inp, vec2 m) {
  vec2 result = mod(inp, m);
  // if(all(lessThan(result, vec2(0.0f))))
  //   result += m;

  if(result.x < 0.0) result.x += m.x;
  if(result.y < 0.0) result.y += m.y;
  return result;
}

vec2 shiftRect(vec2 pos, vec4 r, vec2 dir, float speed) {
  float inRect = rect(r, pos);
  if(inRect > 0.0f) {
    vec2 offset = pos - r.xy + dir * vec2(speed);
    offset = modN(offset, r.zw);
    //offset += sin(time * 0.0001f) * 0.01f;
    return r.xy + offset;
  }
  return pos;
}

vec2 zoomRect(vec4 r, float zoomFactor, vec2 pos) {
  float inRect = rect(r, pos);
  if(inRect > 0.0f) {
    vec2 zoomPoint = rectCenter(r);
    return zoomPoint + zoomFactor * (pos - zoomPoint);
  }
  return pos;
}

vec2 shiftRects(vec2 pos) {
  vec2 result = pos;
  float count = 0.0;
  for(int i = 0; i < num; i++) {
    vec4 r = vec4(rects[i * 4], rects[i * 4 + 1], rects[i * 4 + 2], rects[i * 4 + 3]);

    count += rect(r, pos);
    if(count == 2.0) break;
    //r = vec4(0.5, 0.5, 0.2, 0.2);
    //vec4 r = vec4(0.5,0.5, 0.1, 0.1);
    float speed = speeds[i];
    vec2 dir = vec2(dirs[i * 2], dirs[i * 2 + 1]);

    if(mod(float(i), 2.0) == 0.0) {
      result = zoomRect(r, zooms[i], result); }
    else {
      result = shiftRect(result, r, dir, speed); }
  }
  result = modN(result, vec2(1.0f));
  return result;
}

void main() {
  vec2 pos = vTexCoord;
  pos.y = 1.0f - pos.y;
  vec2 newPos = shiftRects(pos);
  //newPos = zoom(vec2(0.5), 1.0 + mod(time * 0.01, 1.0), newPos);
  //fragColor = filterFun(newPos);
  if(distance(pos, newPos) > 0.01) newPos = pos + (newPos - pos) * 0.01;
  fragColor = texture(buffer, newPos, 0.0f);
  if(dup[0] != 0.0) {
  fragColor = mod(fragColor + texture(buffer, modN(newPos + vec2(dup[0], dup[1]), vec2(1.0)), 0.0f), 2.0);
  }

}