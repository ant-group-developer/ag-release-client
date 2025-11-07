import { createContext, PropsWithChildren, useContext, useState } from 'react';

type LabelContextType = {
    headerLayoutHeight: number;
    setHeaderLayoutHeight: (height: number) => void;
};

const LabelContext = createContext<LabelContextType>({
    headerLayoutHeight: 0,
    setHeaderLayoutHeight: () => {},
});

export const useLabelContext = () => useContext(LabelContext);

export const LabelProvider = ({ children }: PropsWithChildren) => {
    const [headerLayoutHeight, setHeaderLayoutHeight] = useState(0);
    return (
        <LabelContext.Provider
            value={{ headerLayoutHeight, setHeaderLayoutHeight }}
        >
            {children}
        </LabelContext.Provider>
    );
};
