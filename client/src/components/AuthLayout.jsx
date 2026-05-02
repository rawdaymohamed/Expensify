import { Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AuthLayout = ({ title, description, children, footer }) => {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-8 sm:justify-center sm:px-6 sm:py-12">
        <Card className="w-full border-slate-200 py-0 shadow-sm sm:shadow-md">
          <CardHeader className="space-y-6 px-6 pt-6 sm:px-8 sm:pt-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <Wallet className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-slate-900">
                  Expensify
                </p>
                <p className="text-sm text-slate-500">
                  Track your money simply
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-950">
                {title}
              </CardTitle>
              <CardDescription className="leading-6">
                {description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            {children}
          </CardContent>

          {footer && (
            <div className="border-t border-slate-100 px-6 py-4 sm:px-8">
              {footer}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
};

export default AuthLayout;
