import urllib.parse

from flask import Flask, render_template
from flask_socketio import SocketIO, Namespace


app = Flask(__name__)
socket = SocketIO(app)


@app.route('/')
def index():
    return render_template('socket.html')


class CustomNamespace(Namespace):
    def on_connect(self):
        self.emit('socket_connect', {'msg': '欢迎使用'})

    def on_disconnect(self):
        pass

    def on_message_admin(self, message):
        message['username'] = urllib.parse.unquote(message['username'])
        message['content'] = urllib.parse.unquote(message['content'])
        self.emit('message_admin',message)

    def on_message_user(self, message):
        message['username'] = urllib.parse.unquote(message['username'])
        message['content'] = urllib.parse.unquote(message['content'])
        self.emit('message_user',message)


socket.on_namespace(CustomNamespace('/socket'))


if __name__ == '__main__':
    socket.run(app, debug=True)