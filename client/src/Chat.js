import React, { useEffect, useState } from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, username, room }) {
	const [currentMessage, setCurrentMessage] = useState('');
	const [MessageList, setMessageList] = useState([]);

	const sendMessage = async () => {
		if (currentMessage !== '') {
			const messageData = {
				id: Math.random().toString(16).slice(2),
				room: room,
				author: username,
				message: currentMessage,
				time:
					new Date(Date.now()).getHours() +
					':' +
					new Date(Date.now()).getMinutes(),
			};

			await socket.emit('send_message', messageData);
			setMessageList((list) => [...list, messageData]);
			setCurrentMessage('');
		}
	};

	useEffect(() => {
		return () =>
			socket.on('recieve_message', (data) => {
				setMessageList((list) => [...list, data]);
			});
	}, [socket]);

	return (
		<div className="chat-window">
			<div className="chat-header">
				<p>Live Chat</p>
			</div>
			<div className="chat-body">
				<ScrollToBottom className="message-container">
					{MessageList.map((messageContent) => {
						return (
							<div
								key={messageContent.id}
								className="message"
								id={username === messageContent.author ? 'you' : 'other'}
							>
								<div className="message-content">
									<p>{messageContent.message} </p>
								</div>
								<div className="message-meta">
									<p id="time">{messageContent.time}</p>
									<p id="author">{messageContent.author}</p>
								</div>
							</div>
						);
					})}
				</ScrollToBottom>
			</div>

			<div className="chat-footer">
				<input
					type="text"
					value={currentMessage}
					placeholder="Hey..."
					onChange={(event) => {
						setCurrentMessage(event.target.value);
					}}
					onKeyPress={(event) => {
						event.key === 'Enter' && sendMessage();
					}}
				/>
				<button onClick={sendMessage}>&#9658;</button>
			</div>
		</div>
	);
}

export default Chat;
