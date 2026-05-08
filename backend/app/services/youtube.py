import os
import tempfile
import yt_dlp
from openai import OpenAI

# Initialize OpenAI client. 
# It will automatically use the OPENAI_API_KEY environment variable.
# For local dev without a key, this will fail on initialization, so we instantiate it when needed or handle the error.
def get_openai_client():
    return OpenAI()

def process_youtube_video(url: str) -> str:
    """
    Downloads audio from a YouTube video and transcribes it using OpenAI Whisper.
    """
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': os.path.join(tempfile.gettempdir(), '%(id)s.%(ext)s'),
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            # yt-dlp might change the extension to mp3 because of postprocessors
            audio_file = os.path.join(tempfile.gettempdir(), f"{info['id']}.mp3")
            
            # If the postprocessor didn't run (e.g., ffmpeg missing), fallback to the original download path
            if not os.path.exists(audio_file):
                 audio_file = ydl.prepare_filename(info)

            # Transcribe with Whisper
            client = get_openai_client()
            with open(audio_file, "rb") as file:
                transcription = client.audio.transcriptions.create(
                  model="whisper-1", 
                  file=file
                )
            
            # Clean up audio file
            if os.path.exists(audio_file):
                os.remove(audio_file)
                
            return transcription.text
    except Exception as e:
        print(f"Error processing YouTube video: {e}")
        return f"Error: Could not transcribe video. Detail: {str(e)}"
