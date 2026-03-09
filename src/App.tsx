import {BrowserRouter as Router, Routes, Route,} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { DialogProvider } from '@/contexts/DialogContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { lazy, Suspense } from 'react';

import HomePage from '@/pages/HomePage';
import ViewPage from '@/pages/ViewPage.jsx';

const EditorPage = lazy(() => import('@/pages/EditorPage'));
const ThemesPage = lazy(() => import('@/pages/ThemesPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const CardsPage = lazy(() => import('@/pages/CardsPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const PremiumPage = lazy(() => import('@/pages/PremiumPage'));
const SubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'));
const PaymentResultPage = lazy(() => import('@/pages/PaymentResultPage'));
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminCardsPage = lazy(() => import('@/pages/admin/AdminCardsPage'));
const AdminLinksPage = lazy(() => import('@/pages/admin/AdminLinksPage'));

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
                <Suspense fallback={null}>
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
                </Suspense>
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
        <HelmetProvider>
        <ThemeProvider>
            <AuthProvider>
            <DialogProvider>
                <Router>
                    <ScrollToTop/>
                    <Suspense fallback={null}>
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
                    </Suspense>

                    <Toaster position="top-right" richColors closeButton />
                    <CookieConsent/>
                </Router>
            </DialogProvider>
            </AuthProvider>
        </ThemeProvider>
        </HelmetProvider>
    );
}

export default App;
