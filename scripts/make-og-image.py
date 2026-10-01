"""Compose the 1200x630 link-preview card from the site's own assets and fonts."""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

F = sys.argv[1]  # dir with TTFs of the site fonts (convert from .next/static/media woff2 with fontTools)
OUT = sys.argv[2:]
A = "public/assets/"
W, H = 1200, 630
INK, PAPER, ACCENT, FRAME = (20, 18, 16), (244, 242, 236), (255, 91, 31), (47, 123, 245)
font = lambda n, s: ImageFont.truetype(f"{F}/{n}.ttf", s)

im = Image.new("RGBA", (W, H), PAPER + (255,))
d = ImageDraw.Draw(im)
for x in range(0, W, 28):
    d.line([(x, 0), (x, H)], fill=(228, 225, 217))
for y in range(0, H, 28):
    d.line([(0, y), (W, y)], fill=(228, 225, 217))

def sticker(name, xy, size, rot=0):
    s = Image.open(A + name).convert("RGBA")
    s.thumbnail((size, size), Image.LANCZOS)
    s = s.rotate(rot, resample=Image.BICUBIC, expand=True)
    sh = Image.new("RGBA", s.size, (40, 20, 10, 0))
    sh.putalpha(s.getchannel("A").point(lambda a: a * 0.35))
    sh = sh.filter(ImageFilter.GaussianBlur(6))
    im.alpha_composite(sh, (xy[0] + 3, xy[1] + 8))
    im.alpha_composite(s, xy)

# --- the wall (right) ---
wx0, wy0, wx1, wy1 = 690, 70, 1150, 430
d.rounded_rectangle([wx0 + 8, wy0 + 9, wx1 + 8, wy1 + 9], 30, fill=INK)
grad = Image.new("RGBA", (wx1 - wx0, wy1 - wy0))
gd = ImageDraw.Draw(grad)
stops = [(0, (244, 138, 90)), (0.28, (239, 90, 60)), (0.55, (223, 63, 104)), (0.8, (168, 63, 168)), (1, (110, 68, 214))]
for x in range(grad.width):
    t = x / (grad.width - 1)
    for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
        if t0 <= t <= t1:
            k = (t - t0) / (t1 - t0)
            gd.line([(x, 0), (x, grad.height)], fill=tuple(round(a + (b - a) * k) for a, b in zip(c0, c1)) + (255,))
            break
mask = Image.new("L", grad.size, 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, grad.width - 1, grad.height - 1], 30, fill=255)
im.paste(grad, (wx0, wy0), mask)
gl = Image.new("RGBA", grad.size)
gld = ImageDraw.Draw(gl)
for gx in range(0, grad.width, 88):
    gld.line([(gx, 0), (gx, grad.height)], fill=(0, 0, 0, 26))
for gy in range(0, grad.height, 44):
    gld.line([(0, gy), (grad.width, gy)], fill=(0, 0, 0, 26))
gl.putalpha(Image.composite(gl.getchannel("A"), Image.new("L", grad.size, 0), mask))
im.alpha_composite(gl, (wx0, wy0))
# chalk code
mono = font("JetBrainsMono-600", 15)
for i, line in enumerate(["var me = new Developer();", 'me.Build("ERP", modules: 28);']):
    d.text((wx0 + 26, wy0 + 26 + i * 24), line, font=mono, fill=(255, 255, 255, 215))

# head behind the wall edge, hands on it (same geometry as the hero)
peek_w = 440
cx = (wx0 + wx1) // 2
head = Image.open(A + "avatar/head.webp").convert("RGBA")
hw = round(peek_w * 0.66)
head = head.resize((hw, round(hw * head.height / head.width)), Image.LANCZOS)
hx = cx - peek_w // 2 + round(peek_w * 0.16)
hy = wy1 - round(head.height * 0.73)
layer = Image.new("RGBA", im.size)
layer.alpha_composite(head, (hx, hy))
clip = Image.new("L", im.size, 0)
ImageDraw.Draw(clip).rectangle([0, 0, W, wy1 - 2], fill=255)
layer.putalpha(Image.composite(layer.getchannel("A"), Image.new("L", im.size, 0), clip))
im.alpha_composite(layer)
d.rounded_rectangle([wx0, wy0, wx1, wy1], 30, outline=INK, width=4)
for side, ledge, left in (("l", 0.6, True), ("r", 0.533, False)):
    hand = Image.open(A + f"peek/hand-grip-{side}.webp").convert("RGBA")
    w = round(peek_w * 0.3)
    hand = hand.resize((w, round(w * hand.height / hand.width)), Image.LANCZOS)
    x = cx - peek_w // 2 + round(peek_w * 0.02) if left else cx + peek_w // 2 - round(peek_w * 0.02) - w
    im.alpha_composite(hand, (x, wy1 - round(hand.height * ledge)))

sticker("stickers/csharp.webp", (wx0 + 22, wy0 + 120), 96, 10)
sticker("stickers/sql.webp", (wx1 - 70, wy0 + 140), 100, -9)
sticker("stickers/redis.webp", (wx1 - 150, wy0 - 30), 92, 7)

# --- the name block (left) ---
box_font = font("BricolageGrotesque-800", 96)
word = "DEVELOPER."
bx, by = 64, 230
l, t, r, b = d.textbbox((0, 0), word, font=box_font)
bw, bh = r - l + 40, 120
d.rectangle([bx, by, bx + bw, by + bh], fill=ACCENT)
d.text((bx + 22 - l, by + (bh - (b - t)) // 2 - t), word, font=box_font, fill="white")
d.rectangle([bx, by, bx + bw, by + bh], outline=FRAME, width=3)
for hx_, hy_ in ((bx, by), (bx + bw, by), (bx, by + bh), (bx + bw, by + bh)):
    d.rectangle([hx_ - 7, hy_ - 7, hx_ + 7, hy_ + 7], fill="white", outline=FRAME, width=3)
lab = ".NET · Backend"
lf = font("JetBrainsMono-600", 22)
lw = d.textlength(lab, font=lf)
lx = bx + bw / 2 - lw / 2 - 14
d.rounded_rectangle([lx, by + bh + 16, lx + lw + 28, by + bh + 56], 7, fill=FRAME)
d.text((lx + 14, by + bh + 22), lab, font=lf, fill="white")

sig = Image.new("RGBA", (700, 200))
ImageDraw.Draw(sig).text((10, 10), "Sandhoshsivan", font=font("MrDafoe-400", 100), fill=INK)
sig = sig.rotate(6, resample=Image.BICUBIC, expand=True)
im.alpha_composite(sig, (bx - 18, by - 150))

d.text((bx, 478), "I build the backend a 2,000-person company runs on.", font=font("BricolageGrotesque-700", 31), fill=INK)
d.text((bx, 524), ".NET developer by day. Rookie game maker by night.", font=font("Caveat-700", 32), fill=(94, 89, 80))

# ticker strip
d.rectangle([0, H - 42, W, H], fill=(255, 197, 61))
d.line([(0, H - 42), (W, H - 42)], fill=INK, width=3)
tf = font("BricolageGrotesque-700", 18)
items = ["SANDHOSHSIVAN M", ".NET BACKEND DEVELOPER", "COIMBATORE, INDIA", "OPEN TO NEW ROLES", "ROOKIE GAME DEVELOPER"]
x = 24
for it in items * 2:
    d.text((x, H - 32), " ".join(it), font=tf, fill=INK)
    x += d.textlength(" ".join(it), font=tf) + 22
    cy = H - 21
    d.polygon([(x + 8, cy - 8), (x + 11, cy - 2), (x + 17, cy), (x + 11, cy + 2), (x + 8, cy + 8), (x + 5, cy + 2), (x - 1, cy), (x + 5, cy - 2)], fill=ACCENT)
    x += 38
    if x > W:
        break

rgb = im.convert("RGB")
for o in OUT:
    rgb.save(o, optimize=True)
print("ok", rgb.size)
