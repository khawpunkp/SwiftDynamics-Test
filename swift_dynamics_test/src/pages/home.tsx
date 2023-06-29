import './home.css';
import { Button, Row } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    {/* Constant to triggered Loading State */}
    const [loading, setLoading] = useState<boolean>(false);

    // Set loading state
    const handleNavigate = (path: string) => {
        setLoading(true); 
        navigate(path);
    };

    return <>
        {/* Render a loading */}
        {loading ? ( 
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <h1>Loading...</h1>
            </div>
        ) : (
            // Render the buttons in home page
            <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                <Button className="HomePageButton" onClick={() => handleNavigate('/layout')}>
                    <p style={{ fontWeight: 'bold' }}>{t('test')} 1</p>
                    <hr style={{ height: '1px', borderWidth: '0', color: 'gray', backgroundColor: 'gray', opacity: '0.1' }} />
                    <p>{t('layout')}</p>
                </Button>
                <Button className="HomePageButton">
                    <p style={{ fontWeight: 'bold' }}>{t('test')} 2</p>
                    <hr style={{ height: '1px', borderWidth: '0', color: 'gray', backgroundColor: 'gray', opacity: '0.1' }} />
                    <p>{t('api')}</p>
                </Button>
                <Button className="HomePageButton" onClick={() => handleNavigate('/form')}>
                    <p style={{ fontWeight: 'bold' }}>{t('test')} 3</p>
                    <hr style={{ height: '1px', borderWidth: '0', color: 'gray', backgroundColor: 'gray', opacity: '0.1' }} />
                    <p>{t('form')}</p>
                </Button>
            </Row>
        )}
    </>
}

export default HomePage;
