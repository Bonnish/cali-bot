from discord.ext import commands
from utils.translator import translator
import asyncio
import discord

class Configuration(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    # Configuracion de idioma
    @commands.command()
    @commands.has_permissions(administrator=True)
    async def set_lang(self, ctx, nuevo_idioma: str = None):
        idioma_actual = await asyncio.to_thread(self.bot.db.get_guild_lang, ctx.guild.id)
        idiomas_disponibles = ["es", "en"]
        if nuevo_idioma is None:
            msg = translator.translate("error_missing_lang", lang=idioma_actual)
            return await ctx.send(msg)
        
        nuevo_idioma = nuevo_idioma.lower()

        if nuevo_idioma not in idiomas_disponibles:
            msg = translator.translate(
                "error_invalid_lang", 
                lang=idioma_actual, 
                list=", ".join(idiomas_disponibles)
            )
            return await ctx.send(msg)
        
        await asyncio.to_thread(self.bot.db.set_guild_lang, ctx.guild.id, nuevo_idioma)

        confirmacion = translator.translate("lang_updated", lang=nuevo_idioma)
        await ctx.send(f"✅ {confirmacion}")
        
    @set_lang.error
    async def setlang_error(self, ctx, error):
        if isinstance(error, commands.MissingPermissions):
            idioma = await asyncio.to_thread(self.bot.db.get_guild_lang, ctx.guild.id)
            msg = translator.translate("error_no_perms", lang=idioma)
            await ctx.send(msg)

async def setup(bot):
    await bot.add_cog(Configuration(bot))