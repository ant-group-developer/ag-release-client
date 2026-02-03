import * as XLSX from 'xlsx';

export const PERMISSION_TEMPLATE_COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'note', label: 'Note' },
];

export const PERMISSION_TEMPLATE_DATA = [
    {
        name: 'Example Permission',
        code: 'EXAMPLE_PERMISSION',
        note: 'This is an example',
    },
];

export const downloadPermissionTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet(PERMISSION_TEMPLATE_DATA);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 30 }, // name
        { wch: 30 }, // code
        { wch: 40 }, // note
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Permissions');

    XLSX.writeFile(workbook, 'permission_template.xlsx');
};

export interface PermissionImportRow {
    name: string;
    code: string;
    note?: string;
}

export const parsePermissionExcel = (
    file: File
): Promise<PermissionImportRow[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData =
                    XLSX.utils.sheet_to_json<PermissionImportRow>(worksheet);

                // Filter out empty rows and validate required fields
                const validData = jsonData.filter(
                    (row) => row.name && row.code
                );

                resolve(validData);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};
