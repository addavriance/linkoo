import {Card} from '@/components/ui/card';
import {Link} from 'react-router-dom';
import {useMemo} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import privacyMd from '@/content/PRIVACY.md?raw';

function parseFrontmatter(markdown: string) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
        return {content: markdown, data: {}};
    }

    const frontmatter = match[1];
    const content = match[2];
    const data: Record<string, string> = {};

    frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            data[key.trim()] = valueParts.join(':').trim();
        }
    });

    return {content, data};
}

export default function PrivacyPage() {
    const {content, data} = useMemo(() => parseFrontmatter(privacyMd), []);

    const formattedDate = useMemo(() => {
        if (data.lastUpdated) {
            const date = new Date(data.lastUpdated);
            return date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return new Date().toLocaleDateString('ru-RU');
    }, [data.lastUpdated]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Card className="p-8">
                    <div className="mb-4 text-sm text-gray-600">
                        <strong>Дата последнего обновления:</strong> {formattedDate}
                    </div>

                    <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h1:mb-6 prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                    </div>

                    <div className="pt-6 border-t mt-8">
                        <Link to="/" className="text-blue-600 hover:text-blue-800">
                            ← Вернуться на главную
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
