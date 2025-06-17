import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {Toaster} from '@/components/ui/toaster';
import {extractCardDataFromUrl} from '@/lib/compression';

import HomePage from '@/pages/HomePage';
import EditorPage from '@/pages/EditorPage';
import ViewPage from '@/pages/ViewPage.jsx';
import ThemesPage from '@/pages/ThemesPage';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function App() {
    const [cardData, setCardData] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    // Проверяем URL при загрузке приложения
    useEffect(() => {
        const urlData = extractCardDataFromUrl();
        if (urlData) {
            setCardData(urlData);
            setIsViewMode(true);
        }
    }, []);

    // Если это режим просмотра карточки, показываем ток карточку
    if (isViewMode && cardData) {
        return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <ViewPage cardData={cardData}/>
                <Toaster/>
            </div>);
    }

    return (<Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header */}
                <Header/>

                {/* Main Content */}
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/editor" element={<EditorPage/>}/>
                        <Route path="/themes" element={<ThemesPage/>}/>
                        <Route path="/view" element={<ViewPage/>}/>
                    </Routes>
                </main>

                {/* Footer */}
                <Footer/>

                {/* Toast notifications */}
                <Toaster/>
            </div>
        </Router>);
}

export default App;
