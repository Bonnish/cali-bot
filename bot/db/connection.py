import psycopg
from psycopg_pool import ConnectionPool
from config import DB_CONFIG

class Database:
    def __init__(self):
        self.conn_info = f"host={DB_CONFIG['host']} port={DB_CONFIG['port']} dbname={DB_CONFIG['dbname']} user={DB_CONFIG['user']} password={DB_CONFIG['password']}"
        self.pool = ConnectionPool(self.conn_info, open=True)

    def get_guild_lang(self, guild_id: int):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT language FROM guilds WHERE guild_id = %s", (guild_id,))
                result = cur.fetchone()
                if result: return result[0]
                
                cur.execute("INSERT INTO guilds (guild_id, language) VALUES (%s, %s) ON CONFLICT DO NOTHING", (guild_id, 'en'))
                conn.commit()
                return "en"

    def set_guild_lang(self, guild_id: int, lang: str):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO guilds (guild_id, language) VALUES (%s, %s)
                    ON CONFLICT (guild_id) DO UPDATE SET language = EXCLUDED.language
                """, (guild_id, lang))
                conn.commit()