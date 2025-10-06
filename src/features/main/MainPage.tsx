import { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import './MainPage.css';

const MainPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     try {
    //         const response = await api.login({ email, password });
    //         dispatch(setCredentials(response.data));
    //     } catch (error) {
    //         console.error('Login failed:', error);
    //     }
    // };

    return (

        <div className="main-container">
            <h1 className={'header1'}>Pulsar</h1>
            <h2 className={'header2'}>пульс этого города</h2>

                <button className={'submit-button'} type="submit">Войти</button>
        </div>
    );
};

export default MainPage;