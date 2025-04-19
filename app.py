from flask import Flask, render_template, request, redirect, url_for, session
import random

app = Flask(__name__)
app.secret_key = 'your-secret-key'

def convert_to_embed(url):
    if 'youtube.com/shorts/' in url:
        video_id = url.split('/')[-1].split('?')[0]
    elif 'watch?v=' in url:
        video_id = url.split('watch?v=')[-1].split('&')[0]
    elif 'youtu.be/' in url:
        video_id = url.split('/')[-1].split('?')[0]
    else:
        return None  # not valid

    return f"https://www.youtube.com/embed/{video_id}?autoplay=1&mute=1&loop=1&playlist={video_id}&vq=small"

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        urls = request.form.getlist('video_url')
        box_counts = request.form.getlist('video_count')
        combined = []

        for url, count in zip(urls, box_counts):
            embed = convert_to_embed(url)
            if embed:
                combined.extend([embed] * int(count))

        session['videos'] = combined
        session['play_count'] = 0
        session['ips'] = []
        session['data_used'] = 0
        return redirect(url_for('index'))

    videos = session.get('videos', [])
    return render_template('index.html', videos=videos)
