// import { JSONTree } from 'react-json-tree';
import dynamic from 'next/dynamic';
import type { ReactJsonViewProps } from 'react-json-view';

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

function JsonViewer({ ...props }: ReactJsonViewProps) {
    return (
        <div className="text-wrap rounded-xl bg-white px-2 py-1">
            <ReactJson
                name={false}
                collapsed={3}
                theme={'ocean'}
                displayDataTypes={false}
                style={{
                    maxHeight: 320,
                    overflow: 'auto',
                    ...props.style,
                }}
                {...props}
            />
            {/* <JSONTree hideRoot theme={theme} invertTheme {...props} /> */}
        </div>
    );
}

export default JsonViewer;
