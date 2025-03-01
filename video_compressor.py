import subprocess
import os
import tkinter as tk
from tkinter import filedialog
from tkinter import ttk
from tkinter import messagebox

def estimate_size(input_file, bitrate):
    duration_cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration",
                    "-of", "default=noprint_wrappers=1:nokey=1", input_file]
    result = subprocess.run(duration_cmd, capture_output=True, text=True)
    duration = float(result.stdout.strip())
    return round((bitrate * duration / 8) / 1024, 2)  # MB

def compress_video(input_file, bitrate, output_file, resolution, audio_bitrate=128, crf=23):
    cmd = [
        "ffmpeg", "-i", input_file,
        "-b:v", f"{bitrate}k",
        "-b:a", f"{audio_bitrate}k",
        "-vf", f"scale={resolution}",
        "-crf", str(crf),
        "-y", output_file
    ]
    subprocess.run(cmd)

class VideoCompressorGUI:
    def __init__(self, master):
        self.master = master
        self.file_path = None
        self.bitrate_var = tk.IntVar(value=800)
        self.bitrate_scale = tk.Scale(master, from_=100, to=2000, variable=self.bitrate_var,
                                      orient=tk.HORIZONTAL, label="Bitrate (kbps)")
        self.bitrate_scale.pack()
        self.resolution_var = tk.StringVar(value="1280:720")
        self.resolution_combo = ttk.Combobox(master, textvariable=self.resolution_var,
                                             values=["640:360", "854:480", "1280:720", "1920:1080"])
        self.resolution_combo.pack()
        tk.Button(master, text="Select File", command=self.select_file).pack()
        self.format_var = tk.StringVar(value="mp4")
        ttk.Combobox(master, textvariable=self.format_var,
                     values=["mp4","mov","avi"]).pack()
        tk.Button(master, text="Estimate", command=self.on_estimate).pack()
        tk.Button(master, text="Compress", command=self.on_compress).pack()

        self.audio_bitrate_var = tk.IntVar(value=128)
        self.crf_var = tk.IntVar(value=23)

        # Aesthetic frame
        frame_options = ttk.LabelFrame(master, text="Additional Options", padding=10)
        frame_options.pack(pady=10, fill=tk.X)
        tk.Label(frame_options, text="Audio Bitrate (kbps):").pack(anchor=tk.W)
        tk.Scale(frame_options, from_=64, to=384, variable=self.audio_bitrate_var,
                 orient=tk.HORIZONTAL).pack(fill=tk.X)
        tk.Label(frame_options, text="CRF (Quality):").pack(anchor=tk.W)
        tk.Scale(frame_options, from_=18, to=28, variable=self.crf_var,
                 orient=tk.HORIZONTAL).pack(fill=tk.X)

        tk.Button(master, text="Select Output Folder", command=self.select_output_folder).pack()
        self.output_folder = ''

    def select_file(self):
        self.file_path = filedialog.askopenfilename(filetypes=[("Video files","*.mp4 *.mov *.avi")])

    def select_output_folder(self):
        self.output_folder = filedialog.askdirectory()

    def on_estimate(self):
        if not self.file_path: return
        import math
        original_size_mb = math.ceil(os.path.getsize(self.file_path) / (1 << 20))
        audio_factor = self.audio_bitrate_var.get() / 128
        compressed_size_mb = estimate_size(self.file_path, self.bitrate_var.get()) * audio_factor
        messagebox.showinfo("Estimate",
                            f"Original - {original_size_mb} MB; Compressed - {compressed_size_mb} MB")

    def on_compress(self):
        if not self.file_path: return
        ext = self.format_var.get()
        output_file = (
            os.path.join(self.output_folder, f"output.{ext}")
            if self.output_folder else f"output.{ext}"
        )
        compress_video(self.file_path, self.bitrate_var.get(), output_file,
                       self.resolution_var.get(), audio_bitrate=self.audio_bitrate_var.get(),
                       crf=self.crf_var.get())

if __name__ == "__main__":
    root = tk.Tk()
    app = VideoCompressorGUI(root)
    root.mainloop()
