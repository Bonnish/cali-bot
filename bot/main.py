import discord
from discord.ext import commands
from db.connection import Database
import asyncio
from config import DISCORD_TOKEN

intents = discord.Intents.default()
intents.message_content = True
intents.members = True
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"Conectado como {bot.user}")

async def load_extensions():
    await bot.load_extension("commands.utilidad")
    await bot.load_extension("commands.configuration")
    await bot.load_extension("commands.xp")

async def main():
    async with bot:
        bot.db = Database()
        await load_extensions()
        await bot.start(DISCORD_TOKEN)

asyncio.run(main())