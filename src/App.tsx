import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

import HomePage from '@/pages/HomePage';
import EditorPage from '@/pages/EditorPage';
import ViewPage from '@/pages/ViewPage.jsx';
import ThemesPage from '@/pages/ThemesPage';
import ProfilePage from '@/pages/ProfilePage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import AboutPage from '@/pages/AboutPage';
import ApiDocsPage from '@/pages/ApiDocsPage';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import {ScrollToTop} from "@/components/common/ScrollToTop.tsx";
import {CookieConsent} from "@/components/common/CookieConsent.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop/>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                    {/* Header */}
                    <Header/>

                    {/* Main Content */}
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/about" element={<AboutPage/>}/>
                            <Route path="/editor" element={<EditorPage/>}/>
                            <Route path="/themes" element={<ThemesPage/>}/>
                            <Route path="/view" element={<ViewPage/>}/>
                            <Route path="/profile" element={<ProfilePage/>}/>
                            <Route path="/auth/callback" element={<AuthCallbackPage/>}/>
                            <Route path="/privacy" element={<PrivacyPage/>}/>
                            <Route path="/terms" element={<TermsPage/>}/>
                            <Route path="/api" element={<ApiDocsPage/>}/>
                            {/* Catch-all route for short links - MUST be last */}
                            <Route path="/:slug" element={<ViewPage/>}/>
                        </Routes>
                    </main>

                    {/* Footer */}
                    <Footer/>

                    {/* Toast notifications */}
                    <Toaster position="top-right" richColors closeButton />

                    {/* Cookie Consent */}
                    <CookieConsent/>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
