import discord
from discord.ext import commands
from db.connection import Database
import asyncio
from config import DISCORD_TOKEN

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

async def determinar_prefijo(bot, message):
    if not message.guild:
        return "!"
    try:
        config = await asyncio.to_thread(bot.db.get_guild_config, message.guild.id)
        
        return config.get("prefix", "!")
    except Exception as e:
        print(f"Error cargando prefijo dinámico: {e}")
        return "!"

bot = commands.Bot(command_prefix=determinar_prefijo, intents=intents)

@bot.event
async def on_ready():
    print(f"Conectado como {bot.user}")

async def load_extensions():
    await bot.load_extension("commands.utilidad")
    await bot.load_extension("commands.configuration")
    await bot.load_extension("commands.xp")
    await bot.load_extension("commands.moderation")

async def main():
    async with bot:
        bot.db = Database()
        await load_extensions()
        await bot.start(DISCORD_TOKEN)

asyncio.run(main())