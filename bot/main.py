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
        guild_id = message.guild.id
        config = await asyncio.to_thread(bot.db.get_guild_config, guild_id)
        
        return config.get("prefix", "!")
    except Exception as e:
        print(f"Error cargando prefijo dinámico: {e}")
        return "!"

bot = commands.Bot(command_prefix=determinar_prefijo, intents=intents)

@bot.event
async def on_ready():
    print(f"Conectado como {bot.user} - Inicializando clanes...", flush=True)
    for guild in bot.guilds:
        print(f"Registrando guild: {guild.id}", flush=True)
        await asyncio.to_thread(bot.db.get_guild_config, guild.id)
    print("Registros completados.", flush=True)

@bot.event
async def on_guild_join(guild):
    print(f"Nuevo guild: {guild.id}", flush=True)
    await asyncio.to_thread(bot.db.get_guild_config, guild.id)

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