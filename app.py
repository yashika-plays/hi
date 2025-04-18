from flask import Flask, render_template, request, session
import os
from datetime import timedelta
from flask import jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)
app.secret_key = os.urandom(24)
app.permanent_session_lifetime = timedelta(days=365)

views = 0
ip_list = []

@app.route('/', methods=['GET', 'POST'])
def index():
    global views, ip_list

    if request.method == 'POST':
        urls = request.form.getlist('video_url')
        counts = request.form.getlist('video_count')
        video_data = []

        for i in range(len(urls)):
            for _ in range(int(counts[i])):
                video_data.append(urls[i])

        session['video_data'] = video_data
        return render_template('index.html', videos=video_data, views=views, ip_list=ip_list)

    video_data = session.get('video_data', [])
    views += 1

    user_ip = request.remote_addr
    ip_list.append(user_ip)

    return render_template('index.html', videos=video_data, views=views, ip_list=ip_list)


@app.route('/reset', methods=['POST'])
def reset_data():
    global views, ip_list
    views = 0
    ip_list = []
    return jsonify({'message': 'Data reset successful'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
