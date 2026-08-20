#!/usr/bin/env python3
"""Descargador de videos de YouTube. Uso: python3 ytdl.py <url> [carpeta_destino]"""

import sys

from yt_dlp import YoutubeDL


def main():
    if len(sys.argv) < 2:
        print("Uso: python3 ytdl.py <url> [carpeta_destino]")
        sys.exit(1)

    url = sys.argv[1]
    destino = sys.argv[2] if len(sys.argv) > 2 else "."

    opciones = {
        "outtmpl": f"{destino}/%(title)s.%(ext)s",
        "format": "bestvideo+bestaudio/best",
    }

    with YoutubeDL(opciones) as ydl:
        ydl.download([url])


if __name__ == "__main__":
    main()
