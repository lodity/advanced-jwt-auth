import React, { useContext, useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import { Context } from './index';
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';
import { deflateRaw } from 'zlib';
import UserService from './services/UserService';

function App() {
	const { store } = useContext(Context);
	const [users, setUsers] = useState<IUser[]>([]);
	useEffect(() => {
		if (localStorage.getItem('token')) {
			store.checkAuth();
		}
	}, []);

	async function getUsers() {
		try {
			const response = await UserService.fetchUsers();
			setUsers(response.data);
		} catch (e) {
			console.log(e);
		}
	}

	if (store.isLoading) {
		return <div>Loading...</div>;
	}
	if (!store.isAuth) {
		return (
			<div>
				<LoginForm />
				<button onClick={getUsers}>Get users</button>
			</div>
		);
	}

	return (
		<div className="App">
			<h1>
				{store.isAuth
					? `User is authorized ${store.user.email}`
					: 'Login please'}
			</h1>
			<h2>
				{store.user.isActivated
					? 'User verified by email'
					: 'Verify your account'}
			</h2>
			<button onClick={() => store.logout()}>Logout</button>
			<div>
				<button onClick={getUsers}>Get users</button>
			</div>
			{users.map((user) => (
				<div key={user.email}>{user.email}</div>
			))}
		</div>
	);
}

export default observer(App);
