import os
import struct

def get_image_size(file_path):
    with open(file_path, 'rb') as f:
        data = f.read(30)
        if data[:8] == b'\x89PNG\r\n\x1a\n':
            w, h = struct.unpack('>LL', data[16:24])
            return int(w), int(h), 'PNG'
        elif data[:2] == b'\xff\xd8':
            f.seek(0)
            data = f.read()
            size = len(data)
            i = 2
            while i < size:
                if data[i] != 0xff:
                    i += 1
                    continue
                while i < size and data[i] == 0xff:
                    i += 1
                if i >= size:
                    break
                marker = data[i]
                i += 1
                if marker in [0xd8, 0xd9, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7]:
                    continue
                if i + 2 > size:
                    break
                length = struct.unpack('>H', data[i:i+2])[0]
                if marker in [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]:
                    if i + length <= size:
                        h, w = struct.unpack('>HH', data[i+3:i+7])
                        return int(w), int(h), 'JPEG'
                i += length
    return None, None, 'UNKNOWN'

folder = './images/crafting_samples'
for fn in sorted(os.listdir(folder)):
    fp = os.path.join(folder, fn)
    if os.path.isfile(fp):
        w, h, fmt = get_image_size(fp)
        if w and h:
            print(f"{fn:45} | {w:5}x{h:5} | {fmt} | {os.path.getsize(fp)/1024:6.1f} KB")
