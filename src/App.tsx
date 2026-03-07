import {BrowserRouter as Router, Routes, Route,} from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DialogProvider } from '@/contexts/DialogContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

import HomePage from '@/pages/HomePage';
import EditorPage from '@/pages/EditorPage';
import ViewPage from '@/pages/ViewPage.jsx';
import ThemesPage from '@/pages/ThemesPage';
import ProfilePage from '@/pages/ProfilePage';
import CardsPage from '@/pages/CardsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import SecurityPage from '@/pages/SecurityPage';
import SettingsPage from '@/pages/SettingsPage';
import PremiumPage from '@/pages/PremiumPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import PaymentResultPage from '@/pages/PaymentResultPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import AboutPage from '@/pages/AboutPage';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminCardsPage from '@/pages/admin/AdminCardsPage';
import AdminLinksPage from '@/pages/admin/AdminLinksPage';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { DialogContainer } from '@/components/dialogs/DialogContainer';
import { Toaster } from 'sonner';
import {ScrollToTop} from "@/components/common/ScrollToTop.tsx";
import {CookieConsent} from "@/components/common/CookieConsent.tsx";
import {Redirect} from "@/components/Redirect.tsx";
import {initUserIdentity} from "@/lib/userIdentity.ts";
import {LoadingPage} from "@/pages/LoadingPage.tsx";

function MainLayout() {
    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="/editor" element={<EditorPage/>}/>
                    <Route path="/themes" element={<ThemesPage/>}/>
                    <Route path="/view" element={<ViewPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/cards" element={<CardsPage/>}/>
                    <Route path="/analytics/:cardId" element={<AnalyticsPage/>}/>
                    <Route path="/security" element={<SecurityPage/>}/>
                    <Route path="/settings" element={<SettingsPage/>}/>
                    <Route path="/premium" element={<PremiumPage/>}/>
                    <Route path="/subscription" element={<SubscriptionPage/>}/>
                    <Route path="/premium/payment-result" element={<PaymentResultPage/>}/>
                    <Route path="/auth/callback" element={<AuthCallbackPage/>}/>
                    <Route path="/privacy" element={<PrivacyPage/>}/>
                    <Route path="/terms" element={<TermsPage/>}/>
                    <Route path="/api" element={
                        <LoadingPage target="документацию">
                            <Redirect to="/api-docs/" replace />
                        </LoadingPage>
                    }/>
                    {/* Catch-all route for short links - MUST be last */}
                    <Route path="/:slug" element={<ViewPage/>}/>
                </Routes>
            </main>
            <Footer/>
            <DialogContainer/>
        </div>
    );
}

interface AppProps {
    subdomain?: string | null;
}

function App({subdomain}: AppProps = {}) {

    const userIdentity = initUserIdentity({
        storageKey: 'luid',
        cookieExpiryDays: 30,
        enableLogging: false,
    });

    userIdentity.getUserId();

    if (subdomain) {
        return (
            <Router>
                <Routes>
                    <Route path="*" element={<ViewPage subdomain={subdomain}/>}/>
                </Routes>
                <Toaster position="top-right" richColors closeButton/>
            </Router>
        );
    }

    return (
        <ThemeProvider>
            <AuthProvider>
            <DialogProvider>
                <Router>
                    <ScrollToTop/>
                    <Routes>
                        {/* Admin panel — no header/footer */}
                        <Route path="/admin" element={<AdminLayout/>}>
                            <Route index element={<AdminDashboard/>}/>
                            <Route path="users" element={<AdminUsersPage/>}/>
                            <Route path="cards" element={<AdminCardsPage/>}/>
                            <Route path="links" element={<AdminLinksPage/>}/>
                        </Route>

                        {/* Main app layout */}
                        <Route path="*" element={<MainLayout/>}/>
                    </Routes>

                    <Toaster position="top-right" richColors closeButton />
                    <CookieConsent/>
                </Router>
            </DialogProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
