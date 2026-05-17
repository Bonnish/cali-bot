import discord
from discord.ext import commands
import asyncio
import random
from utils.translator import translator

class XP(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.cooldowns = {}

    # Leaderboard

    @commands.command(aliases=["top", "lb"])
    async def leaderboard(self, ctx):
        idioma = await asyncio.to_thread(self.bot.db.get_guild_lang, ctx.guild.id)
        top_users = await asyncio.to_thread(self.bot.db.get_top_users, ctx.guild.id, 10)

        if not top_users:
            msg = translator.translate("error_no_leaderboard", lang=idioma)
            return await ctx.send(msg)

        titulo = translator.translate("leaderboard_title", lang=idioma, server=ctx.guild.name)
        desc = translator.translate("leaderboard_desc", lang=idioma)

        embed = discord.Embed(title=titulo, color=discord.Color.gold(), description=desc)
        
        for i, user_data in enumerate(top_users, 1):
            user_id, xp, level = user_data
            medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"**{i}.**"
            
            embed.add_field(
                name=f"{medal} Position", 
                value=f"<@{user_id}>\n**Level:** `{level}` | **XP:** `{xp}`", 
                inline=False
            )

        await ctx.send(embed=embed)

    # Rank

    @commands.command(aliases=["level", "rango"])
    async def rank(self, ctx, member: discord.Member = None):
        member = member or ctx.author

        try:
            config = await asyncio.to_thread(self.bot.db.get_guild_config, ctx.guild.id)
            idioma = config["language"]
            stats = await asyncio.to_thread(self.bot.db.get_user_xp, ctx.guild.id, member.id)

            xp, nivel = (stats[0], stats[1]) if stats else (0, 1)
            xp_necesaria = nivel * 500

            card_texts = {
                "level": translator.translate("card_level", lang=idioma),
                "rank": translator.translate("card_rank", lang=idioma)
            }

            from utils.cards import generate_rank_card
            
            async with ctx.typing():
                file = await generate_rank_card(
                    member.display_name, 
                    xp, 
                    xp_necesaria, 
                    nivel, 
                    member.display_avatar.url,
                    card_texts
                )
                await ctx.send(file=file)
        except Exception as e:
            print(f"--- ERROR CRÍTICO EN RANK ---")
            print(e)
    

    # XP

    @commands.Cog.listener()
    async def on_message(self, message):
        if message.author.bot or not message.guild:
            return

        config = await asyncio.to_thread(self.bot.db.get_guild_config, message.guild.id)
        
        prefix = config.get("prefix", "!")
        if message.content.startswith(prefix):
            return

        if not config["xp_enabled"]:
            return
        
        user_id = message.author.id
        guild_id = message.guild.id

        if (guild_id, user_id) in self.cooldowns:
            return
        
        base_xp = config["xp_per_message"]
        xp_to_add = random.randint(base_xp - 5, base_xp + 5)
    
        stats = await asyncio.to_thread(self.bot.db.add_xp, guild_id, user_id, xp_to_add)
        
        xp_total, nivel_anterior = stats[0], stats[1]
        xp_necesaria = nivel_anterior * 500 

        if xp_total >= xp_necesaria:
            nuevo_nivel = nivel_anterior + 1
            await asyncio.to_thread(self.bot.db.update_level, guild_id, user_id, nuevo_nivel)
            
            msg = translator.translate("level_up", lang=config["language"], level=nuevo_nivel, user=message.author.mention)
            await message.channel.send(msg)

        self.cooldowns[(guild_id, user_id)] = True
        await asyncio.sleep(30)
        self.cooldowns.pop((guild_id, user_id), None)

async def setup(bot):
    await bot.add_cog(XP(bot))