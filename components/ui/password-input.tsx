"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    required?: boolean
    minLength?: number
    className?: string
    showStrength?: boolean
}

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
    if (!password) return { label: "", color: "", width: "0%" }

    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" }
    if (score <= 3) return { label: "Medium", color: "bg-yellow-500", width: "66%" }
    return { label: "Strong", color: "bg-green-500", width: "100%" }
}

export function PasswordInput({
    value,
    onChange,
    placeholder = "Password",
    required = false,
    minLength = 6,
    className,
    showStrength = false,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const strength = getPasswordStrength(value)

    return (
        <div className="space-y-2">
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    className={cn(
                        "w-full h-10 px-3 py-2 pr-10 bg-neutral-900/50 border border-neutral-800 rounded-md text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all",
                        className
                    )}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    minLength={minLength}
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>

            {showStrength && value && (
                <div className="space-y-1">
                    <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-300", strength.color)}
                            style={{ width: strength.width }}
                        />
                    </div>
                    <p className={cn(
                        "text-xs",
                        strength.label === "Weak" && "text-red-500",
                        strength.label === "Medium" && "text-yellow-500",
                        strength.label === "Strong" && "text-green-500"
                    )}>
                        {strength.label}
                    </p>
                </div>
            )}
        </div>
    )
}
