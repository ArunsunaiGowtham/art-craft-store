from PIL import Image
import os

folder = './images/crafting_samples'
files = [
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
]

for f in files:
    p = os.path.join(folder, f)
    if os.path.exists(p):
        im = Image.open(p)
        print(f, im.size, im.format)
