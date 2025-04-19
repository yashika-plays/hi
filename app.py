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
        return None  # Return None if the URL is invalid

    return f"https://www.youtube.com/embed/{video_id}?autoplay=1&mute=1&loop=1&playlist={video_id}&vq=small"

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        url = request.form.get('video_url')  # Get the video URL from the form
        embed_url = convert_to_embed(url)  # Convert URL to embeddable format

        if embed_url:
            videos = [embed_url] * 9  # Play the same video in 9 boxes
            session['videos'] = videos  # Store the video URLs in session
            session['play_count'] = 0
            session['ips'] = []
            session['data_used'] = 0
            return redirect(url_for('index'))

    videos = session.get('videos', [])  # Get the list of videos to display
    return render_template('index.html', videos=videos)  # Render the page with videos

if __name__ == '__main__':
    app.run(debug=True)
