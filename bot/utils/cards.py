import discord
from PIL import Image, ImageDraw, ImageFont, ImageOps
import io
import requests
async def generate_rank_card(user_name, current_xp, next_xp, level, avatar_url, texts, bg_style="default", bar_color="#2ecc71"):
    width, height = 900, 280
    
    if bg_style == 'dark':
        card = Image.new('RGB', (width, height), color=(0, 0, 0))
    elif bg_style == 'cali':
        c1 = (255, 123, 0)
        c2 = (160, 82, 45)
        base = Image.new('RGB', (width, height), c1)
        top = Image.new('RGB', (width, height), c2)
        gradient = Image.new('L', (2, 2))
        gradient.putpixel((0, 0), 0)
        gradient.putpixel((1, 0), 127)
        gradient.putpixel((0, 1), 127)
        gradient.putpixel((1, 1), 255)
        gradient = gradient.resize((width, height), Image.Resampling.BICUBIC)
        card = Image.composite(top, base, gradient)
    else:
        card = Image.new('RGB', (width, height), color=(24, 25, 28))
        
    card = card.convert('RGBA')
    draw = ImageDraw.Draw(card)

    try:
        response = requests.get(avatar_url)
        avatar_bytes = io.BytesIO(response.content)
        avatar = Image.open(avatar_bytes).convert("RGBA")
    except Exception as e:
        avatar = Image.new("RGBA", (180, 180), color=(50, 50, 50))

    avatar = avatar.resize((180, 180))
    mask = Image.new('L', (180, 180), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, 180, 180), fill=255)
    avatar = ImageOps.fit(avatar, mask.size, centering=(0.5, 0.5))
    avatar.putalpha(mask)
    
    # Avatar ring
    color_hex = bar_color.lstrip('#')
    try:
        r, g, b = tuple(int(color_hex[i:i+2], 16) for i in (0, 2, 4))
    except:
        r, g, b = (46, 204, 113)
        
    draw.ellipse((30, 40, 230, 240), outline=(r, g, b, 255), width=6)
    card.paste(avatar, (40, 50), avatar)

    try:
        font_name = ImageFont.truetype("arial.ttf", 45)
        font_stats = ImageFont.truetype("arial.ttf", 26)
        font_level = ImageFont.truetype("arial.ttf", 26)
    except:
        font_name = ImageFont.load_default()
        font_stats = ImageFont.load_default()
        font_level = ImageFont.load_default()

    draw.text((270, 55), f"{user_name}", font=font_name, fill=(255, 255, 255))
    
    # Level badge
    txt_level_label = texts.get("level", "LEVEL").upper()
    level_text = f"{txt_level_label} {level}"
    text_w = draw.textlength(level_text, font=font_level)
    draw.rounded_rectangle((270, 115, 270 + text_w + 30, 155), radius=8, fill=(r, g, b, 255))
    draw.text((285, 122), level_text, font=font_level, fill=(0, 0, 0, 255))
    
    # XP Text
    xp_text = f"{current_xp} / {next_xp} XP"
    draw.text((840 - draw.textlength(xp_text, font=font_stats), 122), xp_text, font=font_stats, fill=(200, 200, 200))

    bar_x, bar_y, bar_w, bar_h = 270, 180, 570, 35
    
    draw.rounded_rectangle(
        (bar_x, bar_y, bar_x + bar_w, bar_y + bar_h), 
        radius=17, fill=(0, 0, 0, 180)
    )
    
    progress = current_xp / next_xp if next_xp > 0 else 0
    if progress > 1: progress = 1
    current_bar_w = bar_w * progress
    
    if current_bar_w > 10:
        draw.rounded_rectangle(
            (bar_x, bar_y, bar_x + current_bar_w, bar_y + bar_h), 
            radius=17, fill=(r, g, b, 255)
        )

    img_byte_arr = io.BytesIO()
    card.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return discord.File(fp=img_byte_arr, filename='rank_card.png')

async def generate_welcome_card(user_name, avatar_url, server_name, member_count, bg_style="default", bar_color="#2ecc71"):
    width, height = 900, 280
    
    if bg_style == 'dark':
        card = Image.new('RGB', (width, height), color=(0, 0, 0))
    elif bg_style == 'cali':
        c1 = (255, 123, 0)
        c2 = (160, 82, 45)
        base = Image.new('RGB', (width, height), c1)
        top = Image.new('RGB', (width, height), c2)
        gradient = Image.new('L', (2, 2))
        gradient.putpixel((0, 0), 0)
        gradient.putpixel((1, 0), 127)
        gradient.putpixel((0, 1), 127)
        gradient.putpixel((1, 1), 255)
        gradient = gradient.resize((width, height), Image.Resampling.BICUBIC)
        card = Image.composite(top, base, gradient)
    else:
        card = Image.new('RGB', (width, height), color=(24, 25, 28))
        
    card = card.convert('RGBA')
    draw = ImageDraw.Draw(card)

    try:
        response = requests.get(avatar_url)
        avatar_bytes = io.BytesIO(response.content)
        avatar = Image.open(avatar_bytes).convert("RGBA")
    except Exception as e:
        avatar = Image.new("RGBA", (180, 180), color=(50, 50, 50))

    avatar = avatar.resize((180, 180))
    mask = Image.new('L', (180, 180), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, 180, 180), fill=255)
    avatar = ImageOps.fit(avatar, mask.size, centering=(0.5, 0.5))
    avatar.putalpha(mask)
    
    color_hex = bar_color.lstrip('#')
    try:
        r, g, b = tuple(int(color_hex[i:i+2], 16) for i in (0, 2, 4))
    except:
        r, g, b = (46, 204, 113)
        
    draw.ellipse((30, 40, 230, 240), outline=(r, g, b, 255), width=6)
    card.paste(avatar, (40, 50), avatar)

    try:
        font_title = ImageFont.truetype("arial.ttf", 55)
        font_sub = ImageFont.truetype("arial.ttf", 30)
    except:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    draw.text((270, 70), f"BIENVENIDO", font=font_title, fill=(r, g, b, 255))
    draw.text((270, 130), f"{user_name}", font=font_title, fill=(255, 255, 255, 255))
    draw.text((270, 200), f"Eres el miembro #{member_count} en {server_name}", font=font_sub, fill=(200, 200, 200, 255))

    img_byte_arr = io.BytesIO()
    card.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return discord.File(fp=img_byte_arr, filename='welcome_card.png')