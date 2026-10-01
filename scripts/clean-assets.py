"""Phase 0 asset pipeline: key out painted backgrounds, trim, export WebP.

Reads the raw sticker PNGs from references/assets-raw/ (original UUID names)
and writes public/assets/<group>/<name>.webp (1024 px) and <name>-sm.webp
(400 px). Sticker sheets are split into one file per piece.

    python scripts/clean-assets.py          # needs numpy, scipy, pillow
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "references" / "assets-raw"
OUT = ROOT / "public" / "assets"

# Background keys. "checker" is the grey checkerboard AI tools paint in
# place of transparency ("ring" also clears checker pockets enclosed by the
# subject: only for crayon doodles that contain no real grey);
# "white" is a near-white checker; "alpha" means already transparent.
CHECKER, RING, WHITE, BLACK, ALPHA, NONE = "checker", "ring", "white", "black", "alpha", "none"

# raw file prefix -> (group, name, key)
ASSETS = {
    # tech stickers
    "37D1C820": ("stickers", "csharp", ALPHA),
    "72EDA18A": ("stickers", "dotnet", ALPHA),
    "179D09D5": ("stickers", "dotnet-alt", CHECKER),
    "ED8AD929": ("stickers", "dotnet-cursor", CHECKER),
    "F2AD3239": ("stickers", "sql", ALPHA),
    "F0500E0D": ("stickers", "redis", ALPHA),
    "24FE6AA9": ("stickers", "react", ALPHA),
    "6841C5C4": ("stickers", "docker", ALPHA),
    "ED604D38": ("stickers", "azure", ALPHA),
    "44066096": ("stickers", "rabbitmq", ALPHA),
    "F9823BD2": ("stickers", "typescript", BLACK),
    # avatar
    "2C37D240": ("avatar", "boy", ALPHA),
    "7C143548": ("avatar", "hand", ALPHA),
    "4148EFB5": ("avatar", "boy-controller", ALPHA),
    "F8C5D08C": ("avatar", "head", ALPHA),
    # doodles
    "88A6E0ED": ("doodles", "pencil", ALPHA),
    "50280CFD": ("doodles", "bulb", ALPHA),
    "93610536": ("doodles", "sparkle", ALPHA),
    "C8F34F65": ("doodles", "cursor", ALPHA),
    "9351A604": ("doodles", "cursor-click", ALPHA),
    "89D386A0": ("doodles", "star", RING),
    "679500E8": ("doodles", "circle", RING),
    "DB79573F": ("doodles", "arrow-curve", RING),
    "93AB120F": ("doodles", "arrow-up", RING),
    "4380E9B3": ("doodles", "squiggle", RING),
    "F953008E": ("doodles", "code-brackets", RING),
    "4FFD237B": ("doodles", "database", RING),
    "F63CDC41": ("doodles", "api-server", CHECKER),
    "5F765A85": ("doodles", "gamepad", CHECKER),
    # paper
    "7A7577DB": ("paper", "torn-blue-grid", CHECKER),
    "371155ED": ("paper", "torn-yellow-grid", CHECKER),
    "CF82B0E6": ("paper", "torn-orange", CHECKER),
    "04A0231F": ("paper", "torn-purple", CHECKER),
    "7DFD0DCD": ("paper", "torn-black", CHECKER),
    "92C0D407": ("paper", "torn-strip", WHITE),
    "40B2CF29": ("paper", "card", ALPHA),
    "E25985F3": ("paper", "texture", NONE),
    "57CD74CD": ("tape", "tape-wide", CHECKER),
    # icons
    "1AA95420": ("icons", "linkedin", ALPHA),
    "78FFC8E9": ("icons", "github", ALPHA),
    "E5E572E7": ("icons", "claude", ALPHA),
}

# Sheets split into pieces, left to right / top to bottom.
# Sheets split into pieces in reading order: (group, names, gap px[, keep]).
# `keep` drops pieces smaller than that fraction of the largest one.
SHEETS = {
    "D6E96AF1": ("peek", [
        "peek", "peek-tilt", "peek-smile", "peek-pair", "peek-side", "hand-grip-l", "hand-grip-r",
        "head", "eye-1", "eye-2", "eye-3", "hand-point-side", "hand-point", "hand-grip-r2", "hair-1", "hair-2",
    ], 4, 0.01),
    "2A780284": ("contact", [
        "boy-point", "lets-build", "together", "email-bar", "reach-me", "btn-linkedin", "btn-github",
        "btn-resume", "dash-1", "dash-2", "sparkle", "scribble", "tape-yellow", "tape-red", "cursor",
    ], 4, 0.01),
    "D375D076": ("icons", ["ai-claude", "ai-cursor", "ai-copilot"], 6),
    "68AFD842": ("icons", ["ai-claude-alt", "ai-cursor-alt", "ai-copilot-alt"], 6),
    "ACEC054B": ("tape", [f"tape-{i:02d}" for i in range(1, 14)], 3),
    "EE59C8BB": ("game", [
        "gamepad", "handheld", "pixel-heart", "star", "mushroom", "question-block",
        "gem", "coin", "console", "invader", "sword", "bomb", "wing", "flag",
        "play", "dpad", "level-up", "trophy",
    ], 2),
}

# Not exported (design references only): the five ERP card mockups CFF3AC21,
# B8F82D33, 6227C759, 3C99A741, 6D8FE468 and the contact layout E5514FCD.
# Also not exported: 7719CB61 (10-logo reference sheet), "F0500E0D... 2" (duplicate).


def background_mask(rgb: np.ndarray, key: str) -> np.ndarray:
    """Background-coloured regions that touch the border, plus (RING) enclosed
    ones: the inside of the circle, pockets between crayon strokes."""
    r, g, b = (rgb[..., i].astype(int) for i in range(3))
    sat = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
    lum = (r + g + b) // 3
    if key in (CHECKER, RING):
        cand = (sat <= 12) & (lum >= 105) & (lum <= 240)
    elif key == WHITE:
        cand = (sat <= 12) & (lum >= 200)
    else:  # BLACK
        cand = lum <= 34
    labels, n = ndimage.label(cand)
    edge = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    keep = set(edge[edge != 0].tolist())
    if key == RING:
        sizes = ndimage.sum(cand, labels, range(1, n + 1))
        keep |= {i + 1 for i, s in enumerate(sizes) if s >= 12}
    return np.isin(labels, list(keep))


def key_out(im: Image.Image, key: str) -> Image.Image:
    rgba = im.convert("RGBA")
    if key in (ALPHA, NONE):
        return rgba
    arr = np.array(rgba)
    bg = background_mask(arr[..., :3], key)
    # drop specks left in the background, then feather the edge by 1 px
    fg = ndimage.binary_opening(~bg, iterations=2)
    fg = ndimage.binary_erosion(fg, iterations=1)
    alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    arr[..., 3] = np.minimum(arr[..., 3], np.array(alpha))
    return Image.fromarray(arr)


def trim(im: Image.Image, pad: float = 0.04) -> Image.Image:
    box = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if not box:
        return im
    im = im.crop(box)
    p = round(max(im.size) * pad)
    out = Image.new("RGBA", (im.width + 2 * p, im.height + 2 * p), (0, 0, 0, 0))
    out.paste(im, (p, p))
    return out


def export(im: Image.Image, group: str, name: str) -> None:
    d = OUT / group
    d.mkdir(parents=True, exist_ok=True)
    for suffix, size in (("", 1024), ("-sm", 400)):
        copy = im.copy()
        copy.thumbnail((size, size), Image.LANCZOS)
        copy.save(d / f"{name}{suffix}.webp", "WEBP", quality=90, method=6)


def split(im: Image.Image, gap: int, keep: float = 0.08) -> list[Image.Image]:
    """Cut a sheet into pieces. Pieces closer than `gap` px are one sticker;
    pieces smaller than `keep` x the largest (accent strokes) are dropped."""
    a = np.array(im.getchannel("A")) > 8
    labels, n = ndimage.label(ndimage.binary_dilation(a, iterations=gap))
    areas = ndimage.sum(a, labels, range(1, n + 1))
    pieces = []
    for i, sl in enumerate(ndimage.find_objects(labels), start=1):
        if areas[i - 1] < keep * areas.max():
            continue
        crop = np.array(im)[sl].copy()
        crop[..., 3] = np.where(labels[sl] == i, crop[..., 3], 0)
        cy = (sl[0].start + sl[0].stop) // 2
        pieces.append((cy, sl[1].start, Image.fromarray(crop)))
    # reading order: group into rows by centre line, then left to right
    pieces.sort(key=lambda t: t[0])
    rows, row = [], []
    for p in pieces:
        if row and p[0] - row[0][0] > 90:
            rows.append(row)
            row = []
        row.append(p)
    rows.append(row)
    return [p[2] for r in rows for p in sorted(r, key=lambda t: t[1])]


def erase_ledge(im: Image.Image) -> tuple[Image.Image, float]:
    """Remove the drawn ledge stroke from a gripping-hand sticker.

    The stroke is the dark band that spans most of the width; it is erased
    everywhere except under the fingers, which are drawn over it. Returns the
    clean image and the stroke's row as a fraction of the height, so the site
    can sit that row on its own wall edge."""
    a = np.array(im).copy()
    r, g, b, al = (a[..., i].astype(int) for i in range(4))
    dark = (al > 120) & (r + g + b < 200)
    h, w = dark.shape
    band = int(np.argmax(dark.sum(1)[h // 3:])) + h // 3
    skin = (al > 200) & (r > 200) & (g > 130) & (b > 90) & (r - b > 60)
    fingers = ndimage.binary_dilation(skin[band + 3:].any(0), iterations=4)
    stroke = dark.copy()
    stroke[: band - 6] = False
    stroke[band + 7:] = False
    stroke[:, fingers] = False
    a[..., 3][stroke] = 0
    labels, n = ndimage.label(a[..., 3] > 40)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(labels), labels, range(1, n + 1))
        a[..., 3][labels != 1 + int(np.argmax(sizes))] = 0
    return Image.fromarray(a), band / h


def raw(prefix: str) -> Path:
    return next(p for p in sorted(RAW.glob(f"{prefix}*.PNG")) if not p.stem.endswith(" 2"))


def main() -> None:
    for prefix, (group, name, key) in ASSETS.items():
        im = key_out(Image.open(raw(prefix)), key)
        export(im if key == NONE else trim(im), group, name)
        print(f"{group}/{name}")
    for prefix, (group, names, gap, *keep) in SHEETS.items():
        pieces = split(Image.open(raw(prefix)).convert("RGBA"), gap, *keep)
        assert len(pieces) == len(names), f"{prefix}: {len(pieces)} pieces, {len(names)} names"
        for name, piece in zip(names, pieces):
            piece = trim(piece)
            if (group, name) in (("peek", "hand-grip-l"), ("peek", "hand-grip-r")):
                piece, ledge = erase_ledge(piece)
                print(f"  {name}: ledge at {ledge:.3f} of height")
            export(piece, group, name)
        print(f"{group}/ {len(pieces)} pieces from {prefix}")


if __name__ == "__main__":
    main()
