import React, { useEffect, useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const Home = () => {
    const items = ['Sabanas(1p)', 'Sabanas(2p)', 'toallas', 'toallones', 'fundas'];
    const initialCount = items.reduce((acc, item) => ({ ...acc, [item]: 0 }), {});
    const [count, setCount] = useState(initialCount);
    const [move, setMove] = useState([]);

    useEffect(() => {
        const storedCount = sessionStorage.getItem('count');
        const storedMove = sessionStorage.getItem('move');
        if (storedCount) {
            setCount(JSON.parse(storedCount));
        }
        if (storedMove) {
            setMove(JSON.parse(storedMove));
        }
    }, []); // Se ejecuta una vez al montar el componente

    useEffect(() => {
        // Evita guardar el estado inicial vacío en sessionStorage
        if (JSON.stringify(count) !== JSON.stringify(initialCount)) {
            sessionStorage.setItem('count', JSON.stringify(count));
        }
        if (JSON.stringify(move) !== JSON.stringify([])) {
            sessionStorage.setItem('move', JSON.stringify(move));
        }
    }, [count, initialCount, move]);

    const createMessage = () => {
        let message = '*Lavadero*:\n\n';
        items.forEach(item => {
            message += `${item}: ${count[item]}\n`;
        });
        return encodeURIComponent(message);
    };

    const sendMessage = () => {
        const message = createMessage();
        const url = `https://api.whatsapp.com/send?text=${message}`;
        window.open(url, '_blank');
    };

    console.log(move);

    return (
        <section className="container mt-5">
            <h1 className="text-center mb-5">Lavadero</h1>
            <div className="row justify-content-center">
                <div className="col-auto">
                    <div className="d-flex flex-column align-items-end gap-3">
                        {items.map((item, index) => (
                            <div key={index} className="mb-1">
                                <strong>{item}</strong>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-auto">
                    <div className="d-flex flex-column gap-2">
                        {items.map((item, index) => (
                            <div key={index} className="d-flex align-items-center mb-1">
                                <button
                                    className="btn btn-success d-flex align-items-center justify-content-center me-1 p-1"
                                    onClick={() => {
                                        setCount({ ...count, [item]: Math.max(0, count[item] - 1) });
                                        setMove([{ item, count: -1 }, ...move]); // Agrega al inicio
                                    }}
                                >
                                    <RemoveIcon fontSize="small" />
                                </button>
                                <span className="border border-dark px-2 text-center">{count[item]}</span>
                                <button
                                    className="btn btn-success d-flex align-items-center justify-content-center ms-1 p-1"
                                    onClick={() => {
                                        setCount({ ...count, [item]: count[item] + 1 });
                                        setMove([{ item, count: 1 }, ...move]); // Agrega al inicio
                                    }}
                                >
                                    <AddIcon fontSize="small" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="row justify-content-center mt-3">
                <div className="col-auto">
                    <button className="btn btn-primary" onClick={sendMessage}>Enviar</button>
                </div>
            </div>
            <section className='mt-5 text-center'>
                <h3>Historial</h3>
                <div className="card mx-auto" style={{ width: '18rem', maxHeight: '200px', overflowY: 'scroll' }}>
                    <ul className="list-group list-group-flush">
                        {move.map((item, index) => (
                            item.count === -1 ?
                            <li key={index} className="list-group-item">{item.item} se ha <span className='text-danger'>reducido</span> en 1</li>
                            :
                            <li key={index} className="list-group-item">{item.item} se ha <span className='text-success'>incrementado</span> en 1</li>
                        ))}
                    </ul>
                </div>
            </section>
        </section>
    );
};

export default Home;
