import InputForm from '../components/InputForm';

const InputPage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">Banner Generation Setup</h1>
                <p className="text-muted-foreground">Upload your guidelines, copy, and templates to generate banner variations.</p>
            </div>
            <InputForm />
        </div>
    );
};

export default InputPage;
