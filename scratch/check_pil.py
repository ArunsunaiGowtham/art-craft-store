import os
import sys

try:
    from PIL import Image
    print("PIL is available")
except ImportError:
    print("PIL is not available, will use Python/powershell")
