////////////////////
//////Config
////////////////////

let palettes = [
    "https://coolors.co/ff0080-99ecff-ff8900-ffeff0-2400c0-0099d1-ffab00",
];
// palettes = [
//     "https://coolors.co/ebe7dc-ed4316-0d52da-f399bf-0c8d55-f3be0b",
//     "https://coolors.co/f8dbbb-0065bd-ffb700-e02d26",
//     "https://coolors.co/393e46-00adb5-f8b500-fc3c3c-ffffff",
//     "https://coolors.co/ffaea3-f5ae05-ffe9bd-fd2c05",
// ];
let permutePalettes = true;

let backgroundColor;
let GR = 0.61803398875;

// palette
let palette;
function setPalette() {
    if (palettes.length > 0) {
        palette = randomElem(palettes, randomM3);
        palette = palette
            .split("https://coolors.co/")[1]
            .split("-")
            .map((x) => color(`#${x}`));
        if (permutePalettes) palette = shuffleArr(palette, randomM3);
    }
}

////////////////////
//////Sketch
////////////////////

//params
// 0: num boxes
// 1: palette & permutation
// 2: pattern
// 3 num split
// 4: split permutation
function cornerVertex(corner) {
    vertex(corner.x, corner.y);
}
let s;
function drawArt() {
    //for (let k = 0; k < 100; k++) {
    setPalette();
    strokeWeight(0.0005 * cs);
    strokeWeight(0);
    let b = new Box(0, 0, cs, cs);
    stroke(palette[0]);
    fill(palette[0]);
    b.rect();
    b = b.subBox(0.88);
    s = (Math.floor(m0 * 6) + 1) * 2;
    grid = b.gridify(s, s);
    const pal = palette.slice(1);
    splitBox(b, Math.floor(randomM1() * 2), palette);
    const palFs = [
        (i, j) => 0,
        (i, j) => i + j,
        (i, j) => i,
        (i, j) => j,
        (i, j) => (j / 2) % 2,
        (i, j) => Math.floor(i / 2) % 2,
        (i, j) => Math.floor((j + i) / 2) % 2,
        (i, j) => ((i + j) % s < s / 2 ? 1 : 0),
        (i, j) => (Math.floor(Math.abs(i - s * 0.5)) > s * 0.24 ? 0 : 1),
        (i, j) => (Math.floor(Math.abs(j + 1 - s * 0.5)) > s * 0.2 ? 0 : 1),
        (i, j) =>
            Math.floor(Math.abs(i - s * 0.5)) > s * 0.2 &&
            Math.floor(Math.abs(j + 1 - s * 0.5)) > s * 0.2
                ? 0
                : 1,
        (i, j) =>
            Math.floor(Math.abs(i - s * 0.5)) > s * 0.25 ||
            Math.floor(Math.abs(j + 1 - s * 0.5)) > s * 0.25
                ? 0
                : 1,
        (i, j) => Math.floor(randomM1() * pal.length),
    ];
    const palF = linearElem(palFs, m1);
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
            if (i % 2 === 1 && j % 2 === 0) {
                let sb = grid[i][j];
                let sbShadow = grid[i - 1][j + 1];
                let col = pal[palF(i, j) % pal.length];
                fill(col);
                stroke(col);
                sb.rect();
                // if(i === splitX && j === splitY) {
                //     splitBox(sb, 7, palette.slice(1))
                // }

                fill(0);
                stroke(0);
                beginShape();
                cornerVertex(sb.tl);
                cornerVertex(sbShadow.tl);
                cornerVertex(sbShadow.bl);
                cornerVertex(sbShadow.br);
                cornerVertex(sb.br);
                cornerVertex(sb.bl);
                cornerVertex(sb.tl);
                endShape();
            }
        }
    }
    triggerPreview();
    //     save();
    // }
}

function shuffleArr(array, rand) {
    array = [...array];
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(rand() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
}

function randomElem(array, rand) {
    return array[Math.floor(rand() * array.length)];
}

function linearElem(array, val) {
    return array[Math.floor(val * array.length)];
}

Box = class {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = createVector(x + w * 0.5, y + h * 0.5);
        this.tl = createVector(x, y);
        this.tr = createVector(x + w, y);
        this.br = createVector(x + w, y + h);
        this.bl = createVector(x, y + h);
        this.tc = createVector(x + w * 0.5, y);
        this.rc = createVector(x + w, y + h * 0.5);
        this.bc = createVector(x + w * 0.5, y + h);
        this.lc = createVector(x, y + h * 0.5);
    }
    gridify(gridWidth, gridHeight) {
        let grid = [];
        let boxWidth = this.w / gridWidth;
        let boxHeight = this.h / gridHeight;

        for (let i = 0; i < gridWidth; i++) {
            grid.push([]);
            for (let j = 0; j < gridHeight; j++) {
                grid[i].push(
                    new Box(
                        this.x + boxWidth * i,
                        this.y + boxHeight * j,
                        boxWidth,
                        boxHeight
                    )
                );
            }
        }
        return grid;
    }
    randomPoint(rand) {
        return createVector(this.x + rand() * this.w, this.y + rand() * this.h);
    }

    coords(xRatio, yRatio) {
        return [this.xc(xRatio), this.yc(yRatio)];
    }

    xc(ratio) {
        return this.x + this.w * ratio;
    }

    yc(ratio) {
        return this.y + this.h * ratio;
    }

    mirrorH() {
        let img = get(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.ceil(this.w),
            Math.ceil(this.h)
        );
        push();
        scale(-1, 1);
        translate(-(2 * Math.ceil(this.x) + Math.floor(this.w)), 0);
        image(
            img,
            Math.floor(this.x),
            Math.floor(this.y),
            Math.ceil(this.w),
            Math.ceil(this.h)
        );
        pop();
    }

    mirrorV() {
        let img = get(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.ceil(this.w),
            Math.ceil(this.h)
        );
        push();
        scale(1, -1);
        translate(0, -(2 * Math.floor(this.y) + Math.ceil(this.h)));
        image(
            img,
            Math.floor(this.x),
            Math.floor(this.y),
            Math.ceil(this.w),
            Math.ceil(this.h)
        );
        pop();
    }

    rotate(rotation) {
        let img = get(this.x, this.y, this.w, this.h);
        push();
        translate(this.c.x, this.c.y);
        rotate(rotation * PI * 0.5);
        translate(-this.c.x, -this.c.y);
        image(img, this.x, this.y, this.w, this.h);
        pop();
    }

    rect() {
        rect(this.x, this.y, this.w, this.h);
    }

    subBox(ratio) {
        const ratio2 = (1 - ratio) * 0.5;
        return new Box(
            this.x + ratio2 * this.w,
            this.y + ratio2 * this.h,
            ratio * this.w,
            ratio * this.h
        );
    }

    subBoxRect() {
        if (this.w > this.h) {
            const diff = this.w - this.h;
            return new Box(this.x + diff * 0.5, this.y, this.w - diff, this.h);
        } else {
            const diff = this.h - this.w;
            return new Box(this.x, this.y + diff * 0.5, this.w, this.h - diff);
        }
    }

    triangle2(oriantation) {
        switch (oriantation) {
            case "tl":
                vecTriangle(this.tl, this.tr, this.bl);
                break;
            case "tr":
                vecTriangle(this.tl, this.tr, this.br);
                break;
            case "br":
                vecTriangle(this.br, this.tr, this.bl);
                break;
            case "bl":
                vecTriangle(this.bl, this.tl, this.br);
                break;
        }
    }

    triangle4(oriantation) {
        switch (oriantation) {
            case "l":
                vecTriangle(this.tl, this.bl, this.c);
                break;
            case "t":
                vecTriangle(this.tl, this.tr, this.c);
                break;
            case "r":
                vecTriangle(this.tr, this.br, this.c);
                break;
            case "b":
                vecTriangle(this.bl, this.br, this.c);
                break;
        }
    }

    circle(r) {
        circle(this.c.x, this.c.y, r * Math.min(this.w, this.h));
    }
};

function splitBox(b, depth, colors) {
    if (depth == 0) {
        c = colors[Math.floor(randomM4() * colors.length)];
        fill(c);
        stroke(c);
        b.rect();
    } else {
        var d = depth - 1;
        gr = 0.5;
        let offset = Math.round(m2)
        if (offset) {
            // vertical split
            var s = gr * b.w;
            splitBox(new Box(b.x + s, b.y, b.w - s, b.h), d, colors);
            splitBox(new Box(b.x, b.y, s, b.h), d, colors);
        } else {
            // horizontal split
            var s = gr * b.h;
            splitBox(new Box(b.x, b.y + s, b.w, b.h - s), d, colors);
            splitBox(new Box(b.x, b.y, b.w, s), d, colors);
        }
    }
}

// palettes = [
//     "https://coolors.co/ffaea3-f5ae05-ffe9bd-fd2c05-0d0e08",
//     "https://coolors.co/393E46-00ADB5-F8B500-FC3C3C-FFFFFF",
//     "https://coolors.co/000000-f8dbbb-0065bd-ffb700-e02d26",
//     "https://coolors.co/ebe7dc-ed4316-0d52da-f399bf-0c8d55-f3be0b",
// ];

// const getAllSubsets =
//       theArray => theArray.reduce(
//         (subsets, value) => subsets.concat(
//          subsets.map(set => [value,...set])
//         ),
//         [[]]
//       );

// let res = []
// for(p of palettes){
//         palette = p
//             .split("https://coolors.co/")[1]
//             .split("-")
//           let subsets = getAllSubsets(palette).filter(x => x.length === 2)
//           subsets = subsets.map(x => `https://coolors.co/${x.join("-")}`)
//         res.push(...subsets)
// }

// console.log(res)
