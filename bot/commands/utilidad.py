from discord.ext import commands
from utils.translator import translator
import asyncio
import discord

class Utilidad(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    # Comando de Ping
    @commands.command()
    async def ping(self, ctx):
        try:
            idioma = await asyncio.to_thread(self.bot.db.get_guild_lang, ctx.guild.id)

            latencia = round(self.bot.latency * 1000)
            embed = discord.Embed(
                title="🏓 Pong!",
                description=translator.translate("ping_message", lang=idioma, ms=latencia),
                color=discord.Color.blue()
            )
            await ctx.send(embed=embed)
        except Exception as e:
                print(f"❌ ERROR EN PING: {e}")

async def setup(bot):
    await bot.add_cog(Utilidad(bot))