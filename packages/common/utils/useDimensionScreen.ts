/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';

// Hook
export default function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<{
        width?: number;
        height?: number;
        widthBody?: number;
        HeightBody?: number;
    }>({
        width: undefined,
        height: undefined,
        widthBody: undefined,
        HeightBody: undefined,
    });

    useEffect(() => {
        // only execute all the code below in client side
        if (typeof window !== 'undefined') {
            // Handler to call on window resize
            const handleResize = (): void => {
                // Set window width/height to state
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    widthBody: document.body.clientWidth,
                    HeightBody: document.body.clientHeight,
                });
            };

            // Add event listener
            window.addEventListener('resize', handleResize);

            // Call handler right away so state gets updated with initial window size
            handleResize();

            // Remove event listener on cleanup
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}
