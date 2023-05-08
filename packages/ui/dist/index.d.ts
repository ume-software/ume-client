import React, { ReactNode, ChangeEventHandler, FocusEventHandler, MouseEventHandler } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    helper?: ReactNode;
    children?: any;
    value?: string;
    customCSS?: string;
    loadingIconColor?: 'white' | 'black';
    isLoading?: boolean;
    isOutlinedButton?: boolean;
    isDisabled?: boolean;
    icon?: ReactNode;
}
declare const Button: ({ helper, children, customCSS, loadingIconColor, isLoading, isOutlinedButton, icon, type, isDisabled, ...props }: ButtonProps) => JSX.Element;

interface TextInputProps {
    icon?: ReactNode;
    type: string;
    placeholder?: string;
    name: string;
    value: string;
    disabled?: boolean;
    title?: string | undefined;
    onChange: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    onClick?: MouseEventHandler<HTMLInputElement>;
    help?: boolean;
    state?: string | undefined;
    subtitle?: ReactNode;
    error?: string;
    className?: string;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
}
declare const TextInput: ({ icon, type, placeholder, name, value, disabled, required, title, onChange, onClick, onBlur, state, subtitle, className, error, minLength, maxLength, }: TextInputProps) => JSX.Element;

export { Button, TextInput };
