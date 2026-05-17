import urllib.request
import xml.etree.ElementTree as ET
import os
import zipfile
import shutil
import sys

BASE  = "https://dl.google.com/android/repository/"
FRESH = os.path.expanduser("~/android-sdk-fresh")
DEST  = os.path.join(FRESH, "platforms", "android-35")
os.makedirs(DEST, exist_ok=True)

# 1. Find the exact download URL from Google's repository manifest
pkg_url = None
for rev in ("3", "2", "1"):
    try:
        req = urllib.request.urlopen(BASE + f"repository2-{rev}.xml", timeout=30)
        root = ET.parse(req).getroot()
        for node in root.iter():
            if node.get("path") == "platforms;android-35":
                for child in node.iter():
                    if child.tag.endswith("}url") or child.tag == "url":
                        pkg_url = BASE + child.text.strip()
                        break
            if pkg_url:
                break
        if pkg_url:
            print(f"Found URL (repo2-{rev}.xml): {pkg_url}")
            break
    except Exception as e:
        print(f"repo2-{rev}.xml error: {e}")

if not pkg_url:
    pkg_url = BASE + "platform-35_r01.zip"
    print(f"Falling back to: {pkg_url}")

# 2. Download the zip
print("Downloading android-35 platform zip...")
urllib.request.urlretrieve(pkg_url, "/tmp/android-35.zip")
size = os.path.getsize("/tmp/android-35.zip")
print(f"Downloaded: {size / 1e6:.1f} MB")
if size < 10_000_000:
    print("ERROR: download too small — likely a 404 page")
    sys.exit(1)

# 3. Extract into platforms/android-35
print("Extracting...")
with zipfile.ZipFile("/tmp/android-35.zip") as z:
    members = z.namelist()
    prefix = members[0].split("/")[0] + "/" if "/" in members[0] else ""
    for member in members:
        rel = member[len(prefix):]
        if not rel:
            continue
        target = os.path.join(DEST, rel)
        if member.endswith("/"):
            os.makedirs(target, exist_ok=True)
        else:
            os.makedirs(os.path.dirname(target) or DEST, exist_ok=True)
            with z.open(member) as src, open(target, "wb") as dst:
                shutil.copyfileobj(src, dst)

jar = os.path.join(DEST, "android.jar")
if not os.path.exists(jar):
    print("ERROR: android.jar not found after extraction")
    sys.exit(1)
print(f"android.jar: {os.path.getsize(jar) / 1e6:.1f} MB  OK")
