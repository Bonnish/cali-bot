import discord
from PIL import Image, ImageDraw, ImageFont, ImageOps
import io
import requests

async def generate_rank_card(user_name, current_xp, next_xp, level, avatar_url, texts):
    width, height = 900, 280
    card = Image.new('RGB', (width, height), color=(24, 25, 28))
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
    card.paste(avatar, (40, 50), avatar)

    try:
        font_name = ImageFont.truetype("arial.ttf", 45)
        font_stats = ImageFont.truetype("arial.ttf", 28)
        font_level = ImageFont.truetype("arial.ttf", 32)
    except:
        font_name = ImageFont.load_default()
        font_stats = ImageFont.load_default()
        font_level = ImageFont.load_default()

    txt_level_label = texts.get("level", "LEVEL")
    draw.text((250, 60), f"{user_name}", font=font_name, fill=(255, 255, 255))
    draw.text((250, 120), f"{txt_level_label}: {level}", font=font_level, fill=(255, 215, 0))
    xp_text = f"{current_xp} / {next_xp} XP"
    draw.text((860 - draw.textlength(xp_text, font=font_stats), 130), xp_text, font=font_stats, fill=(170, 170, 170))

    bar_x, bar_y, bar_w, bar_h = 250, 180, 610, 35
    
    draw.rounded_rectangle(
        (bar_x, bar_y, bar_x + bar_w, bar_y + bar_h), 
        radius=18, fill=(45, 47, 52)
    )
    
    progress = current_xp / next_xp if next_xp > 0 else 0
    if progress > 1: progress = 1
    current_bar_w = bar_w * progress
    
    if current_bar_w > 10:
        draw.rounded_rectangle(
            (bar_x, bar_y, bar_x + current_bar_w, bar_y + bar_h), 
            radius=18, fill=(46, 204, 113)
        )

    img_byte_arr = io.BytesIO()
    card.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return discord.File(fp=img_byte_arr, filename='rank_card.png')