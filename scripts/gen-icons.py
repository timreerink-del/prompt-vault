"""Generate PWA icons for the Dierenspel offline game. Run once; output is committed."""
import math
from PIL import Image, ImageDraw, ImageFilter

OUT = "/home/user/prompt-vault/public/dierenspel/icons"


def lerp(a, b, t):
    return a + (b - a) * t


def vlerp(c1, c2, t):
    return tuple(int(lerp(c1[i], c2[i], t)) for i in range(3))


def radial_gradient(size, center, radius, c_in, c_out):
    img = Image.new("RGB", (size, size), c_out)
    px = img.load()
    cx, cy = center
    for y in range(size):
        for x in range(size):
            d = math.hypot(x - cx, y - cy) / radius
            t = min(1.0, d)
            px[x, y] = vlerp(c_in, c_out, t)
    return img


def rounded_mask(size, radius):
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return mask


def draw_critter(draw, size):
    # Friendly round "vosje"-achtig 3D-ogend wezen, gradient shading via overlapping ellipses.
    cx, cy = size * 0.5, size * 0.58
    body_r = size * 0.30

    # slagschaduw
    draw.ellipse(
        [cx - body_r * 1.05, cy + body_r * 0.78, cx + body_r * 1.05, cy + body_r * 1.05],
        fill=(20, 60, 30, 90),
    )

    # oren
    ear_r = size * 0.10
    for dx in (-1, 1):
        ex, ey = cx + dx * body_r * 0.72, cy - body_r * 0.95
        draw.ellipse([ex - ear_r, ey - ear_r * 1.3, ex + ear_r, ey + ear_r * 1.3], fill=(255, 154, 60))
        draw.ellipse(
            [ex - ear_r * 0.5, ey - ear_r * 0.7, ex + ear_r * 0.5, ey + ear_r * 0.8],
            fill=(255, 214, 168),
        )

    # lijf/hoofd met radiale highlight (top-left licht)
    steps = 40
    for i in range(steps, 0, -1):
        t = i / steps
        r = body_r * t
        off = body_r * 0.28 * (1 - t)
        col = vlerp((255, 200, 140), (240, 120, 40), t)
        draw.ellipse([cx - r - off, cy - r - off, cx + r - off, cy + r - off], fill=col)

    # wangen
    cheek_r = size * 0.045
    for dx in (-1, 1):
        draw.ellipse(
            [cx + dx * body_r * 0.55 - cheek_r, cy + body_r * 0.15 - cheek_r,
             cx + dx * body_r * 0.55 + cheek_r, cy + body_r * 0.15 + cheek_r],
            fill=(255, 255, 255, 0) if False else (255, 170, 150),
        )

    # snuit
    snout_w, snout_h = size * 0.22, size * 0.15
    draw.ellipse(
        [cx - snout_w / 2, cy + body_r * 0.08, cx + snout_w / 2, cy + body_r * 0.08 + snout_h],
        fill=(255, 236, 214),
    )
    # neus
    nr = size * 0.03
    draw.ellipse([cx - nr, cy + body_r * 0.14, cx + nr, cy + body_r * 0.14 + nr * 1.6], fill=(90, 50, 40))

    # ogen
    eye_r = size * 0.032
    for dx in (-1, 1):
        ex = cx + dx * body_r * 0.36
        ey = cy - body_r * 0.06
        draw.ellipse([ex - eye_r, ey - eye_r, ex + eye_r, ey + eye_r], fill=(50, 35, 30))
        hr = eye_r * 0.4
        draw.ellipse([ex - hr - eye_r * 0.3, ey - hr - eye_r * 0.35, ex + hr - eye_r * 0.3, ey + hr - eye_r * 0.35],
                     fill=(255, 255, 255))

    # highlight glans bovenop
    hl_r = body_r * 0.5
    hx, hy = cx - body_r * 0.35, cy - body_r * 0.55
    overlay = Image.new("RGBA", draw._image.size, (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    odraw.ellipse([hx - hl_r, hy - hl_r * 0.6, hx + hl_r, hy + hl_r * 0.6], fill=(255, 255, 255, 70))
    draw._image.alpha_composite(overlay) if draw._image.mode == "RGBA" else None


def make_icon(size, maskable=False, filename=None):
    pad = int(size * 0.14) if maskable else 0
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    # gradient achtergrond: fris groen -> blauw-groen, rond badge
    bg = radial_gradient(size, (size * 0.38, size * 0.32), size * 0.85, (140, 224, 120), (46, 168, 130))
    bg = bg.convert("RGBA")
    mask = rounded_mask(size, size if not maskable else int(size * 0.22))
    canvas.paste(bg, (0, 0), mask)

    draw = ImageDraw.Draw(canvas, "RGBA")
    inner = size - pad * 2
    tmp = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(tmp, "RGBA")
    draw_critter(tdraw, size - pad * 2)
    tmp = tmp.crop((0, 0, size - pad * 2, size - pad * 2))
    canvas.alpha_composite(tmp, (pad, pad))

    # zachte rand-glow
    canvas = canvas.filter(ImageFilter.SMOOTH_MORE) if size <= 64 else canvas

    out = f"{OUT}/{filename}"
    canvas.save(out, "PNG")
    print("wrote", out)


make_icon(192, filename="icon-192.png")
make_icon(512, filename="icon-512.png")
make_icon(512, maskable=True, filename="icon-maskable-512.png")
make_icon(180, filename="apple-touch-icon.png")
make_icon(32, filename="favicon-32.png")
make_icon(16, filename="favicon-16.png")
