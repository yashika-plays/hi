from flask import Flask, render_template, request, session
from flask_session import Session
import requests
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    if 'ip_history' not in session:
        session['ip_history'] = []

    # Get current IP
    current_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if current_ip not in session['ip_history']:
        session['ip_history'].append(current_ip)

    # Default number of videos
    num_videos = 1
    video_urls = []

    if request.method == 'POST':
        num_videos = int(request.form.get('num_videos', 1))
        video_urls = [request.form.get(f'video_url_{i}', '') for i in range(num_videos)]
        session['video_urls'] = video_urls
        session['num_videos'] = num_videos
    else:
        video_urls = session.get('video_urls', [''])
        num_videos = session.get('num_videos', len(video_urls))

    return render_template('index.html',
                           current_ip=current_ip,
                           ip_history=session['ip_history'],
                           video_urls=video_urls,
                           num_videos=num_videos)
