type Props = {
    message: string | undefined;
    isError: boolean;
};

export default function ErrorText({ isError, message }: Props) {
    return (
        <p className="absolute left-0 top-full mb-1 text-red-500">{message}</p>
    );
}
