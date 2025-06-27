type Props = {
    message: string | undefined;
    isError: boolean;
};

export default function ErrorText({ isError, message }: Props) {
    if (!isError || !message) return null;
    return <p className="text-red-500">{message}</p>;
}
