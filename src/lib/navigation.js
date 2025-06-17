export const getBaseUrl = () => {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const origin = window.location.origin;
    const basePath = isGitHubPages ? '/linkoo' : '';
    return `${origin}${basePath}`;
};

export const createInternalUrl = (path = '/') => {
    return `${getBaseUrl()}${path}`;
};

export const openInNewTab = (path = '/') => {
    window.open(createInternalUrl(path), '_blank');
};

export const navigateToExternal = (path = '/') => {
    window.location.href = createInternalUrl(path);
};
