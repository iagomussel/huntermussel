import os
import subprocess
import glob

BLOG_IMG_DIR = "public/images/blog"

RATIOS = {
    "16x9": 16/9,
    "1x1": 1/1,
    "9x16": 9/16
}

WIDTH_NAMES = ["thumb", "low", "med", "high"]

def get_med_width(ratio_name):
    if ratio_name == "1x1":
        return 1024
    if ratio_name == "9x16":
        return 1080
    return 1280

def generate_versions(img_path):
    base_name = os.path.splitext(img_path)[0]
    # Skip already generated versions
    if any(suffix in base_name for suffix in ["_16x9_", "_1x1_", "_9x16_"]):
        return

    print(f"Processing {img_path}...")

    for ratio_name, ratio_val in RATIOS.items():
        med_w = get_med_width(ratio_name)
        widths = {
            "thumb": 320,
            "low": 640,
            "med": med_w,
            "high": 1920
        }

        for w_name, w in widths.items():
            h = int(w / ratio_val)
            output_name = f"{base_name}_{ratio_name}_{w_name}.webp"
            
            # Use ImageMagick to crop and resize
            # ^ means resize to fill, then crop center
            cmd = [
                "convert", img_path,
                "-resize", f"{w}x{h}^",
                "-gravity", "center",
                "-extent", f"{w}x{h}",
                "-quality", "85",
                output_name
            ]
            
            try:
                subprocess.run(cmd, check=True)
                # print(f"  Generated {output_name}")
            except subprocess.CalledProcessError as e:
                print(f"  Error generating {output_name}: {e}")

def main():
    images = glob.glob(os.path.join(BLOG_IMG_DIR, "*.webp")) + \
             glob.glob(os.path.join(BLOG_IMG_DIR, "*.jpg")) + \
             glob.glob(os.path.join(BLOG_IMG_DIR, "*.png"))
    
    for img in images:
        generate_versions(img)

if __name__ == "__main__":
    main()
