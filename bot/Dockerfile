FROM python:3.12-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para psycopg
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Comando para ejecutar el bot
CMD ["python", "-u", "main.py"]
