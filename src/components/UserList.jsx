const UserList = ({ users }) => {
    return (
        <ul className="user-list">
                    {users.map((user, index) => (
                        <li key={index}>Пользователь: {user.username}</li>
                    ))}
                </ul>
    )
}

export default UserList;