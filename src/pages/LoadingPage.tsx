interface LoadingPageProps {
    target?: string;
    children?: React.ReactNode;
}

export const LoadingPage = ({target, children}: LoadingPageProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br wd:(from-blue-50 via-white to-purple-50)">
            <div className="text-center">
                <div className="flex gap-2 justify-center mb-4">
                    <div className="w-3 h-3 wd:bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 wd:bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 wd:bg-blue-600 rounded-full animate-bounce"></div>
                </div>
                <p className="wd:text-gray-600">Загружаем {target || ''}...</p>
            </div>
            {children}
        </div>
    )
}
