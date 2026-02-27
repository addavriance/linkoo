import { useEffect } from "react";

type RedirectProps = {
    to: string;
    replace?: boolean;
};

export function Redirect({ to, replace }: RedirectProps) {
    useEffect(() => {
        if (replace) {
            window.location.replace(to);
        } else {
            window.location.href = to;
        }
    }, [to, replace]);

    return null;
}
