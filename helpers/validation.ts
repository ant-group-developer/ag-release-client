export const validatePassword = (
    rule: any,
    value: any,
    callback: any,
    message = 'Mật khẩu phải có ít nhất 8 kí tự, bao gồm ít nhất 1 chữ thường, 1 chữ hoa và 1 số'
) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const isValid = regex.test(value);

    if (value && isValid) {
        callback();
    } else {
        callback(message);
    }
};

export function standardString(strInput: string, convertToUppercase: boolean) {
    strInput = strInput.trim().toLowerCase();
    while (strInput.includes('  ')) {
        strInput = strInput.replace('  ', ' ');
    }
    if (strInput.length > 0) {
        let text = '';
        const array = strInput.split(' ');
        if (convertToUppercase) {
            array.forEach((text2) => {
                text += text2.charAt(0).toUpperCase() + text2.slice(1) + ' ';
            });
        } else {
            array.forEach((text3) => {
                text += text3 + ' ';
            });
        }
        return text.trimEnd();
    }
    return strInput;
}
