import axios from 'axios'
import { useContext, useState } from 'react'
import ReactCodeInput from 'react-code-input'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../context/socketContext'
import { getStorageItem, getUserId, saveStorageItem } from '../storage/localStorage'

const TwoFa = ({user, setUser}) => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const socket = useContext(ChatContext);

    const getCode = (code) => {
        console.log(code)
        setCode(code)
    }

    const send2faCode = (event) => {
        event.preventDefault()
        axios
            .post('http://localhost:3001/api/auth/2fa/authenticate', {
                twoFactorAuthenticationCode: code
            }, {
                withCredentials: true
            })
            .then(response => {
                console.log('2fa login')
                socket.userId = response.data.id
                socket.emit('login', {
                    user: response.data,
                    socketId: socket.id,
                    status: 'online'
                })
            })
    }

    return (
        <div>
            {
                <div>
                    <p> Enter code from GoogleAuthenticator app </p>
                    <form onSubmit={send2faCode}>
                        <ReactCodeInput type='text' fields={6} onChange={getCode} />
                        <button type="submit"> confirm </button>
                    </form>
                </div>
            }
        </div>
    )
}

export default TwoFa