import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, LogOut, Plus, Sparkles, Wallet } from "lucide-react";
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
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </header>

        {/* Transactions */}
        <section id="recent-transactions" className="pb-24">
          <TransactionsList />
        </section>
      </div>

      {/* Floating Add Button */}
      <div className="pointer-events-none fixed bottom-6 left-0 right-0 z-50">
        <div className="mx-auto flex max-w-5xl justify-end px-4 sm:px-6 lg:px-8">
          <Button
            onClick={() => navigate("/add-transaction")}
            size="icon"
            className="pointer-events-auto h-16 w-16 rounded-full bg-black text-white shadow-lg hover:bg-black/90"
            aria-label="Add transaction"
          >
            <Plus className="h-10 w-10" strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Home;
