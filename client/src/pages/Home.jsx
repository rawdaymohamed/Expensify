import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, PlusCircle, Wallet } from "lucide-react";
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
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Expensify
              </h1>
              <p className="text-sm text-slate-500">Track your money simply</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 rounded-xl"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>

        {/* Intro */}
        <section className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back 👋
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Add a transaction and keep an eye on your recent activity in one
            place.
          </p>
        </section>

        {/* Primary action */}
        <section className="mb-8">
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                  <PlusCircle className="h-6 w-6 text-slate-900" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Add Transaction
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Record a new expense or income in a few seconds.
                  </p>
                </div>
              </div>

              <div className="sm:shrink-0">
                <Button
                  onClick={() => navigate("/add-transaction")}
                  className="w-full rounded-xl sm:w-auto"
                >
                  Open form
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Transactions */}
        <section className="pb-6">
          <TransactionsList />
        </section>
      </div>
    </main>
  );
};

export default Home;
