import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DialogProvider } from '@/contexts/DialogContext';

import HomePage from '@/pages/HomePage';
import EditorPage from '@/pages/EditorPage';
import ViewPage from '@/pages/ViewPage.jsx';
import ThemesPage from '@/pages/ThemesPage';
import ProfilePage from '@/pages/ProfilePage';
import CardsPage from '@/pages/CardsPage';
import SecurityPage from '@/pages/SecurityPage';
import SettingsPage from '@/pages/SettingsPage';
import PremiumPage from '@/pages/PremiumPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import PaymentResultPage from '@/pages/PaymentResultPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import AboutPage from '@/pages/AboutPage';
import ApiDocsPage from '@/pages/ApiDocsPage';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { DialogContainer } from '@/components/dialogs/DialogContainer';
import { Toaster } from 'sonner';
import {ScrollToTop} from "@/components/common/ScrollToTop.tsx";
import {CookieConsent} from "@/components/common/CookieConsent.tsx";

function App() {
    return (
        <AuthProvider>
            <DialogProvider>
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
                                <Route path="/cards" element={<CardsPage/>}/>
                                <Route path="/security" element={<SecurityPage/>}/>
                                <Route path="/settings" element={<SettingsPage/>}/>
                                <Route path="/premium" element={<PremiumPage/>}/>
                                <Route path="/subscription" element={<SubscriptionPage/>}/>
                                <Route path="/premium/payment-result" element={<PaymentResultPage/>}/>
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

                        {/* Global Dialogs */}
                        <DialogContainer/>

                        {/* Toast notifications */}
                        <Toaster position="top-right" richColors closeButton />

                        {/* Cookie Consent */}
                        <CookieConsent/>
                    </div>
                </Router>
            </DialogProvider>
        </AuthProvider>
    );
}

export default App;
