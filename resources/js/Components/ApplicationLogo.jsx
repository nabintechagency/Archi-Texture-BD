export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            src="/images/logo.jpg"
            alt="Logo"
            className={`max-w-full h-auto object-cover ${className}`}
            {...props}
        />
    );
}

