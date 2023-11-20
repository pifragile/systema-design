palettes = [
    "https://coolors.co/ebe7dc-ed4316-0d52da-f399bf-0c8d55-f3be0b",
    "https://coolors.co/f8dbbb-0065bd-ffb700-e02d26",
    "https://coolors.co/393e46-00adb5-f8b500-fc3c3c-ffffff",
    "https://coolors.co/ffaea3-f5ae05-ffe9bd-fd2c05",
];

palettes = [
    "https://coolors.co/00ffff-ff00ff-000000-ffffff",
    "https://coolors.co/000000-ffffff",
]
palettes = [
    // soft
    //'https://coolors.co/ec98ac-f4f1d7-e31d34-2b2671-c5dba5-90d0e3-f4bc6d-89c9b8-221e1f',
    // 2
    //'https://coolors.co/ff85a1-fffacc-ff001e-0a0099-ccff80-75dfff-ffbd61-52ffd1-420011',
    // bw
    //"https://coolors.co/000000-ffffff-000000-ffffff-000000-ffffff-000000-ffffff-000000",
    // win95
    //'https://coolors.co/818181-ffffff-000000-00ffff-ffff00-00ff00-ff0000-ff00ff-0000ff',
    // win95 logo
    //'https://coolors.co/ff2f00-ffcd00-000000-66cd30-00a6ff',
    //'https://coolors.co/ffff00-ff00ff-00ffff-ff0000-00ff00-0000ff-ffffff',
    //'https://coolors.co/f00000-0f0000-00f000-000f00-0000f0-00000f-ff0000-00ffff-ff00ff',
    'https://coolors.co/f00000-00f000-0000f0-ff0000-00ffff-ff00ff',
    //'https://coolors.co/0f0000-000f00-00000f',

    //'https://coolors.co/palette/337556-ee3b10-143b74-b9beb8-fffbe5-131426-e38891-f99707-61b7ac',
];

let palette;
const permutePalettes = true;
function setPalette() {
    if (palettes.length > 0) {
        palette = random(palettes);
        palette = palette
            .split("https://coolors.co/")[1]
            .split("-")
            .map((x) => color(`#${x}`));
        if (permutePalettes) palette = shuffle(palette);
    }
}