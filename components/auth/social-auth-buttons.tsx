"use client";

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

export function SocialAuthButtons() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-neutral-300">
                <Chrome className="mr-2 h-4 w-4" />
                Google
            </Button>
            <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-neutral-300">
                <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 4.693 9.91 10.206 10.206v-7.227h-3.07v-2.98h3.07v-2.66c0-3.037 1.854-4.695 4.567-4.695 1.298 0 2.65.23 2.65.23v2.915h-1.493c-1.505 0-1.975.932-1.975 1.89v2.247h3.297l-.53 2.98h-2.768v7.228c5.49-.3 10.168-4.904 10.168-10.205 0-6.627-5.373-12-12-12z" />
                </svg>
                Apple
            </Button>
        </div>
    );
}
