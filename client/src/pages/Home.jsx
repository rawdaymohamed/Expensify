import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, LogOut, PlusCircle, Sparkles, Wallet } from "lucide-react";
import TransactionsList from "@/components/TransactionsList";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Top bar */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Expensify
              </h1>
              <p className="text-sm text-slate-500">Track your money simply</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 rounded-xl border-slate-200 bg-white px-4"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>

        {/* Hero section */}
        <section className="mb-8">
          <Card className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="relative">
                {/* soft background accent */}
                <div className="absolute inset-0" />
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-slate-100 blur-3xl" />
                <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-slate-100/70 blur-2xl" />

                <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[1.3fr_0.9fr] md:items-center">
                  {/* left content */}
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                      <Sparkles className="h-4 w-4" />
                      Your finance dashboard
                    </div>

                    <h2 className="max-w-xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                      Welcome back 👋
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      Quickly add a transaction and keep your recent activity in
                      one clean place without extra clutter.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button
                        onClick={() => navigate("/add-transaction")}
                        className="h-11 rounded-xl px-5 text-sm font-medium"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add transaction
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          const section = document.getElementById(
                            "recent-transactions",
                          );
                          section?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="h-11 rounded-xl border-slate-200 bg-white px-5 text-sm font-medium"
                      >
                        View recent activity
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* right summary card */}
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-inner">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <PlusCircle className="h-5 w-5 text-slate-900" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Quick action
                        </p>
                        <p className="text-sm text-slate-500">
                          Record income or expense
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Fast entry</span>
                        <span className="font-medium text-slate-900">
                          Under a minute
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Supports</span>
                        <span className="font-medium text-slate-900">
                          Income & Expense
                        </span>
                      </div>
                      <div className="pt-2">
                        <Button
                          onClick={() => navigate("/add-transaction")}
                          className="w-full rounded-xl"
                        >
                          Open form
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Transactions */}
        <section id="recent-transactions" className="pb-6">
          <TransactionsList />
        </section>
      </div>
    </main>
  );
};

export default Home;
