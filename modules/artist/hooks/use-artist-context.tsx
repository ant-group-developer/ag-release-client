import { createContext, PropsWithChildren, useContext, useState } from 'react';

type ArtistContextType = {
    headerLayoutHeight: number;
    setHeaderLayoutHeight: (height: number) => void;
};

const ArtistContext = createContext<ArtistContextType>({
    headerLayoutHeight: 0,
    setHeaderLayoutHeight: () => {},
});

export const useArtistContext = () => useContext(ArtistContext);

export const ArtistProvider = ({ children }: PropsWithChildren) => {
    const [headerLayoutHeight, setHeaderLayoutHeight] = useState(0);
    return (
        <ArtistContext.Provider
            value={{ headerLayoutHeight, setHeaderLayoutHeight }}
        >
            {children}
        </ArtistContext.Provider>
    );
};
