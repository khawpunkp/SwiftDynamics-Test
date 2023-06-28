import './App.css';
import { Select, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/home';
import { useEffect, useState } from 'react';
import LayoutPage from './pages/layout';
import FormPage from './pages/form';

function App() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

    const handleNavigateHome = () => {
        setLoading(true); // Set loading state to true before changing the path
        navigate('/');
        setLoading(false);
    };

  const handleChangeLanguage = (selectLanguage: string) => {
    setLanguage(selectLanguage);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
      <div className="App" style={{ background: 'linear-gradient(to right, #6eda78, #ffa200)' }}>
        <Select
          // style={{ width: '70px' }}
          value={i18n.language} // Set default value to current language
          onChange={handleChangeLanguage} // Call handleChangeLanguage when the selection changes
          style={{ position: 'absolute', top: '10px', right: '10px', width: '75px' }}
        >
          <Select.Option value="en">{t('english')}</Select.Option>
          <Select.Option value="th">{t('thai')}</Select.Option>
        </Select>

        <Button
          style={{ position: 'absolute', top: '60px', right: '10px' }}
          onClick={() => handleNavigateHome()}
        >
          {t('home')}
        </Button>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/layout' element={<LayoutPage loading = {loading} />} />
          <Route path='/form' element={<FormPage loading = {loading}/>} />
        </Routes>
      </div>
  );
}

export default App;
