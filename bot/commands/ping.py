from discord.ext import commands
import discord

class Utilidad(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    # Comando de Ping
    @commands.command()
    async def ping(self, ctx):
        latencia = round(self.bot.latency * 1000)
        embed = discord.Embed(
            title="🏓 Pong!",
            description=f"La latencia actual es de **{latencia}ms**",
            color=discord.Color.blue()
        )
        await ctx.send(embed=embed)

async def setup(bot):
    await bot.add_cog(Utilidad(bot))