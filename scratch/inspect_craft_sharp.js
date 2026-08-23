const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const folder = './images/crafting_samples';
const files = [
    'Resin_art.jpg.jpg',
    'Resin_crafts.jpg.jpg',
    'Surfer_Art_Ireland_Ocean_Resin_Art_.jpg',
    'FileMacrame_Basic_Knotsjpg.jpg',
    'macrame_boho_craft.jpg',
    'FileEmbroidery_by_Hand_Sample_with_Desig.jpg',
    'leather_craft_tools.jpg',
    'FileFamous_Lumban_Laguna_embroidery_hoop.jpg',
    'FileAleppo_soap_01jpg.jpg',
    'FileHandmade_soapjpg.jpg',
    'FileNizza-Soap-4070848jpg.jpg'
];

async function run() {
    for (const f of files) {
        const p = path.join(folder, f);
        if (fs.existsSync(p)) {
            const meta = await sharp(p).metadata();
            console.log(f, `${meta.width}x${meta.height}`, meta.format);
        }
    }
}
run();
