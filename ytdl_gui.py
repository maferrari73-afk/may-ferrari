#!/usr/bin/env python3
"""Descargador de videos de YouTube con interfaz gráfica y selector de calidad.

Requisitos: pip install yt-dlp
Ejecutar:   python ytdl_gui.py
"""

import threading
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, ttk

from yt_dlp import YoutubeDL

CALIDADES = {
    "Máxima calidad disponible": "bestvideo+bestaudio/best",
    "1080p": "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
    "720p": "bestvideo[height<=720]+bestaudio/best[height<=720]",
    "480p": "bestvideo[height<=480]+bestaudio/best[height<=480]",
}


class DescargadorApp:
    def __init__(self, root):
        self.root = root
        root.title("Descargador de YouTube")
        root.geometry("480x220")
        root.resizable(False, False)

        self.carpeta_destino = str(Path.home() / "Desktop")

        tk.Label(root, text="URL del video:").pack(anchor="w", padx=12, pady=(12, 0))
        self.entry_url = tk.Entry(root, width=60)
        self.entry_url.pack(padx=12, fill="x")

        tk.Label(root, text="Calidad:").pack(anchor="w", padx=12, pady=(12, 0))
        self.combo_calidad = ttk.Combobox(root, values=list(CALIDADES.keys()), state="readonly")
        self.combo_calidad.current(0)
        self.combo_calidad.pack(padx=12, fill="x")

        frame_carpeta = tk.Frame(root)
        frame_carpeta.pack(padx=12, pady=(12, 0), fill="x")
        self.label_carpeta = tk.Label(frame_carpeta, text=f"Guardar en: {self.carpeta_destino}", anchor="w")
        self.label_carpeta.pack(side="left", fill="x", expand=True)
        tk.Button(frame_carpeta, text="Elegir carpeta...", command=self.elegir_carpeta).pack(side="right")

        self.boton_descargar = tk.Button(root, text="Descargar", command=self.iniciar_descarga)
        self.boton_descargar.pack(pady=16)

        self.label_estado = tk.Label(root, text="", fg="gray")
        self.label_estado.pack()

    def elegir_carpeta(self):
        carpeta = filedialog.askdirectory(initialdir=self.carpeta_destino)
        if carpeta:
            self.carpeta_destino = carpeta
            self.label_carpeta.config(text=f"Guardar en: {self.carpeta_destino}")

    def iniciar_descarga(self):
        url = self.entry_url.get().strip()
        if not url:
            messagebox.showwarning("Falta la URL", "Pegá la URL del video antes de descargar.")
            return

        self.boton_descargar.config(state="disabled")
        self.label_estado.config(text="Descargando...", fg="blue")

        hilo = threading.Thread(target=self._descargar, args=(url,), daemon=True)
        hilo.start()

    def _descargar(self, url):
        formato = CALIDADES[self.combo_calidad.get()]
        opciones = {
            "outtmpl": f"{self.carpeta_destino}/%(title)s.%(ext)s",
            "format": formato,
            "progress_hooks": [self._progreso],
        }
        try:
            with YoutubeDL(opciones) as ydl:
                ydl.download([url])
            self.root.after(0, self._descarga_completa)
        except Exception as error:
            self.root.after(0, self._descarga_fallo, str(error))

    def _progreso(self, estado):
        if estado["status"] == "downloading":
            porcentaje = estado.get("_percent_str", "").strip()
            self.root.after(0, lambda: self.label_estado.config(text=f"Descargando... {porcentaje}", fg="blue"))

    def _descarga_completa(self):
        self.label_estado.config(text="¡Listo! Video descargado.", fg="green")
        self.boton_descargar.config(state="normal")

    def _descarga_fallo(self, error):
        self.label_estado.config(text="Error en la descarga.", fg="red")
        self.boton_descargar.config(state="normal")
        messagebox.showerror("Error", error)


if __name__ == "__main__":
    ventana = tk.Tk()
    DescargadorApp(ventana)
    ventana.mainloop()
