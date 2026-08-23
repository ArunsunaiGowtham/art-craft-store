import os
import struct

def get_image_size(file_path):
    with open(file_path, 'rb') as f:
        data = f.read(2)
        if data != b'\xff\xd8':
            return None
        while True:
            marker, length = struct.unpack(">2sH", f.read(4))
            if marker in (b'\xff\xc0', b'\xff\xc2'):
                mode, height, width = struct.unpack(">BHH", f.read(5))
                return width, height
            else:
                f.seek(length - 2, 1)

for f in os.listdir('images/origami_samples'):
    p = os.path.join('images/origami_samples', f)
    if os.path.isfile(p):
        try:
            sz = get_image_size(p)
            print(f"{f}: {sz} ({os.path.getsize(p)/1024:.1f} KB)")
        except Exception as e:
            pass
