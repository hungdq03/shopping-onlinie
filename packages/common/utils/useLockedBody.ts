import { useEffect, useLayoutEffect, useState } from 'react';

function useLockedBody(initialLocked = false) {
    const [locked, setLocked] = useState(initialLocked);
    useLayoutEffect(() => {
        if (locked !== initialLocked) {
            setLocked(initialLocked);
        }
    }, [initialLocked]);
    useEffect(() => {
        if (!locked) {
            return () => {};
        }
        // const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        const scrollBarWidth = window.innerWidth - document.body.clientWidth;
        document.body.style.overflow = 'hidden';
        if (scrollBarWidth) {
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        }
        return () => {
            document.body.style.overflow = 'auto';
            if (scrollBarWidth) {
                document.body.style.paddingRight = originalPaddingRight;
            }
        };
    }, [locked]);
    return [locked, setLocked];
}
export default useLockedBody;
