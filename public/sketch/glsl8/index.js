(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var glsl = require("glslify");
let pg;
let seed;
let buffer;
let img;
let prefix = "d_";

let csw, csh, csw2, csh2;

setupAfterSeed = () => {
    csw = windowWidth;
    csh = windowHeight;
    csw2 = csw * 0.5;
    csh2 = csh * 0.5;

    randomSeed(seed);
    noiseSeed(seed);
    setParams();
    createCanvas(csw, csh, WEBGL);
    noSmooth();
    setupShader();
    setPalette();
    pg = createGraphics(csw, csh, WEBGL);

    pg.setAttributes({ alpha: true });
    background(color(0.0, 0.0, 0.0, 0.0));
    pg.background(color(0.0, 0.0, 0.0, 0.0));
    //setAttributes({ alpha: true });
    palette = [pg.color(0, 0, 0, 255), pg.color(255, 255, 255, 0.0)];
    pixelDensity(1);
    pg.pixelDensity(1);
    pg.noSmooth();
    // pg.rectMode(CENTER);
    pg.noStroke();

    let g = 16;
    for (let i = 0; i < g * g; i++) {
        let x = i % g;
        let y = Math.floor(i / g);
        pg.fill(palette[(x + y) % palette.length]);
        //pg.fill(random(palette));
        let w = csw / g;
        let h = csh / g;
        pg.rect(x * w - csw2, y * h - csh2, w, h);
    }
    buffer = pg;
};

let rects;
let speeds;
let zooms;
let dirs;
let changeAfter;

function setParams() {
    rects = [];
    speeds = [];
    zooms = [];
    dirs = [];
    let f = () => random([1.0, -1.0]);
    let dirList = [
        [0.0, f()],
        [f(), 0.0],
    ];
    if (random() < 0.1) {
        dirList = [random(dirList)];
    }
    let speedDivisor = random([256, 512, 1024]);
    changeAfter = 256; //random([128, 256])

    let randomDir = random() < 0.2;

    let r;
    if (random() < 0.5) r = () => random(); // Math.round(random(4)) / 4;
    else r = () => Math.round(random(16)) / 16;

    for (let i = 0; i < 15; i++) {
        rects.push(r());
        rects.push(r());
        rects.push(r() * 2);
        rects.push(r() * 2);
        speeds.push(Math.ceil(random() * 8) / 8 / speedDivisor);
        let dir = random(dirList);
        if (randomDir) dir = [random() * 2 - 1, random() * 2 - 1];
        dirs.push(dir[0]);
        dirs.push(dir[1]);
        zooms.push(map(random(), 0, 1, 0.98, 1.02));
    }
    rects[0] = 0.0;
    rects[1] = 0.0;
    rects[2] = 1.0;
    rects[3] = 1.0;
    zooms[0] = map(random(), 0, 1, 0.99, 1.01);
}
setup = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const os = urlParams.get("orseed");

    seed = os || Math.floor(Math.random() * 999999999999);
    //seed = 223093979994
    console.log(seed);
    setupAfterSeed();
};

function makeDraw(tick) {
    //resetShader();
    if (tick > 1) {
        // THIS!!!!!!!
        myShader._renderer.textures.clear();

        // all of those didnt work
        // myShader.unbindTextures()
        // myShader.unbindShader()
        // myShader._renderer.GL.deleteTexture(myShader.uniforms.buffer.texture.glTex);
        // drawingContext.deleteTexture(myShader.uniforms.buffer.texture.glTex);
        // myShader.uniforms.buffer.texture.unbindTexture()
        // myShader._renderer.textures.delete(myShader.uniforms.buffer.texture.glTex)
        // myShader._renderer.textures.delete(myShader.uniforms.buffer.texture)
        // myShader.updateTextures()
        // myShader.unbindTextures()

        buffer = get();
    }
    if (tick % 4096 === 1) buffer = pg;
    if (tick % changeAfter === 1) {
        setParams();
    }
    myShader.setUniform("dims", [csw, csh]);
    myShader.setUniform("buffer", buffer);
    myShader.setUniform("time", tick);
    myShader.setUniform("seed", seed / 999999999999);
    myShader.setUniform("rects", rects);
    myShader.setUniform("speeds", speeds);
    myShader.setUniform("dirs", dirs);
    myShader.setUniform("zooms", zooms);
    let dup = [0.0, 0.0];
    let r = () => Math.round(random(8)) / 8 - 0.5;
    if (random() < 0.001) dup = [r(), r()];
    myShader.setUniform("dup", dup);
    if (true)
        myShader.uniforms.buffer.texture.setInterpolation(NEAREST, NEAREST);
    clear();
    shader(myShader);
    rect(0, 0, 0, 0);
    //if(tick > 103) noLoop();
}

let triggerSave = false;
let data = [];
let saving = false;
let offset = 0;

// triggerSave = true
// saving = true
draw = () => {
    if (triggerSave) {
        if (!saving) {
            cs = 768;
            frameCount = 1;
            setupAfterSeed();
            saving = true;
        }
        makeDraw(frameCount);
        if (frameCount > offset) {
            let frame = get();
            frame.loadPixels();
            data = data.concat(frame.pixels);
        }
        if (frameCount > 1024 + offset) {
            noLoop();
            downloadBlob(
                data,
                `${prefix}${seed}.bin`,
                "application/octet-stream"
            );
            alert(seed);
        }
    } else {
        if (setReset) {
            setupAfterSeed();
            frameCount = 1;
            setReset = false;
        }
        makeDraw(frameCount);
    }
};

function setupShader() {
    p5.RendererGL.prototype._initContext = function () {
        try {
            this.drawingContext =
                this.canvas.getContext("webgl2", this._pInst._glAttributes) ||
                this.canvas.getContext(
                    "experimental-webgl",
                    this._pInst._glAttributes
                );
            if (this.drawingContext === null) {
                throw new Error("Error creating webgl context");
            } else {
                const gl = this.drawingContext;
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                gl.viewport(
                    0,
                    0,
                    gl.drawingBufferWidth,
                    gl.drawingBufferHeight
                );
                this._viewport = this.drawingContext.getParameter(
                    this.drawingContext.VIEWPORT
                );
            }
        } catch (er) {
            throw er;
        }
    };

    const frag = glsl(["#version 300 es\nprecision highp float;\n#define GLSLIFY 1\n\n//\n// GLSL textureless classic 3D noise \"cnoise\",\n// with an RSL-style periodic variant \"pnoise\".\n// Author:  Stefan Gustavson (stefan.gustavson@liu.se)\n// Version: 2011-10-11\n//\n// Many thanks to Ian McEwan of Ashima Arts for the\n// ideas for permutation and gradient selection.\n//\n// Copyright (c) 2011 Stefan Gustavson. All rights reserved.\n// Distributed under the MIT license. See LICENSE file.\n// https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_1(vec3 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289_1(vec4 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute_1(vec4 x)\n{\n  return mod289_1(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt_1(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec3 fade_0(vec3 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\n// Classic Perlin noise\nfloat cnoise(vec3 P)\n{\n  vec3 Pi0 = floor(P); // Integer part for indexing\n  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n  Pi0 = mod289_1(Pi0);\n  Pi1 = mod289_1(Pi1);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute_1(permute_1(ix) + iy);\n  vec4 ixy0 = permute_1(ixy + iz0);\n  vec4 ixy1 = permute_1(ixy + iz1);\n\n  vec4 gx0 = ixy0 * (1.0 / 7.0);\n  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 * (1.0 / 7.0);\n  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt_1(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt_1(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade_0(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n  return 2.2 * n_xyz;\n}\n\n//\n// GLSL textureless classic 3D noise \"cnoise\",\n// with an RSL-style periodic variant \"pnoise\".\n// Author:  Stefan Gustavson (stefan.gustavson@liu.se)\n// Version: 2011-10-11\n//\n// Many thanks to Ian McEwan of Ashima Arts for the\n// ideas for permutation and gradient selection.\n//\n// Copyright (c) 2011 Stefan Gustavson. All rights reserved.\n// Distributed under the MIT license. See LICENSE file.\n// https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_2(vec3 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289_2(vec4 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute_2(vec4 x)\n{\n  return mod289_2(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt_2(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec3 fade_1(vec3 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n  Pi0 = mod289_2(Pi0);\n  Pi1 = mod289_2(Pi1);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute_2(permute_2(ix) + iy);\n  vec4 ixy0 = permute_2(ixy + iz0);\n  vec4 ixy1 = permute_2(ixy + iz1);\n\n  vec4 gx0 = ixy0 * (1.0 / 7.0);\n  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 * (1.0 / 7.0);\n  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt_2(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt_2(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade_1(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n  return 2.2 * n_xyz;\n}\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_0(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289_0(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute_0(vec4 x) {\n     return mod289_0(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt_0(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise_0(vec3 v)\n  {\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g_0 = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g_0;\n  vec3 i1 = min( g_0.xyz, l.zxy );\n  vec3 i2 = max( g_0.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289_0(i);\n  vec4 p = permute_0( permute_0( permute_0(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt_0(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n  }\n\n//\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_3(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289_3(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute_3(vec3 x) {\n  return mod289_3(((x*34.0)+1.0)*x);\n}\n\nfloat snoise_1(vec2 v)\n  {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289_3(i); // Avoid truncation effects in permutation\n  vec3 p = permute_3( permute_3( i.y + vec3(0.0, i1.y, 1.0 ))\n    + i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n// HSV functions from iq (https://www.shadertoy.com/view/MsS3Wc)\nvec3 hsv2rgb( in vec3 hsv )\n{\n    vec3 rgb = clamp( abs(mod(hsv.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );\n\n\treturn hsv.z * mix( vec3(1.0), rgb, hsv.y);\n}\n\n// From Sam Hocevar: http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl\nvec3 rgb2hsv(in vec3 rgb)\n{\n    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n    vec4 p = mix(vec4(rgb.bg, K.wz), vec4(rgb.gb, K.xy), step(rgb.b, rgb.g));\n    vec4 q = mix(vec4(p.xyw, rgb.r), vec4(rgb.r, p.yzx), step(p.x, rgb.r));\n\n    float d = q.x - min(q.w, q.y);\n    float e = 1.0e-10;\n\n    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n}\n\nconst int num = 16;\nuniform sampler2D buffer;\nuniform vec2 dims;\nuniform float time;\nuniform float seed;\nuniform float rects[num * 4];\nuniform float speeds[num];\nuniform float zooms[num];\nuniform float dirs[num * 2];\nuniform float dup[2];\nin vec2 vTexCoord;\n\nout vec4 fragColor;\nconst float gr = 0.618f;\nconst float gri = 1.0f - gr;\n\nfloat rect(vec4 inp, vec2 position) {\n  vec4 rect = vec4(inp.x, inp.y, inp.x + inp.z, inp.y + inp.w);\n  vec2 hv = step(rect.xy, position) * step(position, rect.zw);\n  float onOff = hv.x * hv.y;\n  return onOff;\n}\n\nvec2 zoom(vec2 zoomPoint, float zoomFactor, vec2 pos) {\n  return zoomPoint + round((zoomFactor * (pos - zoomPoint)) * 10.0f) / 10.0f;\n}\n\nvec2 rectCenter(vec4 rect) {\n  return vec2(rect.x + 0.5f * rect.z, rect.y + 0.5f * rect.w);\n}\n\nvec2 modN(vec2 inp, vec2 m) {\n  vec2 result = mod(inp, m);\n  if(all(lessThan(result, vec2(0.0f))))\n    result += m;\n  return result;\n}\n\nvec2 shiftRect(vec2 pos, vec4 r, vec2 dir, float speed) {\n  float inRect = rect(r, pos);\n  if(inRect > 0.0f) {\n    vec2 offset = pos - r.xy + dir * vec2(speed);\n    offset = modN(offset, r.zw);\n    offset += sin(time * 0.0001f) * 0.01f;\n    return r.xy + offset;\n  }\n  return pos;\n}\n\nvec2 zoomRect(vec4 r, float zoomFactor, vec2 pos) {\n  float inRect = rect(r, pos);\n  if(inRect > 0.0f) {\n    vec2 zoomPoint = rectCenter(r);\n    return zoomPoint + zoomFactor * (pos - zoomPoint);\n  }\n  return pos;\n}\n\nvec2 shiftRects(vec2 pos) {\n  vec2 result = pos;\n  for(int i = 0; i < num; i++) {\n    vec4 r = vec4(rects[i * 4], rects[i * 4 + 1], rects[i * 4 + 2], rects[i * 4 + 3]);\n    //r = vec4(0.5, 0.5, 0.2, 0.2);\n    //vec4 r = vec4(0.5,0.5, 0.1, 0.1);\n    float speed = speeds[i];\n    vec2 dir = vec2(dirs[i * 2], dirs[i * 2 + 1]);\n\n    if(mod(float(i), 2.0) == 0.0) {\n      result = zoomRect(r, zooms[i], result); }\n    else {\n      result = shiftRect(result, r, dir, speed); }\n  }\n  result = modN(result, vec2(1.0f));\n  return result;\n}\n\nvoid main() {\n  vec2 pos = vTexCoord;\n  pos.y = 1.0f - pos.y;\n  vec2 newPos = shiftRects(pos);\n  //newPos = zoom(vec2(0.5), 1.0 + mod(time * 0.01, 1.0), newPos);\n  //fragColor = filterFun(newPos);\n  if(distance(pos, newPos) > 0.01) newPos = pos + (newPos - pos) * 0.05;\n  fragColor = texture(buffer, newPos, 0.0f);\n  if(dup[0] != 0.0) {\n  fragColor = mod(fragColor + texture(buffer, newPos + vec2(dup[0], dup[1]), 0.0f), 2.0);\n  }\n\n}"]);
    const vert = glsl(["#version 300 es\n#ifdef GL_ES\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nin vec3 aPosition;\n\n// Always include this to get the position of the pixel and map the shader correctly onto the shape\n\nout vec2 vTexCoord;\n\nvoid main() {\n\n  // Copy the position data into a vec4, adding 1.0 as the w parameter\n  vec4 positionVec4 = vec4(aPosition, 1.0);\n\n  // Scale to make the output fit the canvas\n  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; \n\n  vTexCoord = vec2(aPosition);\n\n  // Send the vertex information on to the fragment shader\n  gl_Position = positionVec4;\n}"]);
    myShader = createShader(vert, frag);

    // seems super hacky but works
    // https://stackoverflow.com/questions/75573386/p5-catch-shader-compilation-errors
    let checkShaderError = (shaderObj, shaderText) => {
        let gl = shaderObj._renderer.GL;
        let glFragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(glFragShader, shaderText);
        gl.compileShader(glFragShader);
        if (!gl.getShaderParameter(glFragShader, gl.COMPILE_STATUS)) {
            return gl.getShaderInfoLog(glFragShader);
        }
        return null;
    };

    let shaderError = checkShaderError(myShader, frag);
    if (shaderError) {
        console.log(shaderError);
    } else {
        let shaderObj = myShader;
        shader(shaderObj);
    }
}

keyPressed = () => {
    // this will download the first 5 seconds of the animation!
    if (key === "s") {
        triggerSave = true;
    }
    if (key === "d") {
        save(`${seed}_${frameCount}.png`);
    }
};

let setReset = false;
windowResized = () => {
    setReset = true;
};

},{"glslify":2}],2:[function(require,module,exports){
module.exports = function(strings) {
  if (typeof strings === 'string') strings = [strings]
  var exprs = [].slice.call(arguments,1)
  var parts = []
  for (var i = 0; i < strings.length-1; i++) {
    parts.push(strings[i], exprs[i] || '')
  }
  parts.push(strings[i])
  return parts.join('')
}

},{}]},{},[1]);
