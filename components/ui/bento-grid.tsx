import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

import Link from "next/link";

export const BentoCard = ({
    className,
    title,
    description,
    header,
    icon,
    href,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    href?: string;
}) => {
    const CardContent = (
        <div
            className={cn(
                "row-span-1 rounded-none group/bento hover:shadow-2xl transition duration-500 shadow-input dark:shadow-none p-4 bg-black border border-white/10 justify-between flex flex-col space-y-4 relative overflow-hidden h-full",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200">
                {icon}
                <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                    {title}
                </div>
                <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
                    {description}
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href} className={cn("block h-full", className && className.includes("col-span") ? className : "")}>{CardContent}</Link>;
    }

    return CardContent;
};
